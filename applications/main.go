package main

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/satori/go.uuid"
	// "golang.org/x/crypto/bcrypt"
	// "regexp"
	// "gopkg.in/confluentinc/confluent-kafka-go.v1/kafka"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	// "github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"

	"github.com/dgrijalva/jwt-go"
	// "encoding/json"
	// "io/ioutil"
	"os"
	"time"
	"strconv"

)

// Create the JWT key used to create the signature
var jwtKey = []byte("my_secret_key")

// Binding from JSON
type CreateApplicationRequest struct {
	JobId     string `json:"jobId" binding:"required"`
}

type UpdateStatusRequest struct {
	StatusCode   int    `json:"statusCode" binding:"required"`
}

type Application struct {
	Id          string    `json:"id"`
	Email       string    `json:"email"`
	Status      string    `json:"status"`
	StatusCode  int       `json:"statusCode"`
	Date        string    `json:"date"`
	Company     string    `json:"company"`
	Title       string    `json:"title"`
	Link        string    `json:"link"`
}

type Job struct {
	Id string `json:"id"`
    Query   string  `json:"query"`
    Location  string  `json:"location"`
    Title   string  `json:"title"`
	Company string  `json:"company"`
	Place string   `json:"place"`
	Date string  `json:"date"`
	Link string  `json:"link"`
	SenorityLevel string  `json:"senorityLevel"`
	Function string  `json:"function"`
	EmploymentType string  `json:"employmentType"`
	Industries string  `json:"industries"`
}

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

	router := gin.New();
	router.Use(CurrentUser())

	// create a new application
	router.POST("/api/applications", func(c *gin.Context) {

		// get the user email from the JWT
		email := c.MustGet("currentUser").(string)
		fmt.Println("The current user is: ", email)

		// get jobId from the request body
		var createApplicationRequest CreateApplicationRequest
		if err := c.ShouldBindJSON(&createApplicationRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		fmt.Println("The current jobId is: ", createApplicationRequest.JobId)


		// get company, title, link from the  database per the jobId
		job, ok := findOneJobById(svc, createApplicationRequest.JobId, "Jobs")
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "This job doesn't exist"})
			return
		}
		fmt.Println(job)


		// check if the user already applied for this role
		if canfindOneApplicationByJobAndEmail(svc, job.Company, email, job.Title, "Applications") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "You have applied for this job"})
			return
		}


		// create an application object and store it to the database
		uid := uuid.Must(uuid.NewV4())
		currentTime := time.Now()
		application := Application{
			Id: uid.String(),
			Email: email,
			Status: "applied",
			StatusCode: 1,
			Date: currentTime.Format("2006-01-02"),
			Company: job.Company,
			Title: job.Title,
			Link: job.Link,
		}
		createNewApplication(svc, application, "Applications")


		// http response
		c.JSON(http.StatusOK, gin.H{
			"id": application.Id,
			"email": application.Email,
			"status": application.Status,
			"statusCode": application.StatusCode,
			"date": application.Date,
			"company": application.Company,
			"title": application.Title,
			"link": application.Link,
		})
	})


	// get all applicaitons
	router.GET("/api/applications", func(c *gin.Context) {
		

		// get the user email from the JWT
		email := c.MustGet("currentUser").(string)
		fmt.Println("The current user is: ", email)

		// get all applicaiton belonging to current user from the database
		count, applications := findAllApplicationsByEmail(svc, email, "Applications")

		c.JSON(http.StatusOK, gin.H{
			"count": count,
			"data": applications,
		})
	})
	


	// update the status of an application
	router.PUT("/api/applications/:id", func(c *gin.Context) {

		// get the user email from the JWT
		email := c.MustGet("currentUser").(string)
		fmt.Println("The current user is: ", email)
		
		// get statusCode from the request body
		var updateStatusRequest UpdateStatusRequest
		if err := c.ShouldBindJSON(&updateStatusRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// update the application info in the database
		applicationId := c.Param("id")
		ok := updateApplicationStatus(svc, applicationId, updateStatusRequest.StatusCode, email, "Applications")
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update application"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"result": "update the application status successfully!",
			"id": applicationId,
			"statusCode": updateStatusRequest.StatusCode,
		})
	})

	router.Run(":8081")

}



func findOneJobById(svc *dynamodb.DynamoDB, jobId string, tableName string) (job Job, ok bool){
	_job := Job{}
	result, err := svc.GetItem(&dynamodb.GetItemInput{
		TableName: aws.String(tableName),
		Key: map[string]*dynamodb.AttributeValue{
			"id": {
				S: aws.String(jobId),
			},
		},
	})
	if err != nil {
		fmt.Println(err.Error())
		return _job, false
	}

	if result.Item == nil {
		return _job, false
	}
		
	err = dynamodbattribute.UnmarshalMap(result.Item, &_job)
	if err != nil {
		// panic(fmt.Sprintf("Failed to unmarshal Record, %v", err))
		return _job, false
	}

	return _job, true
}





func createNewApplication(svc *dynamodb.DynamoDB, newApplication Application, tableName string) {

	av, err := dynamodbattribute.MarshalMap(newApplication)
	if err != nil {
		fmt.Println("Got error marshalling new application")
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




func canfindOneApplicationByJobAndEmail(svc *dynamodb.DynamoDB, company string, email string, 
	title string, tableName string) bool {

	filt := expression.Name("email").Equal(expression.Value(email))
	proj := expression.NamesList(expression.Name("email"), expression.Name("company"), expression.Name("title"))
	expr, err := expression.NewBuilder().WithFilter(filt).WithProjection(proj).Build()
	if err != nil {
		fmt.Println("Got error building expression:")
		fmt.Println(err.Error())
		os.Exit(1)
	}

	// Build the query input parameters
	params := &dynamodb.ScanInput{
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		FilterExpression:          expr.Filter(),
		ProjectionExpression:      expr.Projection(),
		TableName:                 aws.String(tableName),
	}

	// Make the DynamoDB Query API call
	result, err := svc.Scan(params)
	if err != nil {
		fmt.Println("Query API call failed:")
		fmt.Println((err.Error()))
		os.Exit(1)
	}

	numItems := 0

	for _, i := range result.Items {
		item := Application{}

		err = dynamodbattribute.UnmarshalMap(i, &item)

		if err != nil {
			fmt.Println("Got error unmarshalling:")
			fmt.Println(err.Error())
			os.Exit(1)
		}

		// Which ones had a higher rating than minimum?
		if (item.Company == company && item.Title == title) {
			// Or it we had filtered by rating previously:
			//   if item.Year == year {
			numItems++
		}
	}

	return numItems == 1

}


func findAllApplicationsByEmail(svc *dynamodb.DynamoDB, email string, tableName string) (num int, applications []Application) {

	filt := expression.Name("email").Equal(expression.Value(email))
	proj := expression.NamesList(expression.Name("id"), expression.Name("email"), expression.Name("company"), expression.Name("date"), expression.Name("link"), expression.Name("status"), expression.Name("statusCode"), expression.Name("title"))
	expr, err := expression.NewBuilder().WithFilter(filt).WithProjection(proj).Build()
	if err != nil {
		fmt.Println("Got error building expression:")
		fmt.Println(err.Error())
		os.Exit(1)
	}

	// Build the query input parameters
	params := &dynamodb.ScanInput{
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		FilterExpression:          expr.Filter(),
		ProjectionExpression:      expr.Projection(),
		TableName:                 aws.String(tableName),
	}

	// Make the DynamoDB Query API call
	result, err := svc.Scan(params)
	if err != nil {
		fmt.Println("Query API call failed:")
		fmt.Println((err.Error()))
		os.Exit(1)
	}

	numItems := 0
	_applications := []Application{}

	for _, i := range result.Items {
		item := Application{}

		err = dynamodbattribute.UnmarshalMap(i, &item)

		if err != nil {
			fmt.Println("Got error unmarshalling:")
			fmt.Println(err.Error())
			os.Exit(1)
		}

		numItems++;
		_applications = append(_applications, item)
	}

	return numItems, _applications

}




func updateApplicationStatus(svc *dynamodb.DynamoDB, id string, statusCode int, email string, tableName string) bool {

	var status string
	if statusCode == 1 {
		status = "applied"
	} else if statusCode == 2 {
		status = "online assessment"
	} else if statusCode == 3 {
		status = "phone interview"
	} else if statusCode == 4 {
		status = "onsite interview"
	} else if statusCode == 5 {
		status = "offer"
	} else {
		status = "rejected"
	}

	type ApplicationKey struct {
		Id  string    `json:"id"`
		Email string  `json:"email"`
	}
	key, _err := dynamodbattribute.MarshalMap(ApplicationKey{ 
		Id:  id,
		Email: email,
	})
	if _err != nil {
		fmt.Println(_err.Error())
		return false
	}

	s := "status"

	input := &dynamodb.UpdateItemInput{
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":c": {
				N: aws.String(strconv.Itoa(statusCode)),
			},
			":s": {
				S: aws.String(status),
			},
		},
		ExpressionAttributeNames: map[string]*string{"#st": &s},
		TableName: aws.String(tableName),
		Key: key,
		ReturnValues:     aws.String("UPDATED_NEW"),
		UpdateExpression: aws.String("set statusCode = :c, #st=:s"),
	}

	_, err := svc.UpdateItem(input)
	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	return true

}

