## Tech Stack

 - NodeJS
 - AWS Lambda
 - AWS API Gateway
 - AWS DynamoDB
 - AWS S3
 - AWS SNS
 - Serverless Framework
 - Localstack

## List of Planned API's (checked are created)

 1. Public
	 - [x] Signup
	 - [x] Login
     - [ ] Email-Verify
     - [ ] Reset-Password
     - [ ] See blog posts and comments
 2. Logged In User
     - [ ] Update-Profile-Info
     - [ ] Update-Profile-Pic
     - [ ] Change Passoword
     - [ ] Create Blog Post
     - [ ] Comment on blog Posts
     - [ ] Delete own blog posts
     - [ ] Delete own Comments
 3. Logged In Admin (all API's available to user plus)
     - [x] Create a User
     - [x] See all Users and their basic info
     - [x] Update User Info (except password)
     - [x] Delete any User
     - [ ] Delete any Blog Post
     - [ ] Delete any Comment

## How to Run

    npm install -g serverless
    npm install --save-dev serverless-localstack  
      
    docker-compose up
    serverless deploy --stage local

## Full Documentation Coming Soon
