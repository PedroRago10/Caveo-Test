import { Context, Next } from 'koa';

/**
 * Middleware: Role-Based Access Control
 * 
 * @param {string[]} allowedRoles - Array of roles permitted to access a given route.
 * @returns {Function} Middleware function that verifies if the authenticated user has the required role.
 *
 *  Description: This middleware restricts access to routes based on user roles. 
 *  If the user's role is not included in the `allowedRoles` array, 
 *  the request is denied with a 403 Forbidden status.
 * 
 *  Usage: Attach to routes that require specific role permissions to enforce
 *  access control at the middleware level, prior to controller execution.
 */
export const roleMiddleware = (allowedRoles: string[]) => {
    return async (ctx: Context, next: Next) => {
        const user = ctx.state.user;

        if (!user || !allowedRoles.includes(user.role)) {
            ctx.status = 403;
            ctx.body = { message: 'Acesso negado: Permissões insuficientes' };
            return;
        }

        await next();
    };
};