import {createLogger as CL, format ,transports} from 'winston';

export function createLogger(module: string) {
    return CL({
        level: 'info',
        format: format.combine(
           format.timestamp(),
            format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${module}] ${level}: ${message}`;
            })
        ),
        transports: [
            new transports.Console(),
            new transports.File({ filename: 'app.log' }),
        ],
    });
}