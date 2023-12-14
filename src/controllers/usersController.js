import nodemailer from 'nodemailer'
import { config } from '../config/dotenv.config.js';
import { usersService } from "../services/users.service.js";
import { createHash } from "../util.js";
import { generateJWT } from '../util.js';

async function getUsers(req, res) {
    try {
        const users = await usersService.getUsers();
        if (!users) {
            return res.sendUserError("Users not found.");
        }

        return res.sendSuccess(users);
    } catch (error) {
        req.logger.error(`Getting users: ` + error.message);
        return res.sendServerError(error.message);
    }
}

const transport = nodemailer.createTransport({
    service:'gmail',
    port: 587,
    auth: {
        user: config.MAILER_USER,
        pass: config.MAILER_PASS
    }
})

async function restorePassword(req, res) {
    const { email } = req.body;

    try {
        const user = await usersService.getUserByEmail(email);
        if (!user) {
            return res.sendUserError("Email not found.");
        }

        const baseUrl = req.protocol + '://' + req.get('host'); 

        const token = generateJWT(email);

        res.cookie('restorePasswordCookie', token, {
            maxAge:1000*60*60,
            httpOnly:true
        });

        res.cookie('emailCookie', email, {
            maxAge:1000*60*60,
            httpOnly:true
        });

        transport.sendMail({
            from: "Recuperador " + config.MAILER_USER,
            to: email,
            subject: "Restaurar contraseña",
            html: `
                <h1>Restaurar contraseña</h1>
                <p>Para restaurar tu contraseña, hace click <a href="${baseUrl}/restorePassword">acá</a></p>
            `
        });
    } catch (error) {
        req.logger.error(`Sending email to ${email} to restore password: ` + error.message);
        return res.sendServerError(error.message);
    }

    return res.sendSuccess("Email sent.");
}

async function newPassword(req, res) {
    const { password } = req.body;

    const email = req.cookies.emailCookie;

    if(!email || !password) {
        return res.sendUserError(`Missing data. email: ${email}, password: ${password}`);
    }

    try {
        let user = await usersService.getUserByEmail(email);

        const userWithPass = await usersService.checkUserCredentials(email, password);
        if (userWithPass) {
            return res.sendUserError("Password must be a new one.");
        }

        const hashPassword = createHash(password);

        user = await usersService.updateUser(user._id, { password: hashPassword });

    } catch (error) {
        req.logger.error(`Changing ${email} password: ` + error.message);
        return res.sendServerError(error.message);
    }

    return res.sendSuccess("Password changed.");
}

async function premium(req, res) {
    const { uid } = req.params;

    try {
        let user = await usersService.getUserById(uid);
        if (!user) {
            return res.sendUserError("User not found.");
        }

        if (user.role === "admin")
            return res.sendUserError("Admins can't get their role changed.");

        req.logger.debug(`Changing ${uid} role from ${user.role} to ${user.role === "user" ? "premium" : "user"}`);

        user = await usersService.updateUser(uid, { role: user.role === "user" ? "premium" : "user" });

    } catch (error) {
        req.logger.error(`Changing ${uid} role: ` + error.message);
        return res.sendServerError(error.message);
    }

    return res.sendSuccess("Role changed.");
}

export default { restorePassword, newPassword, premium, getUsers }