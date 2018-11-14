// Imports
const { promisify } = require('bluebird');
global.Promise = require('bluebird');
const MapUtils = require('./MapUtils');

const fs = require("fs"),
    readdir = promisify(fs.readdir),
    readFile = promisify(fs.readFile),
    writeFile = promisify(fs.writeFile),
    stat = promisify(fs.stat),
    mkdir = promisify(fs.mkdir);

// Functions



/**
 * Asynchronously parses all files in a directory. If the directory has sub directories,
 * they are parsed recursively and stored in a predictable hierarchical structure.
 * 
 * Available options:
 * 
 *   - stream: boolean        - If true, the values of each file KV pair will be a ReadStream, not the file contents. Defaults to false.
 * 
 *   - recursive: boolean     - Whether or not subdirectories should be recursively parsed. Defaults to true.
 * 
 *   - encoding: string       - The encoding of the file. Defaults to utf-8.
 * 
 * @param {string} dir          the path to the directory to parse
 * @param {any} options         optional options object
 * 
 * @returns {AsyncIterableIterator<any>}    An async iterator that yields/resolves to each file/content or directory/content pair
 */
async function* parseFiles(dir, options = {}) {
    if (!dir) throw new Error('"dir" parameter must be a valid directory path.');

    let fileNames = await Promise.resolve(readdir(dir));

    for (let name of fileNames) {
        //yield {name: name, contents: await parseFile(dir + name, options)};
        let ret = {};
        ret[name] = await parseFile(dir + name, options);
        yield ret;
    }
}

/**
 * 
 * @param {PathLike} filePath 
 * @param {object} options 
 */
async function parseFile(filePath, options) {
    let stream = !!options.stream;
    let encoding = options.encoding || 'utf8';
    let recursive = options.recursive == null || !!options.recursive;

    return stat(filePath).then(async stats => {
        // If the 'file' is a directory, parse it
        if (stats.isDirectory()) {
            if (!recursive) {
                return null;
            } else {
                // TODO: Make generator
                let obj = {}
                for await (let file of parseFilesGen(filePath + '/', options)) {
                    obj = Object.assign(obj, file);
                }
                return obj;
            }
            //return recursive ? parseFiles(filePath + '/') : null;
        } else {
            if (stream) {
                return fs.createReadStream(filePath, { encoding: stats.encoding });
            } else {
                // Otherwise, read it and send it back
                return readFile(filePath, encoding);
            }
        }
    });
}

/**
 * Copies a directory of templates to a new folder.
 * 
 * Available options:
 * 
 *   - dest: PathLike         - The path to the destination folder. Defaults to {current working directory}/{name}
 * 
 *   - stream: boolean        - If true, the values of each file KV pair will be a ReadStream,not the file contents. Defaults to false.
 * 
 *   - recursive: boolean     - Whether or not subdirectories should be recursively parsed. Defaults to true.
 * 
 *   - encoding: string       - The encoding of the file. Defaults to utf-8.
 * 
 * @param {string} name         the name of the new component
 * @param {string} templateDir  path to the directory containing the templates
 * @param {any} replacements    object containing key/value pairs, keys = expression to search for & value = what to replace it with
 * @param {string} options      optional options object
 */
async function copyTemplates(name, templateDir, replacements, options = {}) {
    let dest = options.destination || `${process.cwd()}/${(options.isCaseSensitive ? name : name.toLowerCase())}/`;
    let templates = {};
    let writeArray = [];

    try {
        await Promise.try(() => mkdir(dest, { recursive: true }));
        templates = await parseFiles(templateDir, options);
    } catch (err) {
        if (err.code == "EEXIST") {
            return `A component with the name ${name} already exists. Aborting.`;
        } else {
            throw err;
        }
    }

    MapUtils.processElement(templates, (key, value) => {
        let newFileName = key;
        let newFileContents = value;

        if (typeof newFileContents === 'string') {
            for (let regex in replacements.keys) {
                newFileName = newFileName.replace(new RegExp(regex, 'g'), replacements.keys[regex]);
            }
            for (let regex in replacements.values) {
                newFileContents = newFileContents.replace(new RegExp(regex, 'g'), replacements.values[regex]);
            }

            writeArray.push(writeFile(dest + newFileName, newFileContents, { encoding: 'utf8' }));
        } else {
            options.destination = dest + file;
            writeArray.push(copyTemplates2(name, templateDir + key, replacements, options));
        }


    });
    return Promise.all(writeArray);
}

module.exports = { parseFiles, copyTemplates };


// Old code that I don't want to throw away just yet

/*function parseFiles(dir, options = {}) {
    let stream = !!options.stream || false;
    let recursive = !!options.recursive || true;
    if (!dir) {
        throw new Error('"dir" parameter must be a valid directory path.');
    }
    return readdir(dir).then(async names => {
        let readPromises = names.map(name => {
            return stat(dir + name).then(stats => {
                // If the 'file' is a directory, parse it
                if (stats.isDirectory()) {
                    return recursive ? parseFiles(dir + name + '/') : null;
                } else {
                    if (stream) {
                        return fs.createReadStream(dir + name, { encoding: stats.encoding });
                    } else {
                        // Otherwise, read it and send it back
                        return readFile(dir + name, 'utf8');
                    }

                }
            })
        });
        let contents = await Promise.all(readPromises);
        let fileMap = {};
        for (let i = 0; i < names.length; i++) {
            fileMap[names[i]] = contents[i];
        }

        return fileMap;
    })
}*/



/*async function copyTemplates(name, templateDir, replacements, options = {}) {
    let dest = options.destination || `${process.cwd()}/${(options.isCaseSensitive ? name : name.toLowerCase())}/`;
    let templates = {};
    let writeArray = [];
    try {
        await Promise.try(() => mkdir(dest, { recursive: true }));
        templates = await parseFiles(templateDir, options);
    } catch (err) {
        if (err.code == "EEXIST") {
            return `A component with the name ${name} already exists. Aborting.`;
        } else {
            return err.msg;
        }
    }

    for (let file in templates) {
        if (typeof file === "string") {
            let newFileName = file.replace('template', name);*/
            /**@type {string} */
            //let text = templates[file].replace();
            /*for (let replacement in replacements) {
                text = text.replace(new RegExp(replacement, 'g'), replacements[replacement]);
            }
            writeArray.push(writeFile(dest + newFileName, text, { encoding: 'utf8' }));
        } else {
            options.destination = dest + file;
            writeArray.push(copyTemplates(name, templateDir + file, replacements, options));
        }
    }

    await Promise.all(writeArray);
}*/
