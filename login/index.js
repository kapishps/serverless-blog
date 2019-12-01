const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { DYNAMODB_TABLE: DYNAMODB_TABLE, JWT_SECRET: JWT_SECRET } = process.env;

exports.handler = async (event) => {

    try {
        const req = JSON.parse(event.body);
        const params = {
            TableName: DYNAMODB_TABLE,
            FilterExpression: '#username = :username',
            ExpressionAttributeNames: {
                '#username': 'username',
            },
            ExpressionAttributeValues: {
                ':username': req.username,
            },
        }

        const data = await dynamoDb.scan(params).promise();

        if (data.Count === 1) {
            const user = data.Items[0];
            const match = await bcrypt.compare(req.password, user.password);

            if (match) {
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
                    },
                    body: JSON.stringify({ 'token': generatetoken(user.id, user.role) }),
                }
            }
            else {
                throw new Error('Username or Password incorrect');
            }
        }
        else {
            throw new Error('');        // None or More than one user found
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

const generatetoken = (username, role) => {
    var token = jwt.sign({ username: username, role: role }, JWT_SECRET, {
        expiresIn: '60m' // expires in 1 hour
    });
    console.log(token);
    return token;
}