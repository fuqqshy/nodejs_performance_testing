# 用于同步大数据读取时出现cpu的 runtime时长大幅增长下的排查思路

这个实验从 1进程 * 16线程池/2进程 * 8线程池/ 4进程 * 4 线程 的实际测试出发，研究如何优化架构方案

## 操作方法

```
// .env 文件
WORKER_COUNT=16  // 线程数
CPU_ITERATIONS=10000  // 加密次数
PM2_INSTANCES=1  // 进程数

```

通过更改上面的值，可以测试不同的组合对应的现象


# 启动服务

```
// 根目录下执行并启动pm2
npm run build
npx pm2 start ecosystem.config.cjs

```

## 客户端使用 k6 发起并发请求
请注意，为了尽量的让数据更加准确，最好将k6的测试代码放在另一台电脑上，这样服务端代码和客户端压测代码就不争抢同一个cpu

```
// 这里以 windows为例， 在Power Shell中执行

// 1. 安装k6
winget install k6 --source winget

// 2. 先测试是否能够请求的到，如果返回数据成功，则可继续
curl -X POST http://localhost:3000/api/pm2_and_cpu

// 3. 设置并发数和压测时长
$env:RATE = "50"  // 并发50
$env:DURATION = "60s"  // 持续 60s

// 执行
// cpu.js 放在了app/api/pm2_and_cpu/k6目录下，测试的时候请将这个文件放到客户端电脑上使用
run .\cpu.js


```

## 疑问
如有疑问，请issue告知，我将尽力解答

