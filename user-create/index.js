const AWS = require('aws-sdk');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { DYNAMODB_TABLE : DYNAMODB_TABLE, SALT_ROUNDS : SALT_ROUNDS } = process.env;

exports.handler = async (event) => {

    try {
        const data = JSON.parse(event.body);
        const params = {
            TableName: DYNAMODB_TABLE,
            Item: {
                id: uuid.v1(),
                username: data.username,
                email : data.email,
                name: data.name,
                dob: data.dob,
                password: data.password,
                role: data.role,
            },
        }

        params.Item.password = await hashpassword(params.Item.password);
        
        const user = await dynamoDb.put(params).promise();

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


const hashpassword = async (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, SALT_ROUNDS, function(err, hash) {
            if(err) 
                reject(err);
            resolve(hash);
        });
    });
}
