const Exception = require('../utils/Exception');

exports.Limitter = (value, min, max, title, next) => {
    if (value < min || value > max)
        return next(new Exception(`${title} must be between ${min} and ${max}`, 401));
};

exports.ArrayLimitter = (value, min, max, title, next) => {
    if (!Array.isArray(value) || value.length < min || value.length > max)
        return next(new Exception(`${title} must be between ${min} and ${max}`, 401));
};
