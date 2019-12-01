const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
    console.log(JSON.stringify(event));

    const { JWT_SECRET: JWT_SECRET } = process.env;

    const token = event.authorizationToken;

    if (!token)
        throw new Error("Unauthorized");

    // verifies secret and checks exp
    return jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err)
            throw new Error("Unauthorized");

        // if everything is good, save to request for use in other routes
        return generatePolicy(decoded.username, 'Allow', event.methodArn);
    });

};

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
}
