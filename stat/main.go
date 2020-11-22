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
	"github.com/aws/aws-sdk-go/service/dynamodb/expression"

	// "github.com/dgrijalva/jwt-go"
	// "encoding/json"
	// "io/ioutil"
	"os"
	"sort"
	// "time"
	// "log"

	// "github.com/sendgrid/sendgrid-go"
	// "github.com/sendgrid/sendgrid-go/helpers/mail"

)

// Create the JWT key used to create the signature
var jwtKey = []byte("my_secret_key")



type Application struct {
	Id          string    `json:"id"`
	Email       string    `json:"email"`
	Status      string    `json:"status"`
	StatusCode  int       `json:"statusCode"`
	Date        string    `json:"date"`
	Company     string    `json:"company"`
	Title       string    `json:"title"`
	Link        string    `json:"link"`
	JobId       string    `json:"jobId"`
}


type Profile struct {
	Email     string `json:"email"`
	Name string `json:"name"`
	Major string `json:"major"`
	University string `json:"university"`
	CurrentDegree string `json:"currentDegree"`
	GraduateDate string `json:"graduateDate"`
	JobHuntingType string `json:"jobHuntingType"`
	Resume string `json:"resume"`
}



type StatusStat struct {
	Applied              int
	Online_Assessment    int
	Phone_Interview      int
	Onsite_Interview     int
	Offer                int
	Rejected             int
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

type UniversityCount struct {
	University string `json:"university"`
    Count   int  `json:"count"`
}

type MajorCount struct {
	Major string `json:"major"`
    Count   int  `json:"count"`
}

type DegreeCount struct {
	Degree string `json:"degree"`
    Count   int  `json:"count"`
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




// TODO
func main() {

	// get AWS session
	mySession := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	// Create DynamoDB client
	svc := dynamodb.New(mySession)




	//=========================================================
	// gin-gonic route handler

	router := gin.New();
	router.Use(CORSMiddleware())

	// TODO: get all applicant's statistics per jobId
	router.GET("/api/stat/:jobId", func(c *gin.Context) {


		// TODO: get jobId from the request url params
		jobId := c.Param("jobId")
		fmt.Println("The job ID of which the current user wants to get stat is: ", jobId)


		statusStat := StatusStat{
			Applied: 0,
			Online_Assessment: 0,
			Phone_Interview: 0,
			Onsite_Interview: 0,
			Offer: 0,
			Rejected: 0,
		}

		// initiate the map and arrays of for statistics
		universityMap := make(map[string]int)
		var universityCounts []UniversityCount

		majorMap := make(map[string]int)
		var majorCounts []MajorCount

		degreeMap := make(map[string]int)
		var degreeCounts []DegreeCount

		

		// get candidates' application per jobId
		num, applications := findAllApplicationsByJobId(svc, jobId, "Applications") 
		if num == 0 {
			c.JSON(http.StatusOK, gin.H{
				"jobId": jobId,
				"statusStat": statusStat,
				"universityStat": universityCounts,
				"majorStat": majorCounts,
				"degreeStat": degreeCounts,
			})
			return
		} 
		for _, item := range applications {
			switch item.StatusCode {
			case 1:
				statusStat.Applied = statusStat.Applied + 1
			case 2:
				statusStat.Online_Assessment = statusStat.Online_Assessment + 1
			case 3:
				statusStat.Phone_Interview = statusStat.Phone_Interview + 1
			case 4:
				statusStat.Onsite_Interview = statusStat.Onsite_Interview + 1
			case 5:
				statusStat.Offer = statusStat.Offer + 1
			case 6:
				statusStat.Rejected = statusStat.Rejected + 1
			default:
				break
			}

			_profile, _ := findOneProfileByEmail(svc, item.Email, "Profiles")
		
			// if the map doesn't have a key, insert a KV pair
			// otherwise, increase the value by 1
			university_prev_count, university_prs := universityMap[_profile.University]
			if !university_prs {
				universityMap[_profile.University] = 1
			} else {
				universityMap[_profile.University] = university_prev_count + 1
			}

			major_prev_count, major_prs := majorMap[_profile.Major]
			if !major_prs {
				majorMap[_profile.Major] = 1
			} else {
				majorMap[_profile.Major] = major_prev_count + 1
			}


			degree_prev_count, degree_prs := degreeMap[_profile.CurrentDegree]
			if !degree_prs {
			    degreeMap[_profile.CurrentDegree] = 1
			} else {
				degreeMap[_profile.CurrentDegree] = degree_prev_count + 1
			}
		}

		for k, v := range universityMap {
			universityCounts = append(universityCounts, UniversityCount{k, v})
		}
		sort.Slice(universityCounts, func(i, j int) bool {
			return universityCounts[i].Count < universityCounts[j].Count
		})

		for k, v := range majorMap {
			majorCounts = append(majorCounts, MajorCount{k, v})
		}
		sort.Slice(majorCounts, func(i, j int) bool {
			return majorCounts[i].Count < majorCounts[j].Count
		})

		for k, v := range degreeMap {
			degreeCounts = append(degreeCounts, DegreeCount{k, v})
		}
		sort.Slice(degreeCounts, func(i, j int) bool {
			return degreeCounts[i].Count < degreeCounts[j].Count
		})
		// universityStat, _ := json.Marshal(universityCounts)

		c.JSON(http.StatusOK, gin.H{
			"jobId": jobId,
			"statusStat": statusStat,
			"universityStat": universityCounts,
			"majorStat": majorCounts,
			"degreeStat": degreeCounts,
		})

	})



	router.Run(":8085")


}







func findAllApplicationsByJobId(svc *dynamodb.DynamoDB, jobId string, tableName string) (num int, applications []Application) {

	filt := expression.Name("jobId").Equal(expression.Value(jobId))
	proj := expression.NamesList(expression.Name("id"), expression.Name("email"), expression.Name("company"), expression.Name("date"), expression.Name("status"), expression.Name("statusCode"))
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


