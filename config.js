module.exports = {
    portNumber: 80,
    publicFolder: './public',
    servedFolderPath: 'C:\\_\\server\\shared',
    uploadsFolder: 'uploads',
    folders: [
        {
            name: __dirname,
            permission: 'public'
        },
        {
            name: 'C:\\_\\server\\uploads',
            permission: 'private'
        }
    ]

}
