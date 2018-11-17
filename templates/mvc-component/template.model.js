/**
 * Defines the Template's data structures and functionality.
 * 
 * @author <YOUR NAME HERE>
 */

 // Imports
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const Types = Schema.Types;
const controllers = require('./template.controller');

/* ===========================
 * Template Schema Declaration
 * ===========================
 */
const templateSchema = new Schema({

});

/* ================
 * Template Methods
 * ================
 */
Object.assign(templateSchema.methods, controllers.methods);

/* ================
 * Template Statics
 * ================
 */
Object.assign(templateSchema.statics, controller.statics);

/* ==============
 * Template Hooks
 * ==============
 */

/**
 * Export the newly created model
 * @type {Model}
 */
const Template = module.exports = model('Template', templateSchema);
