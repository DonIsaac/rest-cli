const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs'));

// TODO: Make this work lol
/*
 1) check if a file is a directory or a file
 2) if it's a file, return an object containg the filename/contents
 3) otherwise, iterate over the file's contents, call parseFile, merge it with dat boi, and return
 */
/**
 * 
 * @param {string} path 
 * @param {object} options 
 */
function parseFilesBluebird(path, options = {}) {
    let encoding = options.encoding || 'utf8';
    return fs.statAsync(path).then(async stats => {
        let file = {};

        if (stats.isDirectory()) {
            if(!path.endsWith('/')) path += '/';

            fs.readdirAsync(path).then(fileNames => {
                fileNames.forEach(async fileName => {
                    let contents = await parseFilesBluebird(path + fileName, options);
                    file[fileName] = contents;
                    console.log('dir');
                    console.log(file);
                    console.log(contents);
                });
            })
        } else {
            file = await fs.readFileAsync(path, encoding);

        }
        console.log('file');
        console.log(file);
        return file;
        
    })
    .then(possiblyObject => {
        if (typeof possiblyObject === 'object') {

        }
    })

    // fs.readdirAsync(path)
    //     .map(function (fileName) {
    //         var stat = fs.statAsync(fileName);
    //         return [stat, fileName];
    //     })
    //     .map(Promise.join(stat, fileName, function (stats, fileName) {
    //         let file = {};
    //         if (stats.isDirectory()) {
    //             fs.readdirAsync(path + fileName)
    //                 .map(fileName => parseFilesBluebird(path + fileName, options))
    //                 .map(result => {

    //                 });
    //         } else {
    //             file[fileName] = fs.readFileAsync(path + file, encoding)
    //             return file;
    //         }
    //     }))
}

async function main() {
    let path = './templates/test/';
    //fs.statAsync(dir).then(console.log);
    parseFilesBluebird(path).then(idk => {
        console.log('hi');
        console.dir(idk);
        //console.log('\n');
        //console.log('\n\n\n');
    }).catch(console.error);

}
main().catch(console.log);