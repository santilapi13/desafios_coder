import {Router} from 'express';
import { usersModel } from '../dao/models/users.model.js';
import passport from 'passport';
export const router = Router();

router.post("/register", passport.authenticate('register', {failureRedirect: '/api/sessions/registerfailed'}), async (req, res)  => {
    let { email } = req.body;

    /*
    let { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).render("register", {
            missingData: true
        });
    }

    let exists = await usersModel.findOne({email});
    if (exists) {
        return res.status(400).render("register", {
            repeatedEmail: true
        });
    }

    await usersModel.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password)
    });
    */

    res.redirect(`/login?userCreated=${email}`);
});

router.get('/registerfailed', async (req, res) => {
    console.log("Register strategy failed");
    // TODO: Manejar errores de registro para que se contemple bien en la vista.
    res.status(400).render("register", {
        repeatedEmail: true
    });
});

router.post("/login", passport.authenticate('login', {failureRedirect: '/api/sessions/loginfailed'}), async (req, res) => {
    /*
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).render("login", {
            missingData: true
        });
    }

    const user = await usersModel.findOne({email: email}, {email: 1, first_name: 1, last_name: 1, password: 1});
    if (!user) return res.status(400).render("login", {
        invalidCredentials: true
    });

    if (!isValidPassword(user, password)) return res.status(403).render("login", {
        invalidCredentials: true
    });
    */
    const user = req.user;
    delete user.password;
    req.session.user = user;
    
    res.redirect("/products");
    
});

router.get('/loginfailed', async (req, res) => {
	console.log("Login strategy failed");
    // TODO: Manejar errores de login para que se contemple bien en la vista.
    res.status(400).render("login", {
        invalidCredentials: true
    });
});

router.get("/github", passport.authenticate("github", {scope: ["user: email"]}), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
	req.session.user = req.user;
	res.redirect("/products");
});

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err)
            return console.error("Error al destruir sesion: ", err);
        else
            console.log("Sesion destruida");
            res.redirect("/login?message=Logged out successfully.");
    });
    
});