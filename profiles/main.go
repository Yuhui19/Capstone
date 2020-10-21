package main

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	// "github.com/satori/go.uuid"
	// "golang.org/x/crypto/bcrypt"
	// "regexp"
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
	// "os"
	// "time"
)




// Binding from JSON
type Profile struct {
	Email     string `json:"email"`
	Name string `json:"name" binding:"required"`
	Major string `json:"major" binding:"required"`
	CurrentDegree string `json:"currentDegree" binding:"required"`
	University string `json:"university" binding:"required"`
	GraduateDate string `json:"graduateDate" binding:"required"`
	JobHuntingType string `json:"jobHuntingType" binding:"required"`
	Resume string `json:"resume"`
	Experience []Experience `json:"experience"`
}

type Experience struct {
	Company string `json:"company"`
	Title string `json:"title"`
	StartMonth int `json:"startMonth"`
	StartYear int `json:"startYear"`
	EndMonth int `json:"endMonth"`
	EndYear int `json:"endYear"`
	Description string `json:"description"`
}


// Create the JWT key used to create the signature
var jwtKey = []byte("my_secret_key")


// Create a struct that will be encoded to a JWT.
// We add jwt.StandardClaims as an embedded type, to provide fields like expiry time
type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

func CurrentUser() gin.HandlerFunc {
	return func(c *gin.Context) {
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

		// Set example variable
		c.Set("currentUser", claims.Email)

		// before request

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
	tableName := "Profiles"


	router := gin.New();
	router.Use(CurrentUser())

	router.POST("/api/profiles", func(c *gin.Context) {

		// get the user email from the JWT
		email := c.MustGet("currentUser").(string)
		fmt.Println("The current user is: ", email)


		var profileJson Profile
		// check if the profile info has been included in the json body
		if err := c.ShouldBindJSON(&profileJson); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		profileJson.Email = email

		// create a new user profile entry in the database
		ok := createNewProfile(svc, profileJson, tableName)
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create new profile for current user"})
			return
		}
		
		c.JSON(http.StatusOK, gin.H{
			"result": "create a new profile successfully!",
			"data": profileJson,
		})
	})



	router.GET("/api/profiles", func(c *gin.Context) {

		// get the user email from the JWT
		email := c.MustGet("currentUser").(string)
		fmt.Println("The current user is: ", email)

		// get the user's profile from the database, if cannot find such user, return error
		profile, ok := findOneProfileByEmail(svc, email, tableName)
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "The user's profile doesn't exist"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"profile": profile,
		})

	})

	router.Run(":8082")
	
}



func findOneProfileByEmail(svc *dynamodb.DynamoDB, email string, tableName string) (profile Profile, ok bool){
	_profile := Profile{}
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
		return _profile, false
	}

	if result.Item == nil {
		return _profile, false
	}
		
	err = dynamodbattribute.UnmarshalMap(result.Item, &_profile)
	if err != nil {
		// panic(fmt.Sprintf("Failed to unmarshal Record, %v", err))
		return _profile, false
	}

	return _profile, true
}



func createNewProfile(svc *dynamodb.DynamoDB, profile Profile, tableName string) bool {

	
	av, err := dynamodbattribute.MarshalMap(profile)
	if err != nil {
		fmt.Println("Got error marshalling new user")
		fmt.Println(err.Error())
		return false;
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(tableName),
	}
	
	_, err = svc.PutItem(input)
	if err != nil {
		fmt.Println("Got error calling PutItem:")
		fmt.Println(err.Error())
		return false;
	}
	return true
}