FROM golang:1.14

WORKDIR /app
COPY . .
RUN go get -u github.com/gin-gonic/gin
RUN go get -u gopkg.in/confluentinc/confluent-kafka-go.v1/kafka
CMD ["go","run","main.go"]