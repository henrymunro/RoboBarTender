var express = require('express')
var session = require('client-sessions')
const debug = require('debug')('router')

debug('Startup: Loading in router')


module.exports =  class Router {
	constructor() {
    	
		var router = express.Router()		

		const cors = {
            origin: [
            	'https://henrymunro.com',
            	"https://www.henrymunro.com",
            	"https://stg.henrymunro.com",
            	'https://dev.henrymunro.com',
            	'http://localhost:3000'
            	],
            default: "https://henrymunro.com"
        }

		router.all('*', function(req, res, next) {
                var origin = cors.origin.indexOf(req.header('host').toLowerCase()) > -1 ? req.headers.origin : cors.default;
                res.header("Access-Control-Allow-Origin", origin)
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST')
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                next();
        });

		// // Session management 
	 //    router.use(session({
	 //        cookieName: 'session', // cookie name dictates the key name added to the request object
		// 	secret: 'blargadeeblargblarg', // should be a large unguessable string
		// 	duration: 10 * 60 * 1000, // how long the session will stay valid in ms
		// 	activeDuration: 5 * 60 * 1000, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
	 //   		cookie: {
		// 	    path: '/', // cookie will only be sent to requests under '/api'
		// 	    //maxAge: 60000, // duration of the cookie in milliseconds, defaults to duration above
		// 	    ephemeral: false, // when true, cookie expires when the browser closes
		// 	    httpOnly: true, // when true, cookie is not accessible from javascript
		// 	    //secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
		// 	  }
	 //    }))


		// router.use(function(req, res, next) {
		// 	debug('Starting session checking', req.originalUrl, req.baseUrl)
		// 	//Always allow login path
		// 	if(req.baseUrl === '/login'){
		// 		debug('Log in path moving on...')
		// 		next()
		// 	}else {
		// 		debug('Checking user session: ', req.session)
		// 		if(!req.session || !req.session.username){
		// 			debug('Session expired')
		// 			if(req.baseUrl === '/home'){
		// 				debug('Redirecting to login page')
		// 				req.session.reset()
	 //        			res.redirect('/login')
	 //        		}else{
	 //        			debug('Sending session expiry to client')
	 //        			req.session.reset()
	 //        			res.send({userTimeout: true})
	 //        		}

		// 		}else{
		// 			debug('Session okay moving on ...')
		// 			next()	
		// 		}
		//  	}
		//	
		//});

		this.router = router
	}

	router(){
		return this.router
	}
}
