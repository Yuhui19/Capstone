package main

import (
	"fmt"
	// "github.com/gin-gonic/gin"
	"gopkg.in/confluentinc/confluent-kafka-go.v1/kafka"
)

func main() {
	// router := gin.Default()
	// router.GET("/api/jobs", func(c *gin.Context) {
	// 	c.JSON(200, gin.H{
	// 		"message": "pong",
	// 	})
	// })
	// router.Run()

	c, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": "kaf1-srv",
		"group.id":          "myGroup",
		"auto.offset.reset": "earliest",
	})

	if err != nil {
		panic(err)
	}

	c.SubscribeTopics([]string{"test-topic", "^aRegex.*[Tt]opic"}, nil)

	for {
		msg, err := c.ReadMessage(-1)
		if err == nil {
			fmt.Printf("Message on %s: %s\n", msg.TopicPartition, string(msg.Value))
		} else {
			// The client will automatically try to recover from all errors.
			fmt.Printf("Consumer error: %v (%v)\n", err, msg)
		}
	}

	c.Close()
}

