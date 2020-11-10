package main

import (
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/satori/go.uuid"
	// "golang.org/x/crypto/bcrypt"
	// "regexp"
	"gopkg.in/confluentinc/confluent-kafka-go.v1/kafka"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	// "github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"

	"github.com/dgrijalva/jwt-go"
	"encoding/json"
	// "io/ioutil"
	"os"
	"time"
	"log"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"

)

// Create the JWT key used to create the signature
var jwtKey = []byte("my_secret_key")

// Binding from JSON
type CreateSubscriptionRequest struct {
	Company     string `json:"company" binding:"required"`
}

// Binding from JSON
type CancelSubscriptionRequest struct {
	Id     string `json:"id" binding:"required"`
}

type Subscription struct {
	Id          string    `json:"id"`
	Email       string    `json:"email"`
	Date        string    `json:"date"`
	Company     string    `json:"company"`
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

type EmailRequest struct {
	Email string `json:"email"`
    Location  string  `json:"location"`
    Title   string  `json:"title"`
	Company string  `json:"company"`
	Link string  `json:"link"`
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



func jobCreatedListener(svc *dynamodb.DynamoDB) {
	consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": "kaf1-srv",
		"group.id":          "myGroup",
		"auto.offset.reset": "earliest",
	})

	if err != nil {
		panic(err)
	}

	consumer.SubscribeTopics([]string{"job-created", "^aRegex.*[Tt]opic"}, nil)
	fmt.Println("kafka consumer created!")

	
		
	for {
		fmt.Println("kafka consumer is waiting for new message")
		msg, err := consumer.ReadMessage(-1)
		if err == nil {
			fmt.Printf("Message on %s: %s\n", msg.TopicPartition, string(msg.Value))
	
			// parse the message to a Job struct and get the company
			var createdJob Job
			json.Unmarshal(msg.Value, &createdJob)
	
			// find all the subscription with this company from the Subscription database
			_, subscriptions := findAllSubscriptionsByCompany(svc, createdJob.Company, "Subscriptions")
	
			// TODO: send email to every subscriber
			for _, i := range subscriptions {
				from := mail.NewEmail("Techcareer Hub", "noreply@techcareerhub.com")
				subject := "New Job Postings from Your Subscribed Company"
				to := mail.NewEmail("Example User", i.Email)
				plainTextContent := "Here is lastest job posted on linkedin by the companies you have subscribed"
				htmlContent := "<strong>Company: " + createdJob.Company + "</strong><p>Title: " + createdJob.Title + "</p><p>Location: " + createdJob.Location + "</p><p>Apply Link: " + createdJob.Link + "</p>"
				message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
				client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
				response, err := client.Send(message)
				if err != nil {
					log.Println(err)
				} else {
					fmt.Println(response.StatusCode)
					fmt.Println(response.Body)
					fmt.Println(response.Headers)
				}
	
			}
	
		} else {
			// The client will automatically try to recover from all errors.
			fmt.Printf("Consumer error: %v (%v)\n", err, msg)
		}
	}
}




func main() {

	// get AWS session
	mySession := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	// Create DynamoDB client
	svc := dynamodb.New(mySession)


	// run jobCreatedListener in a Goroutine
	go jobCreatedListener(svc)


	//=========================================================
	// gin-gonic route handler

	router := gin.New();
	router.Use(CORSMiddleware())
	router.Use(CurrentUser())
	// create a new subscription
	router.POST("/api/subscriptions", func(c *gin.Context) {

		// get the user email from the JWT
		email := c.MustGet("currentUser").(string)
		fmt.Println("The current user is: ", email)

		// get company from the request body
		var createSubscriptionRequest CreateSubscriptionRequest
		if err := c.ShouldBindJSON(&createSubscriptionRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		fmt.Println("The subscribed company is: ", createSubscriptionRequest.Company)

		// TODO: find if the user has already subscribed to the company
		if canFindSubscriptionByEmailAndCompany(svc, email, createSubscriptionRequest.Company, "Subscriptions") {
			// http response
			c.JSON(http.StatusBadRequest, gin.H{
				"result": "The current user has subscribed to this company!",
			})
		} else {
			// create an subscription entry and store it to the database
			uid := uuid.Must(uuid.NewV4())
			currentTime := time.Now()
			subscription := Subscription{
				Id: uid.String(),
				Email: email,
				Date: currentTime.Format("2006-01-02"),
				Company: createSubscriptionRequest.Company,
			}
			createNewSubscription(svc, subscription, "Subscriptions")


			// http response
			c.JSON(http.StatusOK, gin.H{
				"id": subscription.Id,
				"email": subscription.Email,
				"date": subscription.Date,
				"company": subscription.Company,
			})
		}

	})


	// get all subscriptions of currentuser
	router.GET("/api/subscriptions", func(c *gin.Context) {
		
		// get the user email from the JWT
		email := c.MustGet("currentUser").(string)
		fmt.Println("The current user is: ", email)

		// get all subscriptions belonging to current user from the database
		count, subscriptions := findAllSubscriptionsByEmail(svc, email, "Subscriptions")

		c.JSON(http.StatusOK, gin.H{
			"count": count,
			"data": subscriptions,
		})
	})
	


	// delete(cancel) one subscription
	router.DELETE("/api/subscriptions", func(c *gin.Context) {

		// get the user email from the JWT
		email := c.MustGet("currentUser").(string)
		fmt.Println("The current user is: ", email)
		
		// get subscription id from the request body
		var cancelSubscriptionRequest CancelSubscriptionRequest
		if err := c.ShouldBindJSON(&cancelSubscriptionRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		fmt.Println("The subscription id is: ", cancelSubscriptionRequest.Id)

		// delete the subscription info in the database
		ok := deleteSubscription(svc, cancelSubscriptionRequest.Id, "Subscriptions")
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to cancel subscription"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"result": "cancel the subscription successfully!",
			"id": cancelSubscriptionRequest.Id,
		})
	})

	// example route to send emails
	router.POST("/api/subscriptions/emails", func(c *gin.Context) {
		type EmailRequest struct {
			Email string `json:"email"`
			Location  string  `json:"location"`
			Title   string  `json:"title"`
			Company string  `json:"company"`
			Link string  `json:"link"`
		}


		// get  job info from the request body
		var emailRequest EmailRequest
		if err := c.ShouldBindJSON(&emailRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		fmt.Println("The email address is: ", emailRequest.Email)
	
		// send email
		from := mail.NewEmail("Techcareer Hub", "noreply@techcareerhub.com")
		subject := "New Job Postings from Your Subscribed Company"
		to := mail.NewEmail("Example User", emailRequest.Email)
		plainTextContent := "Here is lastest job posted on linkedin by the companies you have subscribed"
		htmlContent := "<strong>Company: " + emailRequest.Company + "</strong><p>Title: " + emailRequest.Title + "</p><p>Location: " + emailRequest.Location + "</p><p>Apply Link: " + emailRequest.Link + "</p>"
		message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
		client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
		response, err := client.Send(message)
		if err != nil {
			log.Println(err)
		} else {
			fmt.Println(response.StatusCode)
			fmt.Println(response.Body)
			fmt.Println(response.Headers)
		}

	
		c.JSON(http.StatusOK, gin.H{
			"result": "send email successfully!",
		})
	})

	router.Run(":8084")


}






func createNewSubscription(svc *dynamodb.DynamoDB, newSubscription Subscription, tableName string) {

	av, err := dynamodbattribute.MarshalMap(newSubscription)
	if err != nil {
		fmt.Println("Got error marshalling new subscription")
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






func findAllSubscriptionsByEmail(svc *dynamodb.DynamoDB, email string, tableName string) (num int, subscriptions []Subscription) {

	filt := expression.Name("email").Equal(expression.Value(email))
	proj := expression.NamesList(expression.Name("id"), expression.Name("email"), expression.Name("company"), expression.Name("date"))
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
	_subscriptions := []Subscription{}

	for _, i := range result.Items {
		item := Subscription{}

		err = dynamodbattribute.UnmarshalMap(i, &item)

		if err != nil {
			fmt.Println("Got error unmarshalling:")
			fmt.Println(err.Error())
			os.Exit(1)
		}

		numItems++;
		_subscriptions = append(_subscriptions, item)
	}

	return numItems, _subscriptions

}


func canFindSubscriptionByEmailAndCompany(svc *dynamodb.DynamoDB, email string, company string, tableName string) bool {

	filt := expression.Name("email").Equal(expression.Value(email))
	proj := expression.NamesList(expression.Name("id"), expression.Name("email"), expression.Name("company"), expression.Name("date"))
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

	
	for _, i := range result.Items {
		item := Subscription{}

		err = dynamodbattribute.UnmarshalMap(i, &item)

		if err != nil {
			fmt.Println("Got error unmarshalling:")
			fmt.Println(err.Error())
			os.Exit(1)
		}

		if item.Company == company {
			return true
		}
	}
	return false

}





func findAllSubscriptionsByCompany(svc *dynamodb.DynamoDB, company string, tableName string) (num int, subscriptions []Subscription) {

	filt := expression.Name("company").Equal(expression.Value(company))
	proj := expression.NamesList(expression.Name("id"), expression.Name("email"), expression.Name("company"), expression.Name("date"))
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
	_subscriptions := []Subscription{}

	for _, i := range result.Items {
		item := Subscription{}

		err = dynamodbattribute.UnmarshalMap(i, &item)

		if err != nil {
			fmt.Println("Got error unmarshalling:")
			fmt.Println(err.Error())
			os.Exit(1)
		}

		numItems++;
		_subscriptions = append(_subscriptions, item)
	}

	return numItems, _subscriptions

}




func deleteSubscription(svc *dynamodb.DynamoDB, id string, tableName string) bool {

	input := &dynamodb.DeleteItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"id": {
				S: aws.String(id),
			},
		},
		TableName: aws.String(tableName),
	}
	
	_, err := svc.DeleteItem(input)
	if err != nil {
		fmt.Println("Got error calling DeleteItem")
		fmt.Println(err.Error())
		return false
	}

	return true

}

