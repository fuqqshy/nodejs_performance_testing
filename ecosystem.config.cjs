
require('dotenv').config();
module.exports = {
  apps: [
    {
      name: "node-bench",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3000",
      exec_mode: "cluster",
      instances: Number(process.env.PM2_INSTANCES || 1),
      env: {
        NODE_ENV: "production",
        WORKER_COUNT:
          process.env.WORKER_COUNT || "8",
        CPU_ITERATIONS:
          process.env.CPU_ITERATIONS || "10000",
      },
    },
  ],
};
