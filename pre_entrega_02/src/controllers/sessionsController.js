import { generateJWT } from '../util.js';

async function register(req, res) {
    let { email } = req.body;

    res.redirect(`/login?userCreated=${email}`);
}

async function login(req, res) {
    const user = req.user;
    delete user.password;
    
    let token = generateJWT(user);

    res.cookie('coderCookie', token, {
        maxAge:1000*60*60,
        httpOnly:true
    });

    res.status(200).redirect("/products");
}

async function github(req, res) {
    const user = req.user;
    let token = generateJWT(user);

    res.cookie('coderCookie', token, {
        maxAge:1000*60*60,
        httpOnly:true
    });

    res.redirect('/products');
}

async function logout(req, res) {
    res.clearCookie('coderCookie');
    res.redirect("/login?message=Logged out successfully.");
}

async function current(req, res) {
    res.sendSuccess(req.user);
}

export default { register, login, github, logout, current };