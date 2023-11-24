import winston from 'winston';
import MODE from '../util.js'

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
		fatal: 'red',
		error: 'orange',
		warning: 'yellow',
		info: 'blue',
        http: 'green',
		debug: 'white'
	}
}

const productionTransport = new winston.transports.Console({
    level: "info",
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.timestamp(),
        winston.format.json()
    )
});

const developmentTransport = new winston.transports.Console({
    level: "debug",
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.timestamp(),
        winston.format.json()
    )
});

const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.File({
            filename: "./errors.log",
            level: "error",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});

if(MODE === "development")
    logger.add(developmentTransport);
else if (MODE === "production")
    logger.add(productionTransport);

export const addLogger = (req, res, next) => {
    req.logger = logger;
    next();
}