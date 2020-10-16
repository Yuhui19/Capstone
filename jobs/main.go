package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	// "gopkg.in/confluentinc/confluent-kafka-go.v1/kafka"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"

	"encoding/json"
	"io/ioutil"
	"os"
)

type Item struct {
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
	fmt.Println(scrapeResult)
	items = scrapeResult.Data
	fmt.Println(items)
    return items
}

func main() {

	//===========================================

	// run the router
	router := gin.Default()
	router.GET("/api/jobs", func(c *gin.Context) {
		mySession, err := session.NewSession(
			&aws.Config{
				Region: aws.String("us-east-1"),
				Credentials: credentials.NewStaticCredentials("ASIAQOOYYKP4SLFOKHQD", "ZcnOlWHEAELQ8q3kqSmPz0yhAoicmK8ZMh/s9OyW", "FwoGZXIvYXdzEPb//////////wEaDEtHu/qR0Hu0s6RcRSLAAVqaWXVzA2iz1D3pNaV3HdLLZH7/IUmsmnPVohJcpQLFarhszW+QmlogjlH7tZc/swtRSspFWZ6Ng5wYK6oqQw5MqdMtdC75Z27LZuqah7c9qtS3ZmUJr0gWOja/bHw3a0kujx6kbV3FJ1qzMPq303XXbv9T/CY4+PBs3qyx3vbR0/IHOlHgBaomsNMHt+bGwBir3jBPv017sJnDtvVh8cj3xehB01yJ5FS7o5+pPOfJ+Zsf5lAdZsLtZ2SEYWLGQCj+1Pj7BTIt8iZ9U3AxqM1SDbE6XpzFHHg6ix0bNahuEcFt0QM2b1ZmMTWvX8gtpAzS1dsh"),
			},
		)

		if err != nil {
			fmt.Println("Got error configuring session")
			fmt.Println(err.Error())
			// os.Exit(1)
		}

		// Create DynamoDB client
		svc := dynamodb.New(mySession)

		tableName := "Jobs"

		// Get back all fields of a job post
		proj := expression.NamesList(expression.Name("query"), expression.Name("location"), expression.Name("title"), expression.Name("company"), expression.Name("place"), expression.Name("link"), expression.Name("date"), expression.Name("senorityLevel"), expression.Name("function"), expression.Name("employmentType"), expression.Name("industries"))

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

		items := make([]Item, 10)
		for idx, i := range result.Items {
			item := Item{}
		
			err = dynamodbattribute.UnmarshalMap(i, &item)
			// fmt.Println(item)
			if err != nil {
				fmt.Println("Got error unmarshalling:")
				fmt.Println(err.Error())
				os.Exit(1)
			}
			
			items[idx] = item

		}


		c.JSON(200, gin.H{
			"data": items,
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

	// // Create Session with MaxRetries configuration to be shared by multiple service clients.
	// mySession, err := session.NewSession(
	// 	&aws.Config{
	// 		Region: aws.String("us-east-1"),
	// 		Credentials: credentials.NewStaticCredentials("ASIAQOOYYKP46YKPIFOB", "x7h+DYIvk0cya5J75LCsdc63OpELuE5x7X/v4FnU", "FwoGZXIvYXdzELD//////////wEaDAcaucRd81J+Ln0gsiLAAXlxt3Kgjv/Ts+wUKdsbsu9Cb+iieO03yzVSpkWPsHhUejbb4oMrOC6DyaJ24HKxPmFCkBeZbwDENpuc7IunWgXcxb3+owOim5nDn9RxH43hLb5yH7JmHnV/Y/hIxBjP3v5QLjv2FUkku/FT3SuxYtlIqQktdd+Yu0vuADGCrAf8Zvp5xRUjlncs5FMl1jt6gsVrnMjNwEU+GUbwbG9F+TSbNaL61Niqi0xtQqHfekOBMvJmgQC+Cxv2S/2D8uDdVyivnen7BTItq3sEdXjT3r5168H8THKFaXbyrPIR78P6rFX3IEVBfsYeSfezhJuqD8rRqBq3"),
	// 	},
	// )

	// if err != nil {
	// 	fmt.Println("Got error configuring session")
    //     fmt.Println(err.Error())
    //     // os.Exit(1)
	// }

	// // Create DynamoDB client
	// svc := dynamodb.New(mySession)

	// // Get table items from movie_data.json
	// items := getItems()

	// // Add each item to Movies table:
	// tableName := "Jobs"

	// for _, item := range items {
	// 	av, err := dynamodbattribute.MarshalMap(item)
	// 	if err != nil {
	// 		fmt.Println("Got error marshalling map:")
	// 		fmt.Println(err.Error())
	// 		os.Exit(1)
	// 	}

	// 	// Create item in table Movies
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

	// 	fmt.Println("Successfully added '" + item.Title + "' (" + item.Company + ") to table " + tableName)
	// }

	//===========================================
	


}

