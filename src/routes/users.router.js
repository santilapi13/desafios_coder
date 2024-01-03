import Router from './router.js'
import usersController from '../controllers/usersController.js';
import multer from 'multer';
import __dirname from '../util.js';

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/uploads/documents/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, req.params.uid + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

export class UsersRouter extends Router {
    init() {
        this.get('/', ["ADMIN"], usersController.getUsers);

        this.post('/restorePassword', ["PUBLIC"], alreadyAuthenticated, usersController.restorePassword);

        this.post('/newPassword', ["PUBLIC"], alreadyAuthenticated, checkCookie, usersController.newPassword);

        this.put('/premium/:uid', ["ADMIN"], usersController.premium);

        this.post('/:uid/documents', ["ADMIN", "USER", "PREMIUM"], upload.single("document"), usersController.addDocument);
    }
}