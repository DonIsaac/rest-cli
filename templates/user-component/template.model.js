const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const Types = Schema.Types;

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

     /* ================
      * Template Statics
      * ================
      */

     /* ==============
      * Template Hooks
      * ==============
      */

    /**
     * Export the newly created model
     * @type {Model}
     */
    const Template = module.exports = model('Template', templateSchema);
   