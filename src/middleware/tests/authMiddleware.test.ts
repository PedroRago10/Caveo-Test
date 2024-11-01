import { Context } from 'koa';
import { authMiddleware } from '../authMiddleware';
import { cognitoIdentityServiceProvider } from '../../config/cognito';
import axios from 'axios';
import jwt from 'jsonwebtoken';

jest.mock('../../config/cognito', () => ({
    cognitoIdentityServiceProvider: {
        adminGetUser: jest.fn(),
    },
}));

jest.mock('jsonwebtoken', () => ({
    decode: jest.fn().mockReturnValue({
        header: { kid: 'mockKid' },
    }),
    verify: jest.fn().mockReturnValue({
        sub: 'user-id',
        email: 'test@example.com',
        'cognito:username': 'testuser',
        'custom:role': 'admin',
        token_use: 'id',
    }),
}));

jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({
        data: {
            keys: [{ kid: 'mockKid', n: 'fakePublicKey', e: 'AQAB', kty: 'RSA' }],
        },
    }),
}));

describe('authMiddleware', () => {
    it('should return 401 if the token is missing', async () => {
        const ctx = { headers: {}, status: 0, body: {} } as unknown as Context;
        const next = jest.fn();

        await authMiddleware(ctx, next);

        expect(ctx.status).toBe(401);
        expect(ctx.body).toEqual({ message: 'Token de autorização não fornecido' });
    });

    it('should return 200 if the user is authenticated', async () => {
        const ctx = {
            headers: {
                authorization:
                    'Bearer eyJraWQiOiJQNmhKV2RGQVYwSUYzSTg1QzZRQ2VFWXlcL2ZqY01ZXC9iWHdJNmJHNWNMNmM9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIwMzljM2FmYS1jMDAxLTcwOGItZjAyYi0xOWU1NDE3MzM0ZTQiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5zYS1lYXN0LTEuYW1hem9uYXdzLmNvbVwvc2EtZWFzdC0xX2pIajlTalBUVSIsImNvZ25pdG86dXNlcm5hbWUiOiIwMzljM2FmYS1jMDAxLTcwOGItZjAyYi0xOWU1NDE3MzM0ZTQiLCJvcmlnaW5fanRpIjoiZjY4M2IzNDEtODAzZS00ZGZjLWJiYTQtMDM0MDg1OGNmNWYxIiwiYXVkIjoiNWhtZzJyMjZydDlubW9jMzhtZjVqMmhnaDAiLCJldmVudF9pZCI6IjBkN2MyZWU0LWJjODItNDQ5MS1iYzE1LTUwMGZkMTg1MWVlMyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzMwNDMyMTgyLCJleHAiOjE3MzA0MzU3ODIsImN1c3RvbTpyb2xlIjoidXNlciIsImlhdCI6MTczMDQzMjE4MiwianRpIjoiMWM1MDUyYjItZTk3Ni00ZWQ0LWEwNGQtYWM2ZDY5NGQyMzdmIiwiZW1haWwiOiJ0ZXN0ZTQ4QGV4YW1wbGUuY29tIn0.I1T4Xe5vZfmyaqtdQNAebWw7C5s1ebW332evRhGdT4e8SQa8LUwh7lFaxzUhWDtYIcbEWxnAjFAfbTD009A3rT5RBFhovpf4tNxBCcj1iZohnu9yGTXfmouPLRTtXx-RmK8Ug1mNuJogHOs2MDM_8_llj8TCRNFyoCfH7oRXut2smDQwILxo8fPaJJd_ajRJxwhwFSafyhyhu3Cd3R0DX8bWDYggnp6StNIBueOGuh2CuwGfR_j1PkTkzNC5DPBcw3Kj3HayyM_6bbVsaYgEqJPlfyMFB7ujT68Kw6Z1XPUnn5BfF51SUYc7NN33_pTKDm9zbo2oWDHLVxACWIQLUA',
            },
            state: {},
            status: 0,
            body: {},
        } as unknown as Context;
        const next = jest.fn();

        try {
            (cognitoIdentityServiceProvider.adminGetUser as jest.Mock).mockResolvedValueOnce({
                UserAttributes: [{ Name: 'email', Value: 'test@example.com' }],
            });

            await authMiddleware(ctx, next);

            expect(ctx.status).toBe(200);
            expect(ctx.state.user).toMatchObject({ email: 'test@example.com' });
            expect(next).toHaveBeenCalled();
        } catch (error) {
            console.error("Erro no teste de autenticação:", error);
        }
    });
});
