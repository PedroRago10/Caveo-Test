import { Context } from 'koa';
import { cognitoIdentityServiceProvider } from '../config/cognito';
import { AppDataSource } from '../config/database';
import logger from '../utils/logger';
import { User } from '../entities/User';
import { EditAccountRequestBody } from '../types/user';

/**
 * Get User Data
 * 
 * @description Fetches authenticated user data from both the application database and AWS Cognito, merging data for comprehensive details.
 * @param {Context} ctx - Koa context for managing request and response.
 * 
 * Process:
 * - Extracts user's email and role from AWS Cognito for basic validation.
 * - Queries the database for additional user-specific information.
 */
export const getUserData = async (ctx: Context) => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { email, role } = ctx.state.user || {};

        if (!email) {
            ctx.status = 401;
            ctx.body = { message: 'Usuário não autenticado' };
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });


        if (!user) {
            ctx.status = 404;
            ctx.body = { message: 'Usuário não encontrado' };
            return;
        }

        ctx.status = 200;
        ctx.body = {
            id: user.id,
            name: user.name,
            email,
            role,
            isOnboarded: user.isOnboarded,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: 'Erro ao obter dados do usuário' };
        console.error('Erro ao obter dados do usuário:', error);
    }
};


/**
 * Update Cognito User Role
 * 
 * @description Updates a user's role in AWS Cognito, ensuring the role change is mirrored across both systems.
 * @param {string} username - Username in AWS Cognito to update.
 * @param {string} role - New role for the user, e.g., 'admin', 'user'.
 */
const updateCognitoUserRole = async (username: string, role: string) => {
    try {
        await cognitoIdentityServiceProvider.adminUpdateUserAttributes({
            UserPoolId: process.env.AWS_USER_POOL_ID!,
            Username: username,
            UserAttributes: [
                {
                    Name: 'custom:role',
                    Value: role,
                },
            ],
        }).promise();
        logger.info(`Role atualizado para ${role} no Cognito para o usuário ${username}`);
    } catch (error: any) {
        logger.error('Erro ao atualizar role no Cognito', { error: error.message, code: error.code });
        throw new Error('Erro ao atualizar role no Cognito');
    }
};

/**
 * Edit User Account
 * 
 * @description Allows an authenticated user to edit their account information or, if admin, edit another user's role.
 * @param {Context} ctx - Koa context containing the request and response.
 * 
 * Process:
 * - If admin, can edit another user's role and name.
 * - Updates the role in both the database and AWS Cognito.
 */
export const editUserAccount = async (ctx: Context) => {
    try {
        const { name, role, email } = ctx.request.body as EditAccountRequestBody;
        const user = ctx.state.user;

        if (user.role !== 'admin') {
            ctx.status = 403;
            ctx.body = { message: 'Permissão insuficiente' };
            return;
        }

        const userRepository = AppDataSource.getRepository(User);

        const targetUserEmail = email || user.email;
        const userToEdit = await userRepository.findOne({ where: { email: targetUserEmail } });

        if (!userToEdit) {
            ctx.status = 404;
            ctx.body = { message: 'Usuário não encontrado' };
            return;
        }

        if (name) userToEdit.name = name;
        if (role && role !== userToEdit.role) {
            userToEdit.role = role;
            await updateCognitoUserRole(targetUserEmail, role);
        }

        await userRepository.save(userToEdit);
        ctx.status = 200;
        ctx.body = { message: 'Dados atualizados com sucesso', user: userToEdit };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: 'Erro ao atualizar os dados do usuário' };
        console.error('Erro ao atualizar os dados do usuário:', error);
    }
};

/**
 * Get All Users
 * 
 * @description Retrieves a list of all users from the database. Access is restricted to admins only.
 * @param {Context} ctx - Koa context for the current request and response.
 */
export const getAllUsers = async (ctx: Context) => {
    try {
        const user = ctx.state.user;

        if (!user) {
            ctx.status = 401;
            ctx.body = { message: 'Usuário não autenticado' };
            logger.warn('Tentativa de acesso não autenticada à rota /users', { module: 'controller' });
            return;
        }

        if (user.role !== 'admin') {
            ctx.status = 403;
            ctx.body = { message: 'Permissão insuficiente' };
            logger.warn(`Usuário com id ${user.id} tentou acessar /users sem permissão`, { module: 'controller' });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();

        ctx.status = 200;
        ctx.body = { users };
        logger.info('Lista de usuários retornada com sucesso', { module: 'controller' });
    } catch (error: any) {
        ctx.status = 500;
        ctx.body = { message: 'Erro ao obter lista de usuários' };
        logger.error('Erro ao obter lista de usuários', { error: error.message, module: 'controller' });
    }
};