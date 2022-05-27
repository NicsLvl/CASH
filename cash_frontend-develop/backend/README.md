# CASH App Backend

Simple Flask API backend for CASH App.

## Requirements

- docker-compose
- Python
- AWS CLI

## Instructions

To run the app locally, do the following:

```$bash
docker-compose build && docker-compose up
```

To push to ECR:

```$bash
make push
```

If you want to see the print output in your console, for now can use. But need to install the dependencies in Pipfile

```$bash
pipenv shell
FLASK_APP=./app.py flask run
```

To test your app, run the following command locally:

```$bash
curl --location --request POST 'http://localhost:5000/api/calculate' \
--header 'Content-Type: application/json' \
--data-raw '
{"expenses":[{"newExpenseName":"Expense 1","newExpenseAmount":1628,"newAgeFrom":30,"newAgeTo":85,"newRate":2.52}],"incomes":[{"newIncomeName":"Income 1","newIncomeAmount":4534,"newAgeFrom":30,"newAgeTo":64,"newRate":4.2,"newBonus":2}],"personalInformation":{"startingAge":30,"startingSaving":150000,"retirementAge":62,"lifeExpectancy":85,"investmentPercentage":30},"housingInfo":{"housePrice":500000,"targetAge":34,"houseInterestRate":2.6,"loanLength":20,"downPayment":15},"rates":{"housePriceIndex":5.96,"investmentRate":5.9,"bankInterestRate":1}}'
```

## App Deployment

Currently, the app is deployed on AWS Elastic Beanstalk using Docker environment. An Application Load Balancer (ALB) sits in front of the application, and a AWS Certificate Manager SSL Certificate is attached to the load balancer. The domain is managed in Route 53 and the database is a MySQL AWS RDS database. All the services are running in `ap-southeast-1` (Singapore) region.

Pre-requisites to deploy:

1. you have a working AWS Access key and IAM Account to the AWS Account specified in the Makefile
1. you must be logged in to Docker via ECR

To deploy the app:

1. push the latest image to AWS ECR using `make push` command. Note that you need to modify the Makefile to push to the correct AWS Account or already have the
1. modify the `Dockerrun.aws.json` to use the latest image
1. deploy in AWS EB with the latest `Dockerrun.aws.json` file and wait for the app to deploy

To test the api currently running in production, run the following curl request in terminal (mac OS)/ window cmd

```$bash
curl --location --request POST 'https://api.cs5224cash.site/api/calculate' \
--header 'Content-Type: application/json' \
--data-raw '
{"expenses":[{"newExpenseName":"Expense 1","newExpenseAmount":1628,"newAgeFrom":30,"newAgeTo":85,"newRate":2.52}],"incomes":[{"newIncomeName":"Income 1","newIncomeAmount":4534,"newAgeFrom":30,"newAgeTo":64,"newRate":4.2,"newBonus":2}],"personalInformation":{"startingAge":30,"startingSaving":150000,"retirementAge":62,"lifeExpectancy":85,"investmentPercentage":30},"housingInfo":{"housePrice":500000,"targetAge":34,"houseInterestRate":2.6,"loanLength":20,"downPayment":15},"rates":{"housePriceIndex":5.96,"investmentRate":5.9,"bankInterestRate":1}}'
```
