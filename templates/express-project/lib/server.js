const debug = require('debug')('app:launcher'),
    config = require('../config.json');

const app = require('./app')(config);

module.exports = function start() {
    app.listen(app.get('port'), () => {
        debug(`Server listening on ${app.get('port')}.`);
    });
}
