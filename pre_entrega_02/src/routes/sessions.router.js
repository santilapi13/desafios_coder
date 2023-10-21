import Router from './router.js'
import passport from 'passport';
import { passportCall, generateJWT } from '../util.js';

export class SessionsRouter extends Router {
    init() {
        this.post('/register', ['PUBLIC'], passportCall('register', '/register'), (req, res) => {
            let { email } = req.body;

            res.redirect(`/login?userCreated=${email}`);
        });

        this.post('/login', ['PUBLIC'], passportCall('login', '/login'), (req, res) => {
            const user = req.user;
            delete user.password;
            
            let token = generateJWT(user);

            res.cookie('coderCookie', token, {
                maxAge:1000*60*60,
                httpOnly:true
            });

            res.status(200).redirect("/products");
        });

        this.get('/github', ['PUBLIC'], passport.authenticate('github', {scope: ['user:email']}), (req, res) => {});

        this.get('/github/callback', ['PUBLIC'], passportCall('github', '/login'), (req, res) => {
            req.session.user = req.user;
            res.redirect('/products');
        });

        this.get('/logout', ['USER', 'ADMIN'], (req, res) => {
            /*
            req.session.destroy((err) => {
                if (err)
                    return console.error("Error al destruir sesion: ", err);
                else
                    res.redirect("/login?message=Logged out successfully.");
            });
            */
            res.clearCookie('coderCookie');
            res.redirect("/login?message=Logged out successfully.");
        });

        // En caso de no estar logeado, redirecciona a /login
        this.get('/current', ['USER', 'ADMIN'], (req, res) => {
            res.sendSuccess(req.user);
        });
    }
}