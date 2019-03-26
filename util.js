const fs = require('fs');
var config = require('./config');

function lstat(foldername, filename) {
    return new Promise((resolve, reject) => {
        fs.lstat(`${foldername}/${filename}`, (err, stat) => {
            if (err) {
                reject(err);
            } else {
                stat.filename = filename;
                resolve(stat);
            }
        });
    });
}

function formatSize(fileSize) {
    if (fileSize > 1000000000) {
        return (fileSize / 1000000000).toPrecision(3) + " GB";
    } else if (fileSize > 1000000) {
        return (fileSize / 1000000).toPrecision(3) + " MB";
    } else if (fileSize > 1000) {
        return (fileSize / 1000).toPrecision(3) + " KB";
    } else {
        return fileSize + " bytes"
    }
}

function formatMessages(messages) {
    return messages
        .map(msg => `<pre>${msg}</pre>`)
        .join('');
}

function formatName(name) {
    if (typeof name !== 'string' || name.length < 70) return name;
    return name.substring(0, 67) + '...';
}

function getFolder(foldername) {
    let folder = config.folders.find(x => x == foldername || x.name == foldername);
    if (!folder) return;

    if (typeof folder === 'string') {
        folder = {
            name: folder,
            permission: 'public'
        };
    }

    return folder;
}

function to64(text) {
    return Buffer.from(text).toString('base64');
}

function from64(text) {
    return Buffer.from(text, 'base64').toString();
}

module.exports = {
    lstat,
    formatSize,
    formatMessages,
    formatName,
    getFolder,
    to64,
    from64,
};
