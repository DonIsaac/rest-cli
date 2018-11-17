/**
 * Decorator utilities
 */

const debug = require('debug')('gdms:controller');

/**
 * Decorates an asynchronous controller in a Promise to make it compatible with
 * Express' built in error handling.
 * 
 * @param {RequestHandlerParams} controller asynchronous controller function
 * 
 * @returns {RequestHandlerParams} asynchronous controller function compatible 
 *                                 with Express's error handling
 */
module.exports.asyncController = (controller) => {
    let asyncCtrl = (req, res, next) => {
        //debug(`controller ${arguments.callee.displayName} called.`);
        return Promise
            .resolve(controller(req, res, next))
            .catch(next);
    }
    //asyncCtrl.displayName = `@AsyncController(${controller.displayName})`;

    return asyncCtrl;
}

/**
 * Decorates an asynchronous route parameter function in a Promise 
 * to make it compatible with Express' built in error handling.
 * 
 * @param {RequestHandlerParams} param asynchronous route parameter function
 * 
 * @returns {RequestHandlerParams} asynchronous route parameter function compatible 
 *                                 with Express's error handling
 */
module.exports.asyncParam = param => {
    arguments.callee.displayName = `@AsyncParam(${param.name})`;
    debug(`param ${param.name} called.`);
    return (req, res, next, value) =>
        Promise
            .resolve(param(req, res, next, value))
            .catch(next);
}



