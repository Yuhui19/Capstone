FROM golang:1.14

WORKDIR /app
COPY . .

RUN go get -u github.com/gin-gonic/gin
RUN go get -u github.com/aws/aws-sdk-go/aws
RUN go get -u github.com/aws/aws-sdk-go/aws/session
RUN go get -u github.com/aws/aws-sdk-go/service/dynamodb
RUN go get -u github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute
RUN go get -u github.com/dgrijalva/jwt-go
RUN go get -u github.com/aws/aws-sdk-go/service/s3
RUN go get -u github.com/aws/aws-sdk-go/service/s3/s3manager

CMD ["go","run","main.go"]