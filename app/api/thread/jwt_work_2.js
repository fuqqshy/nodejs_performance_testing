const { sign } = require('jsonwebtoken');

module.exports = ({ payload, secret, options }) => {
    const start = Date.now();
    while (Date.now() - start < 200) {
    }
    return sign(payload, secret, options);
};