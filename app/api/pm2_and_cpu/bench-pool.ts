
import Piscina from "piscina";
import path from "node:path";

const workerCount = Number(
  process.env.WORKER_COUNT ?? 8
);

// 避免同一个进程内重复创建 Pool 和定时器
const globalForPool = globalThis as typeof globalThis & {
  benchPool?: Piscina;
  benchMonitor?: ReturnType<typeof setInterval>;
};

// 每个 Node.js 进程创建自己的 Piscina Pool
export const pool =
  globalForPool.benchPool ??
  new Piscina({
    filename: path.resolve(
      process.cwd(),
      "app/api/pm2_and_cpu/utils/cpu-task.mjs"
    ),
    minThreads: workerCount,
    maxThreads: workerCount,
    concurrentTasksPerWorker: 1,
    recordTiming: true,
  });

globalForPool.benchPool = pool;

// 每个进程只创建一个监控定时器
if (!globalForPool.benchMonitor) {
  globalForPool.benchMonitor = setInterval(() => {
    console.log(
      "[PISCINA_MONITOR]",
      JSON.stringify({
        timestamp: new Date().toISOString(),
        pid: process.pid,
        workerCount,
        queueSize: pool.queueSize,
        completed: pool.completed,
        waitMean: pool.histogram.waitTime.mean,
        waitP99: pool.histogram.waitTime.p99,
        runMean: pool.histogram.runTime.mean,
        runP99: pool.histogram.runTime.p99,
      })
    );
  }, 1000);

  // 不让监控定时器单独阻止进程退出
  globalForPool.benchMonitor.unref();
}
