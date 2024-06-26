import { createLogger, format, transports, Logger } from 'winston';
const { combine, timestamp, printf, errors } = format;

const errorFormat = printf((prop) => {
  const { level, message, timestamp } = prop;
  return `${timestamp} [${level.toUpperCase()}] : ${message}`;
});

const logger: Logger = createLogger({
  level: 'info',
  format: combine(
    errors({ stack: true }), // Capture stack trace if available
    errorFormat
  ),
  transports: [
    new transports.File({ filename: './log/error.log', level: 'error' }),
    new transports.File({ filename: './log/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}

export default logger;
