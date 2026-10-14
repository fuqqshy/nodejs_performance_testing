const { sign } = require('jsonwebtoken');

module.exports = ({ payload, secret, options }) => {
    // 模拟长时间读操作，比如文件/视频
    const start = Date.now();
    while (Date.now() - start < 200) {
        // 在子线程里去死循环 200ms
    }
    return sign(payload, secret, options);
};