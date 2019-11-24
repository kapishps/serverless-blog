const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { DYNAMODB_TABLE : DYNAMODB_TABLE } = process.env;

exports.handler = async (event) => {

    try {
        const data = JSON.parse(event.body);
        const params = {
            TableName: DYNAMODB_TABLE,
            Key: {
                id: event.pathParameters.id,
            },
            ExpressionAttributeNames: {
                '#full_name': 'name',
            },
            ExpressionAttributeValues: {
                ':name': data.name,
                ':dob': data.dob,
                ':role': data.role,
            },
            UpdateExpression: 'SET #full_name = :name, dob = :dob, role = :role',
            ReturnValues: 'ALL_NEW',
        }
        
        const user = await dynamoDb.update(params).promise();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify(user.Items[0]),
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
