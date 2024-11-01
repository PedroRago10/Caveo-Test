// src/services/authService.ts
import axios from 'axios';
import { cognitoIdentityServiceProvider, cognitoUrl } from '../config/cognito';
import logger from '../utils/logger';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

/**
 * Checks if a user exists in AWS Cognito.
 * @param username - Cognito username, usually the user's email.
 * @returns True if user exists; otherwise, false.
 */
const checkIfUserExists = async (username: string): Promise<boolean> => {
    try {
        await cognitoIdentityServiceProvider.adminGetUser({
            UserPoolId: process.env.AWS_USER_POOL_ID!,
            Username: username,
        }).promise();
        return true;
    } catch (error: any) {
        if (error.code === 'UserNotFoundException') {
            return false;
        } else {
            logger.error('Error checking if user exists in Cognito', { error: error.message, code: error.code });
            throw new Error(`Error checking user existence: ${error.message}`);
        }
    }
};

/**
 * Authenticates a user in AWS Cognito and retrieves an ID token.
 * @param email - User's email as the username in Cognito.
 * @param password - User's password for authentication.
 * @returns ID token on successful authentication.
 */
const authenticateUser = async (email: string, password: string): Promise<string> => {
    try {
        const authResponse = await axios.post(cognitoUrl, {
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: process.env.AWS_CLIENT_ID,
        }, {
            headers: {
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
                'Content-Type': 'application/x-amz-json-1.1',
            },
        });
        return authResponse.data.AuthenticationResult.IdToken;
    } catch (error: any) {
        if (error.response?.data?.__type === 'NotAuthorizedException') {
            throw new Error('Invalid credentials. Check your email and password.');
        }
        logger.error('Error authenticating user in Cognito', { error: error.response?.data || error.message });
        throw new Error('Error during user authentication');
    }
};

/**
 * Confirms a user in AWS Cognito post-registration.
 * @param username - Cognito username to confirm.
 */
const confirmUser = async (username: string) => {
    try {
        await cognitoIdentityServiceProvider.adminConfirmSignUp({
            UserPoolId: process.env.AWS_USER_POOL_ID!,
            Username: username,
        }).promise();
        logger.info('User successfully confirmed in Cognito', { module: 'service' });
    } catch (error: any) {
        logger.error('Error confirming user in Cognito', { error: error.message, code: error.code });
        throw new Error('Error during user confirmation');
    }
};

/**
 * Registers a new user in AWS Cognito.
 * @param email - New user's email.
 * @param password - New user's password.
 */
const registerUser = async (email: string, password: string) => {
    try {
        await cognitoIdentityServiceProvider.signUp({
            ClientId: process.env.AWS_CLIENT_ID!,
            Username: email,
            Password: password,
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'custom:role', Value: 'admin' },
            ],
        }).promise();
        await confirmUser(email);
    } catch (error: any) {
        logger.error('Error registering user in Cognito', { error: error.message, code: error.code });
        if (error.code === 'InvalidPasswordException') {
            throw new Error('Password does not meet minimum requirements.');
        }
        throw new Error('Error during user registration');
    }
};

/**
 * Attempts to authenticate or register a user in AWS Cognito.
 * If the user doesn't exist, registers them, then authenticates.
 * Saves the user in PostgreSQL if not already present.
 * @param email - User's email for authentication.
 * @param password - User's password.
 * @returns JWT ID token from Cognito on successful login or registration.
 */
export const registerOrLoginUser = async (email: string, password: string): Promise<string> => {
    try {
        const userExistsInCognito = await checkIfUserExists(email);

        let token;
        if (userExistsInCognito) {
            token = await authenticateUser(email, password);
        } else {
            logger.info('User not found in Cognito. Registering new user...', { module: 'service' });
            await registerUser(email, password);
            token = await authenticateUser(email, password);
        }

        // Ensure user exists in PostgreSQL
        const userRepository = AppDataSource.getRepository(User);
        let userInDb = await userRepository.findOne({ where: { email } });

        if (!userInDb) {
            logger.info('User not found in PostgreSQL. Creating new user in database...', { module: 'service' });
            const newUser = userRepository.create({
                email,
                name: '',
                role: 'admin',
                isOnboarded: false,
            });
            userInDb = await userRepository.save(newUser);
        }

        return token;
    } catch (error: any) {
        logger.error('Error during user authentication or registration', { error: error.message, code: error.code, module: 'service' });
        throw new Error('Error in user authentication or registration');
    }
};