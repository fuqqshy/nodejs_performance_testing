const { sign } = require('jsonwebtoken');

module.exports = ({ payload, secret, options }) => {
    return sign(payload, secret, options);
};