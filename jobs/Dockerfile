FROM golang:1.14

WORKDIR /app
COPY . .
RUN go get -u github.com/gin-gonic/gin
CMD ["go","run","main.go"]