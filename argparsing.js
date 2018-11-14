const fs = require('fs');
const { ArgumentParser } = require('argparse');

/**
 * Root parser
 */
const rootParser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'CLI utilities for generating components for a RESTful system.',
});

const subparsers = rootParser.addSubparsers({
    title: 'subcommands',
    dest: "subcommand"
});

/* 'new' sub-command
 * creates boilerplate code for a new REST server
 */
let newProj = subparsers.addParser('new', {
    aliases: ['n', 'create'],
    addHelp: true,
    description: 'Creates a new project folder, filling it with boilerplate code.'
});
newProj.addArgument(['-t', '--type'], {
    action: 'store',
    help: 'The type of project to create'
});
newProj.addArgument(['-n', '--name'], {
    action: 'store',
    help: 'The name of the project.'
});
/* 'generage' sub-command
 * creates a folder containing code for a new MVC component. 
 */
let genComponent = subparsers.addParser('generate', {
    aliases: ['gen'],
    addHelp: true,
    description: 'Adds a new folder containing the MVC component boilerplate code for an endpoint to an existing project.'
});
genComponent.addArgument(['-c', '--component'], {
    action: 'store',
    help: 'Specifies the kind of component to generate.'
})
genComponent.addArgument(['-n', '--name'], {
    action: 'store',
    help: 'Specifies the name for the component.'
});
genComponent.addArgument(['-S', '--isCaseSensitive'], {
    action: 'storeTrue',
    help: 'Turns off automatic case handling for the component\'s name. If provided, the generator will use the name with the exact casing provided by the user.'
});

  /*var args = */module.exports = rootParser.parseArgs();