const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    morgan = require('morgan'),
    session = require('express-session'),
    bluebird = require('bluebird'),
    helmet = require('helmet'),
    debug = require('debug')('app:application'),
    errorHandler = require('./lib').errorHandler;


// Create express application and set it as the export
module.exports = exports = function createApp(options) {
    const app = express();

    // !* Ensure global and mongoose Promises are consistent *!
    global.Promise = mongoose.Promise = bluebird;

    // Connect to MongoDB
    mongoose.connect(options.db.uri, { useNewUrlParser: true }).then(
        () => { debug('Connected to MongoDB'); },
    ).catch(err => {
        console.error(`Connection URI: ${options.db.uri}`);
        console.error('ERR: MongoDB connection error. Make sure MongoDB is running and the connection URI is valid.\n' + err);
        process.exit(1);
    });

    /*
     * ========================================
     * Load that funky middleware white boyyyyy
     * ========================================
     */

    // HTTP Logger, only enabled if system is in development
    if (app.get('env') === 'development') {
        app.use(morgan('combined'));
    }
    app.use(helmet()); // https://www.npmjs.com/package/helmet
    app.use(compression()); // https://www.npmjs.com/package/compression
    app.use(bodyParser.json({
        strict: true // Only accept objects and arrays
    })); // https://www.npmjs.com/package/body-parser
    app.use(session(options.session)); // https://www.npmjs.com/package/express-session

    app.set('port', options.server.port);

    const baseURL = '/api/v0';
    //app.use(baseURL, require('./endpoint').Router);

    // Error handler middleware, should always come after all routers
    app.use(errorHandler);

    // Production flag for convenience
    Object.defineProperty(app, 'isProduction',{
        get: function() {return this.get('env') === 'production'},
        set: val => null,
        enumerable: false,
        configurable: false
    })

    // Return instantiated Express app
    return app;
}



