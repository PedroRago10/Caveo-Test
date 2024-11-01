import { DataSource } from 'typeorm';
import { User } from '../entities/User';

/**
 * App Data Source Configuration
 * 
 * @description Configures and exports a TypeORM data source for PostgreSQL.
 *              This data source handles the connection and entity management within the application.
 * 
 * Configuration:
 * - Database credentials and connection settings are sourced from environment variables.
 * - Sets up the `User` entity as a managed database model.
 * - Synchronization and logging are disabled for production readiness.
 */
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User],
    synchronize: true,
    logging: false,
});

/**
 * Initialize Data Source
 * 
 * @description Ensures the database connection is initialized. This method checks if the data source 
 *              is already initialized to prevent redundant connections in a server context.
 * 
 * @returns {Promise<DataSource>} A promise that resolves to the initialized data source instance.
 */
export const initializeDataSource = async (): Promise<DataSource> => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');
    }
    return AppDataSource;
};