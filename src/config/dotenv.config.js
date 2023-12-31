import dotenv from 'dotenv';

dotenv.config({path:"../.env", override:true});

export const config = {
	MODE: process.env.MODE,
	PORT: process.env.PORT,
	MONGO_URL: process.env.MONGO_URL,
	PRIVATE_KEY: process.env.PRIVATE_KEY,
	clientID: process.env.clientID,
	clientSecret: process.env.clientSecret,
	callbackURL: process.env.callbackURL,
	PERSISTENCE: process.env.PERSISTENCE,
	MAILER_USER: process.env.MAILER_USER,
	MAILER_PASS: process.env.MAILER_PASS,
}