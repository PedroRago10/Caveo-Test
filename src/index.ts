import "reflect-metadata";
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { AppDataSource } from './config/database';
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';

const app = new Koa();
const router = new Router();

/**
 * Initializes and starts the server with configured routes and middleware.
 * - Establishes a connection to the database via AppDataSource.
 * - Configures middleware for CORS and request body parsing.
 * - Registers primary routes for authentication and user management.
 * - Sets up a root route for server health check.
 * - Handles any database connection issues by terminating the process with an error message.
 */
async function startServer() {
    try {
        await AppDataSource.initialize();
        console.log("Successfully connected to the database");

        app.use(cors());
        app.use(bodyParser());

        // Register routes for authentication and user management
        app.use(authRouter.routes()).use(authRouter.allowedMethods());
        app.use(userRouter.routes()).use(userRouter.allowedMethods());

        // Health check route
        router.get('/', async (ctx) => {
            ctx.body = 'Server is up and running!';
        });

        app.use(router.routes()).use(router.allowedMethods());

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
}

startServer();

export default app;