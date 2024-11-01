import AWS from 'aws-sdk';

// AWS Cognito Identity Service Provider configuration
AWS.config.update({
    region: process.env.AWS_REGION,
    credentials: new AWS.Credentials({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }),
});

export const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
export const cognitoUrl = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/`;