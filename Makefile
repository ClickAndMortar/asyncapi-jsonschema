all: docker

default: docker

docker:
	docker build -t asyncapi-jsonschema:latest -f Dockerfile .

