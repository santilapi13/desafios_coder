import Router from './router.js'
import usersController from '../controllers/usersController.js';

const alreadyAuthenticated = (req, res, next) => {
    if(req.cookies.coderCookie) {
        return res.sendAuthorizationError("Already authenticated.");
    }

    next();
}

const checkCookie = (req, res, next) => {
    if(!req.cookies.restorePasswordCookie) {
        return res.sendUserError("Missing or expired JWT token. Please, request a new password reset");
    }

    next();
}

export class UsersRouter extends Router {
    init() {
        this.post('/restorePassword', ["PUBLIC"], alreadyAuthenticated, usersController.restorePassword);

        this.post('/newPassword', ["PUBLIC"], alreadyAuthenticated, checkCookie, usersController.newPassword);
    }
}