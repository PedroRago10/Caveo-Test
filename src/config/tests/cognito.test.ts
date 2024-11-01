import { cognitoIdentityServiceProvider } from '../cognito';
import AWS from 'aws-sdk';

jest.mock('aws-sdk', () => {
    return {
        Credentials: jest.fn(() => ({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        })),
        config: {
            update: jest.fn(),
        },
        CognitoIdentityServiceProvider: jest.fn(() => ({
            adminGetUser: jest.fn().mockResolvedValue({}),
            adminUpdateUserAttributes: jest.fn().mockResolvedValue({}),
            signUp: jest.fn().mockResolvedValue({}),
            adminConfirmSignUp: jest.fn().mockResolvedValue({}),
        })),
    };
});



describe('Cognito Service', () => {
    it('deve verificar se um usuário existe', async () => {
        (cognitoIdentityServiceProvider.adminGetUser as jest.Mock).mockImplementationOnce(() => ({
            promise: jest.fn().mockResolvedValue({ Username: 'testuser' })
        }));

        const result = await cognitoIdentityServiceProvider.adminGetUser({
            UserPoolId: 'test-pool-id',
            Username: 'testuser',
        }).promise();

        expect(cognitoIdentityServiceProvider.adminGetUser).toHaveBeenCalled();
        expect(result).toHaveProperty('Username', 'testuser');
    });

    it('deve registrar um novo usuário', async () => {
        (cognitoIdentityServiceProvider.signUp as jest.Mock).mockImplementationOnce(() => ({
            promise: jest.fn().mockResolvedValue({ UserSub: '12345' })
        }));

        const result = await cognitoIdentityServiceProvider.signUp({
            ClientId: 'test-client-id',
            Username: 'newuser@example.com',
            Password: 'password123',
            UserAttributes: [{ Name: 'email', Value: 'newuser@example.com' }],
        }).promise();

        expect(cognitoIdentityServiceProvider.signUp).toHaveBeenCalled();
        expect(result).toHaveProperty('UserSub', '12345');
    });

    it('deve confirmar um usuário', async () => {
        (cognitoIdentityServiceProvider.adminConfirmSignUp as jest.Mock).mockImplementationOnce(() => ({
            promise: jest.fn().mockResolvedValue({})
        }));

        const result = await cognitoIdentityServiceProvider.adminConfirmSignUp({
            UserPoolId: 'test-pool-id',
            Username: 'testuser',
        }).promise();

        expect(cognitoIdentityServiceProvider.adminConfirmSignUp).toHaveBeenCalled();
        expect(result).toEqual({});
    });
});
