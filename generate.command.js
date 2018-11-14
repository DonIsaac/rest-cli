const { copyTemplates } = require('./utils'),
    fs = require('fs'),
    { promisify } = require('bluebird');

//const { mkdir, writeFile } = bluebird.promisifyAll(fs);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const templateFolders = {
    "mvc": `${__dirname}/templates/mvc-component/`
};


/**
 * Generates a new component in an existing project.
 * @returns {Promise<string | undefined>} Resolves to an error message if an error is thrown, otherwise void
 */
module.exports = function generate({ component, name, isCaseSensitive }) {
    /* Throw an error if:
     *   1) component does not exist
     *   2) component is not a string
     *   3) component is not a valid component type
     */
    // Throw an error 1) if component doesn't exist 2) if component is not a string 3) component is not a valid component type
    if (!component || typeof component !== "string" || !templateFolders[component.toLowerCase()]) {
        //throw Error(`invalid value for component: ${component}`);
        return Promise.reject(() => new Error(`invalid value for component: ${component}`));
    }

    component = component.toLowerCase();
    // Cast truthy/falsy values to booleans
    isCaseSensitive = !!isCaseSensitive;

    let replacements = {
        'template': name.toLowerCase(),
        'Template': name.charAt(0).toUpperCase().concat(name.substr(1))
    }
    
    return copyTemplates(name, templateFolders[component], replacements, { isCaseSensitive });
    //.catch(OperationalError, err => {
    //    return (`A component with the name ${name} already exists. Aborting.`);
    //})
    // Generate the specified component type
    //componentTypes[component](name, isCaseSensitive)
}



