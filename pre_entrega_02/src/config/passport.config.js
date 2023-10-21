import passport from 'passport';
import local from 'passport-local'
import github from 'passport-github2'
import jwt from "passport-jwt";
import { usersModel } from '../dao/models/users.model.js'
import { createHash, isValidPassword } from '../util.js'
import { PRIVATE_KEY } from '../util.js'

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

            if (!first_name || !last_name || !email || !age || !password) {
                const info = {message: "Missing data"}
                return done(null, false, info);
            }

			try {
				let user = await usersModel.findOne({email: username});
				if (user) {
					const info = {message: "Email already registered"}
					return done(null, false, info);
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
		console.log("Estrategia passport utilizada: Estrategia Local Login");
        if (!email || !password) {
            const info = {message: "Missing credentials"}
            return done(null, false, info);
        }

		try {
			const user = await usersModel.findOne({email});
			if (!user) {
				const info = {message: "Invalid credentials"}
                return done(null, false, info);
			}

			if (!isValidPassword(user, password)) {
                const info = {message: "Invalid credentials"}
                return done(null, false, info);
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
			console.log("Estrategia passport utilizada: Estrategia GitHub");
			let user = await usersModel.findOne({email:profile._json.email});
			if (!user) {
				let newUser = {  
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


