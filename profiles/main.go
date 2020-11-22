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
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/aws/aws-sdk-go/service/s3"

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
	University string `json:"university" binding:"required"`
	CurrentDegree string `json:"currentDegree" binding:"required"`
	GraduateDate string `json:"graduateDate"`
	JobHuntingType string `json:"jobHuntingType"`
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


type UpdateProfileBasicRequest struct {
	Name string `json:"name" binding:"required"`
	Major string `json:"major" binding:"required"`
	University string `json:"university" binding:"required"`
	CurrentDegree string `json:"currentDegree" binding:"required"`
}


type UpdateProfileJobHuntingTypeRequest struct {
	JobHuntingType string `json:"jobHuntingType" binding:"required"`
}


type UpdateProfileExperienceRequest struct {
	Experience []Experience `json:"experience" binding:"required"`
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


func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {

        c.Header("Access-Control-Allow-Origin", "*")
        c.Header("Access-Control-Allow-Credentials", "true")
        c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")

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
	tableName := "Profiles"


	router := gin.New();
	router.Use(CORSMiddleware())
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



	// get the profile for current authenticated user
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


	// update user's basic profile info
	router.PUT("/api/profiles/basic", func(c *gin.Context) {

		// get the user email from the JWT
		email := c.MustGet("currentUser").(string)
		fmt.Println("The current user is: ", email)

		// get users' profile basic info from the request body
		var updateProfileBasicRequest UpdateProfileBasicRequest
		// check if the profile basic info has been included in the json body
		if err := c.ShouldBindJSON(&updateProfileBasicRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// update the user's profile from the database, if cannot find such user, return error
		ok := updateProfileBasic(svc, email, updateProfileBasicRequest.Name, 
			updateProfileBasicRequest.University, updateProfileBasicRequest.Major, 
			updateProfileBasicRequest.CurrentDegree,tableName)
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update the user's profiel"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"resuult": "update succeed!",
			"updated_item": updateProfileBasicRequest,
		})
	})



	// update user's jobHuntingType
	router.PUT("/api/profiles/job_hunting_type", func(c *gin.Context) {

		// get the user email from the JWT
		email := c.MustGet("currentUser").(string)
		fmt.Println("The current user is: ", email)

		// get users' jobhuntingType from the request body
		var updateProfileJobHuntingTypeRequest UpdateProfileJobHuntingTypeRequest
		// check if the profile basic info has been included in the json body
		if err := c.ShouldBindJSON(&updateProfileJobHuntingTypeRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}


		// update the user's profile from the database, if cannot find such user, return error
		ok := updateProfileJobHuntingType(svc, email, updateProfileJobHuntingTypeRequest.JobHuntingType, tableName)
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update the user's job hunting type"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"result": "update success",
			"updated_item": updateProfileJobHuntingTypeRequest,
		})
	})	


	// upload user's resume
	router.POST("/api/profiles/resume", func(c *gin.Context) {

		// get the user email from the JWT
		email := c.MustGet("currentUser").(string)
		fmt.Println("The current user is: ", email)

		// get user's resume file from the multi-part of request
		formFile, _ , err := c.Request.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get the file from form-data"})
			return
		}
		// formFile, _ := c.FormFile("file")

		// upload user's resume to AWS S3, get the url
		s3Svc := s3.New(mySession)
		bucketName := "techcareerhub-resumes"
		keyName := email + ".pdf"
		uploader := s3manager.NewUploaderWithClient(s3Svc)
		// Upload input parameters
		upParams := &s3manager.UploadInput{
			Bucket: aws.String(bucketName),
			Key:    aws.String(keyName),
			Body:   formFile,
			ACL: aws.String("public-read"),
			ContentType:  aws.String("application/pdf"),
			ContentDisposition: aws.String("inline"),
		}

		// Perform an upload
		_, _err := uploader.Upload(upParams)
		if _err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to upload the user's resume to s3"})
			return
		}

		// get user's resume url
		resumeUrl := "https://techcareerhub-resumes.s3.amazonaws.com/" + keyName


		
		// update the user's profile in the database, if cannot find such user, return error
		ok := updateProfileResume(svc, email, resumeUrl, tableName)
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update the user's resume url"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"result": "upload and update success",
			"resume_url": resumeUrl,
		})
	})		



	// update user's experience
	router.PUT("/api/profiles/experience", func(c *gin.Context) {

		// get the user email from the JWT
		email := c.MustGet("currentUser").(string)
		fmt.Println("The current user is: ", email)

		// get users' experience from the request body
		var updateProfileExperienceRequest UpdateProfileExperienceRequest
		// check if the profile experience info has been included in the json body
		if err := c.ShouldBindJSON(&updateProfileExperienceRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		
		// update the user's profile in the database, if failed, return error
		ok := updateProfileExperience(svc, email, updateProfileExperienceRequest.Experience, tableName)
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update the user's profile"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"result": "update success",
			"updated item": updateProfileExperienceRequest,
		})
	})			

	router.Run(":8083")
	
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


func updateProfileBasic(svc *dynamodb.DynamoDB, email string, name string, university string, major string, degree string, tableName string) bool {


	type ProfileKey struct {
		Email  string    `json:"email"`
	}
	key, _err := dynamodbattribute.MarshalMap(ProfileKey{ 
		Email: email,
	})
	if _err != nil {
		fmt.Println(_err.Error())
		return false
	}

	n := "name"
	input := &dynamodb.UpdateItemInput{
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":n": {
				S: aws.String(name),
			},
			":u": {
				S: aws.String(university),
			},
			":m": {
				S: aws.String(major),
			},
			":d": {
				S: aws.String(degree),
			},
		},
		ExpressionAttributeNames: map[string]*string{"#nm": &n},
		TableName: aws.String(tableName),
		Key: key,
		ReturnValues:     aws.String("UPDATED_NEW"),
		UpdateExpression: aws.String("set #nm=:n, university=:u, major=:m, currentDegree=:d"),
	}

	_, err := svc.UpdateItem(input)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	return true

}



func updateProfileJobHuntingType(svc *dynamodb.DynamoDB, email string, jobHuntingType string, tableName string) bool {

	type ProfileKey struct {
		Email  string    `json:"email"`
	}
	key, _err := dynamodbattribute.MarshalMap(ProfileKey{ 
		Email: email,
	})
	if _err != nil {
		fmt.Println(_err.Error())
		return false
	}


	input := &dynamodb.UpdateItemInput{
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":j": {
				S: aws.String(jobHuntingType),
			},
		},
		// ExpressionAttributeNames: map[string]*string{"#st": &s},
		TableName: aws.String(tableName),
		Key: key,
		ReturnValues:     aws.String("UPDATED_NEW"),
		UpdateExpression: aws.String("set jobHuntingType=:j"),
	}

	_, err := svc.UpdateItem(input)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	return true

}


func updateProfileResume(svc *dynamodb.DynamoDB, email string, resumeUrl string, tableName string) bool {

	type ProfileKey struct {
		Email  string    `json:"email"`
	}
	key, _err := dynamodbattribute.MarshalMap(ProfileKey{ 
		Email: email,
	})
	if _err != nil {
		fmt.Println(_err.Error())
		return false
	}


	input := &dynamodb.UpdateItemInput{
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":r": {
				S: aws.String(resumeUrl),
			},
		},
		// ExpressionAttributeNames: map[string]*string{"#st": &s},
		TableName: aws.String(tableName),
		Key: key,
		ReturnValues:     aws.String("UPDATED_NEW"),
		UpdateExpression: aws.String("set resume=:r"),
	}

	_, err := svc.UpdateItem(input)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	return true

}




func updateProfileExperience(svc *dynamodb.DynamoDB, email string, experience []Experience, tableName string) bool {


	type ProfileKey struct {
		Email string  `json:"email"`
	}
	key, _err := dynamodbattribute.MarshalMap(ProfileKey{ 
		Email: email,
	})
	if _err != nil {
		fmt.Println(_err.Error())
		return false
	}

	// s := "status"
	av, __err := dynamodbattribute.MarshalList(experience)
	if __err != nil {
		fmt.Println("err", __err)
		return false
	}

	input := &dynamodb.UpdateItemInput{
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":e": {
				L: av,
			},
		},
		// ExpressionAttributeNames: map[string]*string{"#st": &s},
		TableName: aws.String(tableName),
		Key: key,
		ReturnValues:     aws.String("UPDATED_NEW"),
		UpdateExpression: aws.String("set experience = :e"),
	}

	_, err := svc.UpdateItem(input)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	return true

}