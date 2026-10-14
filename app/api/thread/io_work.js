const { setTimeout: sleep } = require('node:timers/promises');
const { readFile } = require('node:fs/promises');

// Piscina 调用的函数
module.exports = async function ({ mode, delayMs, filePath }) {
  switch (mode) {
    case 'timer': {
      // 模拟异步 I/O 等待
      await sleep(delayMs);

      return { bytes: 0 };
    }

    case 'file': {
      // 真实文件 I/O
      const buffer = await readFile(filePath);

      return { bytes: buffer.length };
    }

    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
};