import {Router} from 'express';
import crypto from 'crypto'
import { usersModel } from '../dao/models/users.model.js';
import { secretKey } from '../app.js';
export const router = Router();

router.post("/register", async (req, res)  => {

    let { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send("Missing data.");
    }

    let exists = await usersModel.findOne({email});
    if (exists) {
        return res.status(400).send(`User with email ${email} already exists. Please use another email.`);
    }

    password = crypto.createHmac('sha256', secretKey).update(password).digest('base64');

    await usersModel.create({
        first_name,
        last_name,
        email,
        age,
        password
    });


    res.redirect(`/login?userCreated=${email}`);
});

router.post("/login", async (req, res) => {
    
        let { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).send("Missing data.");
        }
    
        password = crypto.createHmac('sha256', secretKey).update(password).digest('base64');
    
        let user = await usersModel.findOne({email, password});
        if (!user) {
            return res.status(400).send("Invalid credentials.");
        }
    
        delete user.password;
        req.session.user = user;
    
        res.redirect("/products");
});

router.get("/logout", (req, res) => {
    req.session.destroy(e => console.log(e));

    res.redirect("/login?message=Logged out successfully.");
});