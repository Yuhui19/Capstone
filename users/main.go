package main

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	// "github.com/satori/go.uuid"
	"golang.org/x/crypto/bcrypt"
	"regexp"
	// "gopkg.in/confluentinc/confluent-kafka-go.v1/kafka"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	// "github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	// "github.com/aws/aws-sdk-go/service/dynamodb/expression"

	"github.com/dgrijalva/jwt-go"
	// "encoding/json"
	// "io/ioutil"
	"os"
	"time"
)


// Binding from JSON
type User struct {
	Email     string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Create the JWT key used to create the signature
var jwtKey = []byte("my_secret_key")


// Create a struct that will be encoded to a JWT.
// We add jwt.StandardClaims as an embedded type, to provide fields like expiry time
type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}



func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {

        c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
        c.Header("Access-Control-Allow-Credentials", "true")
        c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, Set-Cookie")
		c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")
		c.Header("Access-Control-Expose-Headers", "Set-Cookie")   
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}




func main() {

	// get AWS session
	mySession := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	// Create DynamoDB client
	svc := dynamodb.New(mySession)

	// define the table name
	tableName := "Users"



	router := gin.Default()
	router.Use(CORSMiddleware())
	router.POST("/api/users/signup", func(c *gin.Context) {
		var userJson User

		// check if the credential info provided in the json body has all the fields required
		if err := c.ShouldBindJSON(&userJson); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// check if the email address is valid
		if !isEmailValid(userJson.Email) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid email address"})
			return
		}

		// try to find a user with the same email, if can find such one, then return error
		user, ok := findOneUserByEmail(svc, userJson.Email, tableName)
		if ok {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "email already exists",
				"email": user.Email,
				"password": user.Password,
			})
			return
		}

		// hash and salt the password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userJson.Password), 8)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		hashedPasswordStr := string(hashedPassword)


		// create a user in the database
		createNewUser(svc, userJson.Email, hashedPasswordStr, tableName)


		// Declare the expiration time of the token
		// here, we have kept it as 5 minutes
		expirationTime := time.Now().Add(10 * time.Minute)
		// Create the JWT claims, which includes the username and expiry time
		claims := &Claims{
			Email: userJson.Email,
			StandardClaims: jwt.StandardClaims{
				// In JWT, the expiry time is expressed as unix milliseconds
				ExpiresAt: expirationTime.Unix(),
			},
		}

		// Declare the token with the algorithm used for signing, and the claims
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		// Create the JWT string
		tokenString, err := token.SignedString(jwtKey)
		if err != nil {
			// If there is an error in creating the JWT return an internal server error
			c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot create a jwt"})
			return
		}

		// Finally, we set the client cookie for "token" as the JWT we just generated
		// we also set an expiry time which is the same as the token itself
		// c.SetCookie("token", tokenString, int(expirationTime.Unix() * 1000), "/", "techcareerhub.dev", false, false)
		http.SetCookie(c.Writer,&http.Cookie{
			Name:       "token",  //Your cookie's name
			Value:      tokenString,  //cookie value
			Path:       "/",
			Domain:     "techcareerhub.dev",
			MaxAge:     int(expirationTime.Unix() * 1000),
			Secure:     true,
			HttpOnly:   false,
			SameSite:   4,  // samesite=none
		})
		
		c.JSON(http.StatusOK, gin.H{
			"result": "create a new user successfully!",
			"email": userJson.Email,
			"password": hashedPasswordStr,
		})
	})




	router.POST("/api/users/signin", func(c *gin.Context) {
		var userJson User
		if err := c.ShouldBindJSON(&userJson); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// check if the email address is valid
		if !isEmailValid(userJson.Email) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid email address"})
			return
		}
		
		// get the user's info from the database, if cannot find such user, return error
		user, ok := findOneUserByEmail(svc, userJson.Email, tableName)
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "unauthorized email!"})
			return
		}

		// if can find such one, Compare the stored hashed password, with the hashed version of the password that was received
	    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userJson.Password)); err != nil {
		    // If the two passwords don't match, return a 401 status
			c.JSON(http.StatusBadRequest, gin.H{"error": "password doesn't match"})
			return
		}

		// Declare the expiration time of the token
		// here, we have kept it as 5 minutes
		expirationTime := time.Now().Add(10 * time.Minute)
		// Create the JWT claims, which includes the username and expiry time
		claims := &Claims{
			Email: userJson.Email,
			StandardClaims: jwt.StandardClaims{
				// In JWT, the expiry time is expressed as unix milliseconds
				ExpiresAt: expirationTime.Unix(),
			},
		}

		// Declare the token with the algorithm used for signing, and the claims
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		// Create the JWT string
		tokenString, err := token.SignedString(jwtKey)
		if err != nil {
			// If there is an error in creating the JWT return an internal server error
			c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot create a jwt"})
			return
		}

		// Finally, we set the client cookie for "token" as the JWT we just generated
		// we also set an expiry time which is the same as the token itself
		// c.SetCookie("token", tokenString, int(expirationTime.Unix() * 1000), "/", "techcareerhub.dev", false, false)
		http.SetCookie(c.Writer,&http.Cookie{
			Name:       "token",  //Your cookie's name
			Value:      tokenString,  //cookie value
			Path:       "/",
			Domain:     "techcareerhub.dev",
			MaxAge:     int(expirationTime.Unix() * 1000),
			Secure:     true,
			HttpOnly:   false,
			SameSite:   4,    // samesite = none
		})
		c.JSON(http.StatusOK, gin.H{
			"result": "you have logged in!",
		})
		
	})



	router.POST("/api/users/signout", func(c *gin.Context) {
		// c.SetCookie("token", "", 0, "/", "techcareerhub.dev", false, false)
		expirationTime := time.Now().Add(5 * time.Minute)
		http.SetCookie(c.Writer,&http.Cookie{
			Name:       "token",  //Your cookie's name
			Value:      "",  //cookie value
			Path:       "/",
			Domain:     "techcareerhub.dev",
			MaxAge:     int(expirationTime.Unix() * 1000),
			Secure:     true,
			HttpOnly:   false,
			SameSite:   4,    // samesite = none
		})
		c.JSON(http.StatusOK, gin.H{
			"result": "you have logged out!",
		})
	})


	router.GET("/api/users/currentuser", func(c *gin.Context) {
		// We can obtain the session token from the requests cookies, which come with every request
		cookie, err := c.Request.Cookie("token")
        if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "no cookie, no jwt, please sign in"})
			return
        }


		// Get the JWT string from the cookie
		tknStr := cookie.Value

		// Initialize a new instance of `Claims`
		claims := &Claims{}

		// Parse the JWT string and store the result in `claims`.
		// Note that we are passing the key in this method as well. This method will return an error
		// if the token is invalid (if it has expired according to the expiry time we set on sign in),
		// or if the signature does not match
		tkn, err := jwt.ParseWithClaims(tknStr, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized user"})
				return
			}
			c.JSON(http.StatusBadRequest, gin.H{"error": "errors when parsing jwt"})
			return
		}
		if !tkn.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid jwt"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"email": claims.Email,
		})

	})

	router.Run(":8081")
	
}




// isEmailValid checks if the email provided passes the required structure and length.
func isEmailValid(e string) bool {
	var emailRegex = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
	if len(e) < 3 && len(e) > 254 {
		return false
	}
	return emailRegex.MatchString(e)
}


func findOneUserByEmail(svc *dynamodb.DynamoDB, email string, tableName string) (user User, ok bool){
	_user := User{}
	result, err := svc.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String(tableName),
		Key: map[string]*dynamodb.AttributeValue{
			"email": {
				S: aws.String(email),
			},
		},
	})
	if err != nil {
		fmt.Println(err.Error())
		return _user, false
	}

	if result.Item == nil {
		return _user, false
	}
		
	err = dynamodbattribute.UnmarshalMap(result.Item, &_user)
	if err != nil {
		// panic(fmt.Sprintf("Failed to unmarshal Record, %v", err))
		return _user, false
	}

	return _user, true
}



func createNewUser(svc *dynamodb.DynamoDB, email string, password string, tableName string) {
	newUser := User{
		Email:   email,
		Password: password,
	}
	
	av, err := dynamodbattribute.MarshalMap(newUser)
	if err != nil {
		fmt.Println("Got error marshalling new user")
		fmt.Println(err.Error())
		os.Exit(1)
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(tableName),
	}
	
	_, err = svc.PutItem(input)
	if err != nil {
		fmt.Println("Got error calling PutItem:")
		fmt.Println(err.Error())
		os.Exit(1)
	}
}





