import nodemailer from 'nodemailer'
import { config } from '../config/dotenv.config.js';
import { usersService } from "../services/users.service.js";
import { createHash } from "../util.js";
import { generateJWT } from '../util.js';
import fs from 'fs';
import path from 'path';
import __dirname from '../util.js';

async function getUsers(req, res) {
    let users;

    try {
        users = await usersService.getUsers();
        if (!users) {
            return res.sendUserError("Users not found.");
        }
        users.forEach(user => {
            delete user.password;
            delete user._id;
        });
    } catch (error) {
        req.logger.error(`Getting users: ` + error.message);
        return res.sendServerError(error.message);
    }

    res.sendSuccess(users);
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

        if (user.role === "user") {
            const validator = ["ID", "proof of address", "proof of account status"];
            let error = false;
            validator.forEach(element => {
                error = error || !user.documents.find(document => document.name === element);
            });
            if (error) {
                return res.sendUserError(`ID, proof of address and proof of account status documents are necessary before switching to premium account.`);
            }
        }

        req.logger.debug(`Changing ${uid} role from ${user.role} to ${user.role === "user" ? "premium" : "user"}`);

        user = await usersService.updateUser(uid, { role: user.role === "user" ? "premium" : "user" });

    } catch (error) {
        req.logger.error(`Changing ${uid} role: ` + error.message);
        return res.sendServerError(error.message);
    }

    return res.sendSuccess("Role changed.");
}

function determineDestinationFolder(type) {
    switch (type) {
        case 'profile':
            return 'src/uploads/profiles';
        case 'product':
            return 'src/uploads/products';
        default:
            return 'src/uploads/documents';
    }
}

async function addDocument(req, res) {
    const { uid } = req.params;
    const { type } = req.body;

    if (!req.file)
        return res.sendUserError("Missing document.");

    try {
        let user = await usersService.getUserById(uid);
        if (!user) {
            return res.sendUserError("User not found.");
        }

        const sourcePath = req.file.path;
        const destinationFolder = determineDestinationFolder(type);
        const destinationPath = path.join(__dirname, '..', destinationFolder, req.file.filename);

        fs.renameSync(sourcePath, destinationPath);

        let newDocuments = user.documents;
        newDocuments.push({
            name: type,
            reference: destinationPath
        });

        user = await usersService.updateUser(uid, { documents: newDocuments });

    } catch (error) {
        req.logger.error(`Adding document to ${uid}: ` + error.message);
        return res.sendServerError(error.message);
    }

    return res.sendSuccess("Document added.");
}

function deleteUsersBeforeTime(time) {
    let deletedUsers = [];

    users.forEach(async user => {
        if (user.role === "user" && user.last_connection < new Date(Date.now() - time)) {
            await usersService.deleteUser(user._id);
        }
        deletedUsers.push(user);
    });

    return deletedUsers;
}

function sendDeletedAccountEmail(deletedUsers) {
    deletedUsers.forEach(user => {
        transport.sendMail({
            from: "Notificador " + config.MAILER_USER,
            to: user.email,
            subject: "Cuenta borrada por inactividad",
            html: `
                <h1>Cuenta borrada</h1>
                <p>Se borró su cuenta  de nuestro e-commerce por inactividad en las últimas 48 hs.</p>
            `
        });
    });
}

async function deleteInactiveUsers(req, res) {
    let users;
    let deletedUsers = [];

    try {
        users = await usersService.getUsers();
        if (!users) return res.sendUserError("Users not found.");

        const time = 1000*60*60*24*2;   // 2 days
        deletedUsers = deleteUsersBeforeTime(time);

        sendDeletedAccountEmail(deletedUsers);
    } catch (error) {
        req.logger.error(`Deleting inactive users: ` + error.message);
        return res.sendServerError(error.message);
    }

    return res.sendSuccess(deletedUsers);
}

export default { restorePassword, newPassword, premium, getUsers, addDocument, deleteInactiveUsers }