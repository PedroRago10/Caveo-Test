import Router from 'koa-router';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';
import { getUserData, editUserAccount, getAllUsers } from '../controllers/userController';

const userRouter = new Router();

/**
 * Route: /me
 * Method: GET
 * Middleware: authMiddleware
 * Description: Returns authenticated user data. Accessible to any authenticated user.
 */
userRouter.get('/me', authMiddleware, getUserData);

/**
 * Route: /edit-account
 * Method: PUT
 * Middleware: authMiddleware, roleMiddleware(['admin', 'user'])
 * Description: Allows authenticated users to edit their account data. 
 * Admins can edit all user attributes; regular users have limited edit permissions.
 */
userRouter.put('/edit-account', authMiddleware, roleMiddleware(['admin', 'user']), editUserAccount);

/**
 * Route: /users
 * Method: GET
 * Middleware: authMiddleware, roleMiddleware(['admin'])
 * Description: Returns a list of all registered users in the database. 
 * Access restricted to admin users only.
 */
userRouter.get('/users', authMiddleware, roleMiddleware(['admin']), getAllUsers);

export default userRouter;