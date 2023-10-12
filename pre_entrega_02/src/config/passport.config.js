import passport from 'passport';
import local from 'passport-local'
import github from 'passport-github2'
import { usersModel } from '../dao/models/users.model.js'
import { createHash, isValidPassword } from '../util.js'

const LocalStrategy = local.Strategy;
const GitHubStrategy = github.Strategy;

export const initializePassport = () => {
	passport.use('register', new LocalStrategy({
			passReqToCallback: true,
			usernameField: 'email'
		}, async (req, username, password, done) => {
			const { first_name, last_name, email, age } = req.body;

            if (!first_name || !last_name || !email || !age || !password) {
                const error = {missingData: true}
                return done(null, false);
            }

			try {
				let user = await usersModel.findOne({email: username});
				if (user) {
					const error = {repeatedEmail: true}
					return done(null, false);
				}
				const newUser = {
					first_name,
					last_name,
					email,
					age,
					password: createHash(password)
				}
				let result = await usersModel.create(newUser);
				return done(null, result);
			} catch (error) {
				return done("Error al obtener el usuario: " + error);
			}
	}));

    passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	
	passport.deserializeUser(async (id, done) => {
		let user = await usersModel.findById(id);
		done(null, user);
	});

	passport.use('login', new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {

        if (!email || !password) {
            const error = {missingData: true}
            return done(null, false);
        }

		try {
			const user = await usersModel.findOne({email});
			if (!user) {
				const error = {invalidCredentials: true}
                return done(null, false);
			}

			if (!isValidPassword(user, password)) {
                const error = {invalidCredentials: true}
                return done(null, false);
            }

			return done(null, user);
		} catch (error) {
			return done(error);
		}
	}));

	passport.use('github', new GitHubStrategy({
		clientID: "Iv1.f2d39cec49bb29e7",
		clientSecret: "f63e75089320c560db4de666de8705a06e8b53b5",
		callbackURL: "http://localhost:8080/api/sessions/githubcallback"
	}, async (accessToken, refreshToken, profile, done) => {
		try {
			console.log(profile);
			let user = await usersModel.findOne({email:profile._json.email});
			// Si no existe, lo crea en la BD
			if (!user) {
				let newUser = {  // Se rellenan los campos que no vienen desde el perfil.
					first_name: profile._json.name,
					last_name: '',
					age: 18,
					email: profile._json.email,
					password: ''
				}
				let result = await usersModel.create(newUser);
				done(null, result);
			} else {
				done(null, user);
			}
		} catch (error) {
			done(null, user);
		}
	}))
}


