import { generateJWT } from '../util.js';

async function register(req, res) {
    let { email } = req.body;

    res.redirect(`/login?userCreated=${email}`);
}

async function login(req, res) {
    try {
        const user = req.user;
        let token = generateJWT(user);

        res.cookie('coderCookie', token, {
            maxAge:1000*60*60,
            httpOnly:true
        });

        res.status(200).redirect("/products");
    } catch (error) {
        req.logger.error("Login error: " + error.message);
        res.sendServerError(error.message);
    }
}

async function github(req, res) {
    try {
        const user = req.user;
        let token = generateJWT(user);

        res.cookie('coderCookie', token, {
            maxAge:1000*60*60,
            httpOnly:true
        });

        res.redirect('/products');
    } catch (error) {
        req.logger.error("Github login error: " + error.message);
        res.sendServerError(error.message);
    }
}

async function logout(req, res) {
    try {
        res.clearCookie('coderCookie');
        res.redirect("/login?message=Logged out successfully.");
    } catch (error) {
        req.logger.error("Logout error: " + error.message);
        res.sendServerError(error.message);
    
    }
}

async function current(req, res) {
    res.sendSuccess(req.user);
}

export default { register, login, github, logout, current };