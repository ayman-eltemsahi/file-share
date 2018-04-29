const fs = require("fs");
const path = require("path");
const util = require('../util');
const debug = require('debug')('file');

function initialize(app) {
    app.get('/file/:foldername/:filename', function (req, res) {
        let foldername = req.params.foldername;
        let filename = req.params.filename;

        if (!foldername || !filename) return res.status(404).end();

        foldername = util.from64(foldername);
        let folder = util.getFolder(foldername);

        if (!folder) return res.status(404).end();
        if (folder.permission === 'private' && !req.localhost) return res.status(403).end();

        let fullPath = path.join(foldername, filename);

        debug(`ip   :  ${req.ip}\nfile :  ${fullPath}`);

        fs.exists(fullPath, (exists) => {

            if (exists) {
                res.sendFile(fullPath);
            } else {
                res.end(`The file \n\n\t${filename}\n\nDoesn't exists`);
            }
        });
    });
}

module.exports = {
    initialize
};
