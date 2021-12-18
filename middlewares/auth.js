const { verify } = require('jsonwebtoken');
const Exception = require('../utils/Exception');

exports.auth = (req, _res, next) => {
    const authorization = req.headers['authorization'];

    if (!authorization) return next(new Exception('No token provided', 403));

    const token = authorization.split(' ')[1];
    const { id } = verify(token, process.env.REFRESH_TOKEN_SECRET);

    if(id === null) return next(new Exception('Token not recognized.', 403));

    return next();
};

exports.apiAuth = (req, res, next) => {
    const authorization = req.headers['x-api-key'];

    if (!authorization) return res.sendStatus(403);

    if(!authorization) return res.sendStatus(403);
    if(authorization !== process.env.MASTER_KEY) return res.sendStatus(403);

    return next();
};