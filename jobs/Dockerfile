FROM golang:1.14

WORKDIR /app
COPY . .
RUN go get -u github.com/gin-gonic/gin
RUN go get -u gopkg.in/confluentinc/confluent-kafka-go.v1/kafka
RUN go get -u github.com/satori/go.uuid


RUN go get -u github.com/aws/aws-sdk-go/aws
RUN go get -u github.com/aws/aws-sdk-go/aws/session
RUN go get -u github.com/aws/aws-sdk-go/aws/credentials
RUN go get -u github.com/aws/aws-sdk-go/service/dynamodb
RUN go get -u github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute
RUN go get -u github.com/aws/aws-sdk-go/service/dynamodb/expression

CMD ["go","run","main.go"]