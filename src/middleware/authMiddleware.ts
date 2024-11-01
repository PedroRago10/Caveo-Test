import jwt, { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import { Context, Next } from 'koa';
import logger from '../utils/logger';

let cachedKeys: Record<string, string> = {}; // Public key caching to reduce requests to Cognito

/**
 * Fetches the Cognito public key based on the Key ID (kid) present in the JWT header.
 * 
 * @param {string} kid - The Key ID to locate the appropriate public key.
 * @returns {Promise<string>} - Returns the PEM format of the public key.
 * 
 * Description: Retrieves and caches the public key from AWS Cognito to verify JWTs.
 *              The key is only fetched if it's not already cached, improving efficiency.
 */
async function getCognitoPublicKey(kid: string): Promise<string> {
    if (cachedKeys[kid]) return cachedKeys[kid];

    const url = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_USER_POOL_ID}/.well-known/jwks.json`;
    try {
        const response = await axios.get(url);
        const keys = response.data.keys;

        const key = keys.find((k: any) => k.kid === kid);
        if (!key) {
            logger.error("Chave correspondente ao kid não encontrada.");
            throw new Error("Chave pública do Cognito não encontrada.");
        }

        const pem = jwkToPem(key);
        cachedKeys[kid] = pem;
        return pem;
    } catch (error: any) {
        logger.error("Erro ao obter a chave pública do Cognito.", { message: error.message, stack: error.stack });
        throw new Error("Erro ao obter a chave pública do Cognito.");
    }
}

/**
 * Middleware: Authentication & Authorization via Cognito JWT
 * 
 * @description Verifies the validity of the JWT from AWS Cognito. If valid, it attaches
 *              the user’s details (id, email, role) to `ctx.state.user` for use in subsequent
 *              middleware or route handlers.
 * 
 * Process: 
 * - Extracts the token from the Authorization header.
 * - Decodes JWT and retrieves the Key ID (kid).
 * - Fetches the matching public key from AWS Cognito (or cache).
 * - Verifies and decodes the JWT, checking for necessary attributes (e.g., `custom:role`).
 * 
 * Access Denial:
 * - Returns 401 for missing, invalid, or expired tokens.
 * 
 * Usage: Attach to routes that require Cognito-based authentication and user role validation.
 */
export const authMiddleware = async (ctx: Context, next: Next) => {
    const token = ctx.headers.authorization?.split(' ')[1];

    if (!token) {
        ctx.status = 401;
        ctx.body = { message: 'Token de autorização não fornecido' };
        return;
    }

    try {
        const decodedHeader = jwt.decode(token, { complete: true });
        const kid = (decodedHeader && decodedHeader.header && decodedHeader.header.kid) as string;

        if (!kid) {
            throw new Error("O token JWT não contém um 'kid' válido.");
        }

        const publicKey = await getCognitoPublicKey(kid);
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;

        if (decoded.token_use !== 'id') {
            throw new Error("O token fornecido não é um ID Token.");
        }

        if (!decoded['custom:role']) {
            throw new Error("O token ID não contém o atributo custom:role.");
        }

        ctx.state.user = {
            id: decoded.sub,
            email: decoded.email,
            username: decoded['cognito:username'],
            role: decoded['custom:role'],
            token_use: decoded.token_use
        };

        await next();
    } catch (err: any) {
        logger.error('Erro de autenticação', { message: err.message, stack: err.stack });
        ctx.status = 401;
        ctx.body = { message: 'Token inválido ou expirado' };
    }
};