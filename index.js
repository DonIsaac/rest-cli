const args = require('./argparsing');
const utils = require('./utils');
const generate = require('./generate.command');
const newProj = require('./new.command');
global.Promise = require('bluebird');

const { subcommand } = args;
console.dir(args);
for(let arg in args){
    if(typeof args[arg] === 'string'){
        args[arg] = args[arg].trim();
    }
}
const subcommands = {
    'gen': generate,
    'generate': generate,
    'new': newProj,
    'n': newProj,
    'create': newProj
}

subcommands[args.subcommand](args)
.then(response => {
    console.log(`res: ${response}`);
})
.catch(console.error);

