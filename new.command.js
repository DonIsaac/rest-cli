const copyTemplates = require('./utils').copyTemplates;
const fs = require('fs');
const { promisify } = require('bluebird');
const mkdir = promisify(fs.mkdir);

const types = {
    'express': './templates/express-project/'
}
module.exports = async function newProj({ type, name }) {
    console.log('called');
    let templateDir = types[type];

    //await mkdir(`${process.cwd()}/${name}`);
    return await copyTemplates(name, templateDir, {});

}