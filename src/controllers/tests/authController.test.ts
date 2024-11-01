import { signInOrRegister } from '../authController';
import { Context } from 'koa';
import { registerOrLoginUser } from '../../services/authService';

jest.mock('../../services/authService');

describe('AuthController - signInOrRegister', () => {
    const ctx = {
        request: { body: { email: 'user@example.com', password: 'password123' } },
        body: {},
        status: 0,
    } as Context;

    it('should authenticate and return a token to the user', async () => {
        (registerOrLoginUser as jest.Mock).mockResolvedValue('token123');

        await signInOrRegister(ctx);

        expect(ctx.status).toBe(200);
        expect(ctx.body).toHaveProperty('token', 'token123');
    });

    it('should return 400 if email or password are not provided', async () => {
        ctx.request.body = { email: '' };
        await signInOrRegister(ctx);

        expect(ctx.status).toBe(400);
        expect(ctx.body).toHaveProperty('message', 'Email e senha são obrigatórios');
    });


});
