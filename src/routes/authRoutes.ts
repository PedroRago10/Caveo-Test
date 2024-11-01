import Router from 'koa-router';
import { signInOrRegister } from '../controllers/authController';

const authRouter = new Router();

/**
 * Route: /auth
 * Method: POST
 * Description: Public route for user authentication or registration.
 * If user exists, returns a valid JWT. Otherwise, registers new user and returns a JWT.
 */
authRouter.post('/auth', signInOrRegister);

export default authRouter;