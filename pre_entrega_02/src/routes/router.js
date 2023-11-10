import { Router as ExpressRouter} from 'express';
import { PRIVATE_KEY } from '../util.js'
import jwt from 'jsonwebtoken';

export default class Router {
	constructor() {
		this.router = ExpressRouter();
		this.init();
	}

	getRouter() {
		return this.router;
	}

	init() {} 


	applyCallbacks(callbacks) {
		return callbacks.map(callback => async (...params) => {
			try {
				await callback.apply(this, params);
			} catch (error) {
				console.log(error);
				params[1].status(500).send(error);
			}
		});
	}

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.status(200).send({status: "success", payload});
        res.renderSuccess = (view, payload) => {
            res.setHeader("Content-Type","text/html");
            res.status(200).render(view, payload);
        };
        res.renderUserError = (view, error) => {
            res.setHeader("Content-Type","text/html");
            res.status(400).render(view, error);
        };
        res.renderServerError = (view, error) => {
            res.setHeader("Content-Type","text/html");
            res.status(500).render(view, error);
        };
        res.sendServerError = error => res.status(500).send({status: "error", error});
        res.sendUserError = error => res.status(400).send({status: "error", error});
        res.sendAuthenticationError = error => res.status(401).send({status: "error", error});// .redirect("/login");
        res.sendAuthorizationError = error => res.status(403).send({status: "error", error});

        next();
    }

    handlePolicies = policies => (req, res, next) => {
        if (policies[0] === "PUBLIC") return next();
    
        if(!req.cookies.coderCookie) return res.sendAuthenticationError("Missing token");
        let token = req.cookies.coderCookie;

        jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
            if (err) return res.sendAuthenticationError("Invalid token");
            
            if (!policies.includes(decoded.user.role.toUpperCase())) return res.sendAuthorizationError("User not authorized to perform this action");

            req.user = decoded.user;
        });

        next();
    }
    
    get(path, policies, ...callbacks) {
        this.router.get(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks));
    }
    
    post(path, policies, ...callbacks) {
        this.router.post(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks));
    }
    
    put(path, policies, ...callbacks) {
        this.router.put(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks));
    }
    
    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallbacks(callbacks));
    }
}