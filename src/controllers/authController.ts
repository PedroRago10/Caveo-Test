import { Context } from 'koa';
import { registerOrLoginUser } from '../services/authService';
import { AuthRequestBody } from '../types/auth';
import logger from '../utils/logger';

/**
 * Sign In or Register
 * 
 * @description Handles user authentication and registration by checking for an existing user in AWS Cognito. 
 *              If the user is new, they are registered; if existing, they are authenticated and issued a token.
 * 
 * Process:
 * - Validates request payload for email and password.
 * - Invokes registration or login logic in the auth service, returning a token on success.
 * 
 * Error Handling:
 * - Returns 400 for missing credentials.
 * - Returns 500 for any internal errors during authentication or registration.
 * 
 * @param {Context} ctx - Koa context containing the HTTP request and response.
 */
export const signInOrRegister = async (ctx: Context) => {
    const { email, password } = ctx.request.body as AuthRequestBody;

    if (!email || !password) {
        ctx.status = 400;
        ctx.body = { message: 'Email e senha são obrigatórios' };
        logger.warn('Email e senha não fornecidos', { module: 'controller' });
        return;
    }

    try {
        const token = await registerOrLoginUser(email, password);

        ctx.status = 200;
        ctx.body = { token };
        logger.info('Usuário autenticado com sucesso', { module: 'controller' });
    } catch (err) {
        logger.error('Erro na autenticação', { error: err, module: 'controller' });
        ctx.status = 500;
        ctx.body = { message: 'Erro ao autenticar o usuário' };
    }
};