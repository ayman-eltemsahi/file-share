const fs = require("fs").promises;
const path = require("path");
const util = require('../util');
const debug = require('debug')('file');

function initialize(app) {
    app.get('/file/:foldername/:filename', (req, res) => {
        let foldername = req.params.foldername;
        const filename = req.params.filename;

        if (!foldername || !filename) return res.status(404).end();

        foldername = util.from64(foldername);
        const folder = util.getFolder(foldername);

        if (!folder) return res.status(404).end();
        if (folder.permission === 'private' && !req.localhost) return res.status(403).end();

        const fullPath = path.join(foldername, filename);

        debug(`ip   :  ${req.ip}\nfile :  ${fullPath}`);

        fs.access(fullPath)
            .then(() => res.sendFile(fullPath))
            .catch(() => res.end(`The file \n\n\t${filename}\n\nDoesn't exists`))
    });
}

module.exports = {
    initialize
};
