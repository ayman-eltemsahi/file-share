const fs = require("fs");
const util = require("../util");
const config = require('../config');
const messages = require('./messages');

const PUBLIC = 'public';
const PRIVATE = 'private';

function initialize(app) {
    app.get('/', (req, res) => {
        fs.promises.readFile('./home.html', 'utf8')
            .then(homePage => onReadHomePage(homePage, req, res))
            .catch(err => {
                console.error(err);
                res.stats(500).end();
            })
    });

    app.get('/files/:foldername', onReadFolder);
}

function onReadHomePage(homePage, req, res) {
    let items = '';

    config.folders.forEach(folder => {
        if (typeof folder === 'string') {
            folder = {
                name: folder,
                permission: PUBLIC
            };
        }

        if (folder.permission === PUBLIC || req.host === 'localhost') {
            items += `<option value='${folder.name}'>${folder.name}</option>`;
        }

    });

    homePage = homePage
        .replace('<%folders%>', items)
        .replace('<%title%>', 'Server')
        .replace('<%messages%>', messages.get());

    res.send(homePage);
}

function onReadFolder(req, res) {
    const foldername = util.from64(req.params.foldername);

    const folder = util.getFolder(foldername);

    if (!folder) return res.status(404).end();
    if (folder.permission === PRIVATE && !req.localhost) return res.status(403).end();

    fs.readdir(folder.name, (err, files) => {

        Promise
            .all(files.map(filename => util.lstat(folder.name, filename)))
            .then(allStats => {
                const folder64 = util.to64(folder.name);

                let str = "";
                allStats
                    .filter(stats => stats.isFile())
                    .sort((a, b) => b.mtime - a.mtime)
                    .forEach((item, i) => {
                        str += `
                        <tr>
                            <td>${i + 1}</td>
                            <td><a href="file/${folder64}/${item.filename}" title="${item.filename}">${util.formatName(item.filename)}</a></td>
                            <td>${util.formatSize(item.size)}</td>
                        </tr>
                    `;
                    });

                res.send(str);
            })
            .catch(err => {
                console.log(err);
                res.status(500).end();
            });
    });
}

module.exports = {
    initialize
};
