import { Context, Next } from 'koa';
import { roleMiddleware } from '../roleMiddleware';

describe('roleMiddleware', () => {
    const next: Next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should deny access if the user is not authenticated', async () => {
        const ctx = {
            state: { user: { role: 'admin' } },
            status: 0,
            body: {},
        } as unknown as Context;

        const middleware = roleMiddleware(['admin']);
        await middleware(ctx, next);

        expect(ctx.status).toBe(0);
        expect(next).toHaveBeenCalled();
    });

    it('should deny access if the user does not have a permitted role', async () => {
        const ctx = {
            state: { user: { role: 'user' } },
            status: 0,
            body: {},
        } as unknown as Context;

        const middleware = roleMiddleware(['admin']);
        await middleware(ctx, next);

        expect(ctx.status).toBe(403);
        expect(ctx.body).toEqual({ message: 'Acesso negado: Permissões insuficientes' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should allow access if the user has a permitted role', async () => {
        const ctx = {
            state: {},
            status: 0,
            body: {},
        } as unknown as Context;

        const middleware = roleMiddleware(['admin']);
        await middleware(ctx, next);

        expect(ctx.status).toBe(403);
        expect(ctx.body).toEqual({ message: 'Acesso negado: Permissões insuficientes' });
        expect(next).not.toHaveBeenCalled();
    });
});
