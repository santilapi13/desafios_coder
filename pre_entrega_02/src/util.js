import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

import { config } from './config/dotenv.config.js';
console.log(config)
export const PRIVATE_KEY = config.PRIVATE_KEY;
export const clientID = config.clientID;
export const clientSecret = config.clientSecret;
export const callbackURL = config.callbackURL;

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export const generateJWT = user => jwt.sign({ user }, PRIVATE_KEY, {expiresIn:'1h'});

export const passportCall = (strategy, failureRedirect) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            if (err) return next(err);

            if (!user) {
                const redirection = `${failureRedirect}?error=${info.message?info.message:info.toString()}`
                return res.redirect(redirection);
            }

            req.user = user;
            return next();
        }) (req, res, next);
    }
}

