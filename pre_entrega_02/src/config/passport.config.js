import passport from 'passport';
import local from 'passport-local'
import github from 'passport-github2'
import jwt from "passport-jwt";
import { usersService } from '../../services/users.service.js'
import { isValidPassword } from '../util.js'
import { PRIVATE_KEY, clientID, clientSecret, callbackURL } from '../util.js'
import UserDTO from '../../DAO/DTOs/user.dto.js';

const LocalStrategy = local.Strategy;
const GitHubStrategy = github.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = req => {
	let token = null;
	if (req && req.cookies && req.cookies.coderCookie)
		token = req.cookies.coderCookie;

	return token;
}

export const initializePassport = () => {
	passport.use('register', new LocalStrategy({
			passReqToCallback: true,
			usernameField: 'email'
		}, async (req, username, password, done) => {
			console.log("Estrategia passport utilizada: Estrategia Local Register");
			const { first_name, last_name, email, age } = req.body;
			let newUser;

			try {
				newUser = new UserDTO({ first_name, last_name, email, age, password });
			} catch (error) {
				return done(null, false, error);
			}

			try {
				let user = await usersService.getUserByEmail(email);
				if (user) {
					const info = {message: "Email already registered"}
					return done(null, false, info);
				}

				let result = await usersService.createUser(newUser);
				return done(null, result);
			} catch (error) {
				return done("Error al obtener el usuario: " + error);
			}
	}));

    passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	
	passport.deserializeUser(async (id, done) => {
		let user = await usersService.getUserById(id);
		done(null, user);
	});

	passport.use('login', new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
		console.log("Estrategia passport utilizada: Estrategia Local Login");
        if (!email || !password) {
            const info = {message: "Missing credentials"}
            return done(null, false, info);
        }

		try {
			const user = await usersService.getUserByEmail(email);
			if (!user) {
				const info = {message: "Invalid credentials"}
                return done(null, false, info);
			}

			if (!isValidPassword(user, password)) {
                const info = {message: "Invalid credentials"}
                return done(null, false, info);
            }

			user.password = undefined;
			return done(null, user);
		} catch (error) {
			return done(error);
		}
	}));

	passport.use('github', new GitHubStrategy({
		clientID,
		clientSecret,
		callbackURL
	}, async (accessToken, refreshToken, profile, done) => {
		console.log("Estrategia passport utilizada: Estrategia GitHub");
		let email = profile._json.login + "@github.com";

		try {
			let user = await usersService.getUserByEmail(email);
			if (!user) {
				let completeNameParts = profile._json.name.split(' ');
				let first_name = completeNameParts.slice(0, -1).join(' ');
				let last_name = completeNameParts[completeNameParts.length - 1];
				let age = 18;  // Default age
				let password = '';

				let newUser = new UserDTO({ first_name, last_name, email, age, password });
				user = await usersService.createUser(newUser);
			}

			return done(null, user);
		} catch (error) {
			return done(null, false, error);
		}
	}))

	passport.use('jwt', new JWTStrategy({
		jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
		secretOrKey: PRIVATE_KEY 
	}, async (jwt_payload, done) => {
		console.log("Estrategia passport utilizada: Estrategia JWT");
		try {
			return done(null, jwt_payload);
		} catch (error) {
			return done(error);
		}	
	}));
}


