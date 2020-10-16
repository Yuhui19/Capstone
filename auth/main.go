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
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	// "github.com/aws/aws-sdk-go/service/dynamodb/expression"

	// "encoding/json"
	// "io/ioutil"
	"os"
)


// Binding from JSON
type User struct {
	Email     string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}


func main() {

	mySession, err := session.NewSession(
		&aws.Config{
			Region: aws.String("us-east-1"),
			Credentials: credentials.NewStaticCredentials("ASIAQOOYYKP45QWY75CW", "+i3lbnjfmdITyV0BQqdX3PM04zIG+qkJDHkkC0uh", "FwoGZXIvYXdzEL///////////wEaDIZo7wh7SfxnxvlRxiLAAc04B5WxwmVB/827HE826tm3X3auFqvJWIQZ+IiYa494N33ym9LcpPuDZez5wShAHI5j/GTTIXK+4ARC6V9cWyFpemHfegSa1gR3g03zzcNWm0Inx9g4ZyPet9ElxD96cAFGiQ6yh1jyZJMgWbe0XjOzKfixkgAMlNDtjs/jG6QOmA3pZXl1MLHGdffCdRE6nloZO9AYSB1Rg0jj5rO37MF4t8Scf6WDxX6S2oKKGCXw+zelQSmIt9btV+0P10CmLCiY5qT8BTItmmtV2kWIo5mjM2hyQm4egjlqeFUX2Ush6PEBVWf9HvGtUkFlGeoFpYBfS5dR"),
		},
	)
	if err != nil {
		fmt.Println("Got error configuring session")
		fmt.Println(err.Error())
		// os.Exit(1)
	}

	// Create DynamoDB client
	svc := dynamodb.New(mySession)

	// define the table name
	tableName := "Users"



	router := gin.Default()
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
	    if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(userJson.Password)); err != nil {
		    // If the two passwords don't match, return a 401 status
			c.JSON(http.StatusBadRequest, gin.H{"error": "password doesn't match"})
			return
		}
		
		c.JSON(http.StatusOK, gin.H{
			"result": "you have logged in!",
		})
		
	})



	// router.POST("/api/users/signout", func(c *gin.Context) {

	// })

	// router.GET("/api/users/currentuser", func(c *gin.Context) {

	// })

	router.Run()
	
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
		panic(fmt.Sprintf("Failed to unmarshal Record, %v", err))
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





