const fs = require('fs');
const multer = require('multer');
const config = require('../config');


function initialize(app) {

    var upload = multer({ dest: config.uploadsFolder });

    app.post('/', upload.single("fileToUpload"), function (req, res) {
        var tmp_path = req.file.path;

        var target_path = `${config.uploadsFolder}/${req.file.originalname}`;

        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', function () {
            fs.unlink(tmp_path);
            res.redirect('/');
        });

        src.on('error', function (err) {
            fs.unlink(tmp_path);
            res.send('an error has happened');
        });

    });
}

module.exports = {
    initialize
};