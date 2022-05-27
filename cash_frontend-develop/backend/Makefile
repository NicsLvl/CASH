TAG := $(shell git rev-parse --short HEAD)

.PHONY: build
build:
	docker build -t cash-app-backend_web_1 .


.PHONY: tag
tag:
	docker tag cash-app-backend_web_1:latest 867896627554.dkr.ecr.ap-southeast-1.amazonaws.com/cash-app-backend_web:$(TAG)


.PHONY: push
push: tag build
	docker push 867896627554.dkr.ecr.ap-southeast-1.amazonaws.com/cash-app-backend_web:$(TAG)
