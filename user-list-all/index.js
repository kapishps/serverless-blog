const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { DYNAMODB_TABLE : DYNAMODB_TABLE } = process.env;

exports.handler = async (event) => {

    try {
        const params = {
            TableName: DYNAMODB_TABLE,
            ProjectionExpression:"id, username, email, name, role, dob",
        }

        const user = await dynamoDb.scan(params).promise();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify(user.Items),
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: err.statusCode || 400,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify(err),
        };
    }
};
