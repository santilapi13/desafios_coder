import Router from './router.js'
import passport from 'passport';
import { passportCall } from '../util.js';
import sessionsController from '../controllers/sessionsController.js';

export class SessionsRouter extends Router {
    init() {
        this.post('/register', ['PUBLIC'], passportCall('register', '/register'), sessionsController.register);

        this.post('/login', ['PUBLIC'], passportCall('login', '/login'), sessionsController.login);

        this.get('/github', ['PUBLIC'], passport.authenticate('github', {scope: ['user:email']}), (req, res) => {});

        this.get('/githubcallback', ['PUBLIC'], passportCall('github', '/login'), sessionsController.github);

        this.get('/logout', ['USER', 'ADMIN'], sessionsController.logout);

        this.get('/current', ['USER', 'ADMIN'], sessionsController.current);
    }
}