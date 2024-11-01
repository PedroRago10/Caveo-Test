import { initializeDataSource } from '../database';

let mockDataSource: any;

beforeEach(() => {
    mockDataSource = {
        isInitialized: false,
        initialize: jest.fn().mockResolvedValue(true),
    };
});

jest.mock('../database', () => ({
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

describe('Database - initializeDataSource', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockDataSource.isInitialized = false;
    });

    it('deve inicializar o DataSource se não estiver inicializado', async () => {
        await initializeDataSource();
        expect(mockDataSource.initialize).toHaveBeenCalled();
    });

    it('não deve reinicializar o DataSource se já estiver inicializado', async () => {
        mockDataSource.isInitialized = true;
        await initializeDataSource();
        expect(mockDataSource.initialize).not.toHaveBeenCalled();
    });
});
