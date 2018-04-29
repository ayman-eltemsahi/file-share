
function allowFirstNUsers(usersCount) {
    var currentUsers = [];

    return function (req, res, next) {
        let ip = req.ip;

        // me
        if (ip == '::1') {
            req.localhost = true;

            return next();
        }

        let ind = ip.indexOf(':1') + 1;
        ip = ip.substring(ind);

        console.log(`  ================={{  ${ip}  }}=================  `);

        // user is already allowed
        if (currentUsers.indexOf(ip) > -1) {
            return next();
        }

        // new user
        if (currentUsers.length >= usersCount) {
            return res.status(406).end('No More users allowed');
        } else {
            currentUsers.push(ip);
            return next();
        }

    };
}

module.exports = {
    allowFirstNUsers
}