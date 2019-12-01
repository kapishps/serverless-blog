const AWS = require('aws-sdk');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { DYNAMODB_TABLE : DYNAMODB_TABLE, SALT_ROUNDS: SALT_ROUNDS, JWT_SECRET: JWT_SECRET } = process.env;

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
                'token' : generatetoken(user.Items[0].username, 'user')
            }),
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

const generatetoken = (username, role) => {
    var token = jwt.sign({ username: username, role: role }, JWT_SECRET, {
        expiresIn: '60m' // expires in 1 hour
    });
    console.log(token);
    return token;
}
