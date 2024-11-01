import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logDirectory = path.join(__dirname, '../../logs');
const logFilePath = path.join(logDirectory, 'combined.log');

// Ensure the log directory exists; create it if necessary
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

/**
 * Configures the application logger using Winston.
 * - Outputs logs to both console and file in JSON format.
 * - Includes timestamp with each log entry.
 * - Writes logs at 'info' level or above to a combined log file for persistent storage.
 */
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),  // Console transport for real-time log viewing
        new winston.transports.File({ filename: logFilePath }),  // File transport for log persistence
    ],
});

export default logger;