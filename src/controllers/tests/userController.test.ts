import { getUserData, editUserAccount } from '../userController';
import { Context } from 'koa';
import { AppDataSource, initializeDataSource } from '../../config/database';
import { User } from '../../entities/User';

const mockDataSource = {
    isInitialized: false,
    getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn(),
        find: jest.fn(),
        save: jest.fn(),
    }),
    initialize: jest.fn().mockResolvedValue(true),
};

jest.mock('../../config/database', () => ({
    get AppDataSource() {
        return mockDataSource;
    },
    initializeDataSource: jest.fn(async () => {
        if (!mockDataSource.isInitialized) {
            mockDataSource.isInitialized = true;
            await mockDataSource.initialize();
        }
        return mockDataSource;
    }),
}));

describe('UserController - getUserData', () => {
    const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'user@example.com',
        role: 'admin',
        isOnboarded: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    };

    const ctx = {
        state: { user: { email: 'user@example.com', role: 'admin' } },
        body: {} as { email?: string; message?: string },
        status: 0,
    } as unknown as Context;

    beforeAll(async () => {
        await initializeDataSource();
    });

    beforeEach(() => {
        mockDataSource.isInitialized = true;
    });

    it('should initialize the database connection', async () => {
        await initializeDataSource();
        expect(mockDataSource.isInitialized).toBe(true);
    });

    it('should initialize the database connection', async () => {
        (mockDataSource.getRepository(User).findOne as jest.Mock).mockResolvedValue(mockUser);

        await getUserData(ctx);

        expect(ctx.status).toBe(200);
        expect(ctx.body).toHaveProperty('email', 'user@example.com');
        expect(ctx.body).toHaveProperty('name', 'Test User');
        expect(ctx.body).toHaveProperty('role', 'admin');
    });

    it('should return 401 if the user is not authenticated', async () => {
        ctx.state.user = null;
        await getUserData(ctx);

        expect(ctx.status).toBe(401);
        expect(ctx.body).toHaveProperty('message', 'Usuário não autenticado');
    });

    it('should return 404 if the user is not found in the database', async () => {
        (mockDataSource.getRepository(User).findOne as jest.Mock).mockResolvedValue(null);

        ctx.state.user = { email: 'user@example.com', role: 'admin' };
        await getUserData(ctx);

        expect(ctx.status).toBe(404);
        expect(ctx.body).toHaveProperty('message', 'Usuário não encontrado');
    });
});
