const AWS = require('aws-sdk');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { DYNAMODB_TABLE : DYNAMODB_TABLE, JWT_SECRET: JWT_SECRET } = process.env;

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
                role: 'user',
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
            body: JSON.stringify({
                'id' : user.Items[0].id, 
                'username' :user.Items[0].username,
                'token' : generatetoken({})}),
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

const generatetoken = (data) =>{
    return jwt.sign(data, 'JWT_SECRET', { expiresIn: '1h' });
}
