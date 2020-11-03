package main

import (
	"fmt"

	"github.com/gin-gonic/gin"

	"gopkg.in/confluentinc/confluent-kafka-go.v1/kafka"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"

	// "github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"

	"github.com/satori/go.uuid"
	"encoding/json"
	"io/ioutil"
	"os"
	"net/http"

)

type Item struct {
	Id             string `json:"id"`
	Query          string `json:"query"`
	Location       string `json:"location"`
	Title          string `json:"title"`
	Company        string `json:"company"`
	Place          string `json:"place"`
	Date           string `json:"date"`
	Link           string `json:"link"`
	SenorityLevel  string `json:"senorityLevel"`
	Function       string `json:"function"`
	EmploymentType string `json:"employmentType"`
	Industries     string `json:"industries"`
}


type CreateJobRequest struct {
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


type ScrapeResult struct {
	Time string `json:"time"`
	Data []Item `json:"data"`
}

// Get table items from JSON file
func getItems() []Item {
	raw, err := ioutil.ReadFile("./linkedin_output.json")
	// fmt.Println(raw)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	var items []Item
	var scrapeResult ScrapeResult
	json.Unmarshal(raw, &scrapeResult)
	// fmt.Println(scrapeResult)
	items = scrapeResult.Data
	// for i,_ := range items {
	// 	uid := uuid.Must(uuid.NewV4())
	// 	items[i].Id = uid.String()
	// 	// fmt.Println(item.Id)
	// }
	// fmt.Println(items)
	return items
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

	// ===================================================
	// AWS setup

	mySession := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))


	// Create DynamoDB client
	svc := dynamodb.New(mySession)

	tableName := "Jobs"

	// ================================================
	// Kafka Producer setup 

	p, err := kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": "kaf1-srv"})

	if err != nil {
		fmt.Printf("Failed to create producer: %s\n", err)
		os.Exit(1)
	}


	//===========================================

	//run the router
	router := gin.Default()
	router.Use(CORSMiddleware())
	router.GET("/api/jobs", func(c *gin.Context) {

		// Get back all fields of a job post
		proj := expression.NamesList(expression.Name("id"), expression.Name("query"), expression.Name("location"), expression.Name("title"), expression.Name("company"), expression.Name("place"), expression.Name("link"), expression.Name("date"), expression.Name("senorityLevel"), expression.Name("function"), expression.Name("employmentType"), expression.Name("industries"))

		expr, err := expression.NewBuilder().WithProjection(proj).Build()
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



		_items := []Item{}
		for _, i := range result.Items {

			item := Item{}

			err = dynamodbattribute.UnmarshalMap(i, &item)
			// fmt.Println(item)
			if err != nil {
				fmt.Println("Got error unmarshalling:")
				fmt.Println(err.Error())
				os.Exit(1)
			}
	

			_items = append(_items, item)


		}

		c.JSON(200, gin.H{
			"data": _items,
		})
	})



	// create a new job
	router.POST("/api/jobs", func(c *gin.Context) {


		// get the info of the job waiting to be created from the request body
		var createJobRequest CreateJobRequest
		if err := c.ShouldBindJSON(&createJobRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// create an application object and store it to the database
		uid := uuid.Must(uuid.NewV4())
		item := Item{
			Id: uid.String(),
			Query: createJobRequest.Query,
			Location: createJobRequest.Location,
			Title: createJobRequest.Title,
			Company: createJobRequest.Company,
			Place: createJobRequest.Place,
			Date: createJobRequest.Date,
			Link: createJobRequest.Link,
			SenorityLevel: createJobRequest.SenorityLevel,
			Function: createJobRequest.Function,
			EmploymentType: createJobRequest.EmploymentType,
			Industries: createJobRequest.Industries,
		}
		createNewJob(svc, item, tableName)


		// send a message to subscriptions service
		// the topic should be "job-created"
		topic := "job-created"
		bytes, err := json.Marshal(item)
		if err != nil {
			fmt.Println(err)
		}
		p.Produce(&kafka.Message{
			TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
			Value:          bytes,
		}, nil)

		// Wait for message deliveries before shutting down
		p.Flush(15 * 1000)
		fmt.Println("send message to subscription service: " + string(bytes))


		// http response
		c.JSON(http.StatusOK, gin.H{
			"id": item.Id,
			"query": item.Query,
			"location": item.Location,
			"title": item.Title,
			"company": item.Company,
			"place": item.Place,
			"date": item.Date,
			"link": item.Link,
			"senorityLevel": item.SenorityLevel,
			"function": item.Function,
			"employmentType": item.EmploymentType,
			"industries": item.Industries,
		})
	})

	router.Run()

	//===========================================

	// kafka consumer client
	// c, err := kafka.NewConsumer(&kafka.ConfigMap{
	// 	"bootstrap.servers": "kaf1-srv",
	// 	"group.id":          "myGroup",
	// 	"auto.offset.reset": "earliest",
	// })

	// if err != nil {
	// 	panic(err)
	// }

	// c.SubscribeTopics([]string{"test-topic", "^aRegex.*[Tt]opic"}, nil)

	// for {
	// 	msg, err := c.ReadMessage(-1)
	// 	if err == nil {
	// 		fmt.Printf("Message on %s: %s\n", msg.TopicPartition, string(msg.Value))
	// 	} else {
	// 		// The client will automatically try to recover from all errors.
	// 		fmt.Printf("Consumer error: %v (%v)\n", err, msg)
	// 	}
	// }
	// c.Close()

	//===========================================

	// fmt.Println("get ready to put items to table")

	// mySession := session.Must(session.NewSessionWithOptions(session.Options{
	// 	SharedConfigState: session.SharedConfigEnable,
	// }))

	// // Create DynamoDB client
	// svc := dynamodb.New(mySession)

	// // Get table items from movie_data.json
	// items := getItems()

	// // Add each item to Movies table:
	// tableName := "Jobs"

	// for i,_ := range items {
	// 	uid := uuid.Must(uuid.NewV4())
	// 	items[i].Id = uid.String()
	// 	// fmt.Println(item)
	// 	av, err := dynamodbattribute.MarshalMap(items[i])
	// 	if err != nil {
	// 		fmt.Println("Got error marshalling map:")
	// 		fmt.Println(err.Error())
	// 		os.Exit(1)
	// 	}

	// 	// Create item in table Jobs
	// 	input := &dynamodb.PutItemInput{
	// 		Item:      av,
	// 		TableName: aws.String(tableName),
	// 	}

	// 	_, err = svc.PutItem(input)
	// 	if err != nil {
	// 		fmt.Println("Got error calling PutItem:")
	// 		fmt.Println(err.Error())
	// 		os.Exit(1)
	// 	}

	// 	fmt.Println("Successfully added job to database")
	// }

	//===========================================

}


func createNewJob(svc *dynamodb.DynamoDB, item Item, tableName string) {

	av, err := dynamodbattribute.MarshalMap(item)
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

