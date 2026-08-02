FROM golang:tip-alpine3.24 AS dev

WORKDIR /app

RUN apk add --no-cache git
RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum* ./
RUN go mod download

COPY . .

CMD [ "air", "-c", "air.toml" ]