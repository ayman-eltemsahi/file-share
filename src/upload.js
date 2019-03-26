const fs = require('fs');
const multer = require('multer');
const config = require('../config');


function initialize(app) {

    const upload = multer({ dest: config.uploadsFolder });

    app.post('/', upload.single("fileToUpload"), (req, res) => {
        const tmp_path = req.file.path;

        const target_path = `${config.uploadsFolder}/${req.file.originalname}`;

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', () => {
            fs.unlinkSync(tmp_path);
            res.redirect('/');
        });

        src.on('error', (err) => {
            fs.unlinkSync(tmp_path);
            res.status(500).send('an error has happened');
        });

    });
}

module.exports = {
    initialize
};
