/**
 * @file 通过cpu密集型的操纵，来看使用线程/线程池/完全主线程下的qps
 * 
 */
import 'server-only'
import {sign} from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server';
import { Worker } from 'worker_threads';
import path from 'path';

import { Piscina } from 'piscina';

const workerCount = Number(
  process.env.WORKER_COUNT || 8
);
const piscina = new Piscina({
    // if type == 'sign_thread_poll' please change to jwt_work_1.js
    // filename: path.resolve(process.cwd(), 'app/api/thread/jwt_work_1.js')
    filename: path.resolve(process.cwd(), 'app/api/thread/jwt_work_2.js'),
    minThreads: workerCount,
    maxThreads: workerCount,

    concurrentTasksPerWorker: 1,

    recordTiming: true,

});

// 新增：每秒采集一次指标，查看请求在线程池外的排队情况
const monitor = setInterval(() => {
  const metrics = {
    time: new Date().toISOString(),

    configuredThreads: piscina.maxThreads,
    activeThreads: piscina.threads.length,
    idleThreads: piscina.idleThreads,

    queueSize: piscina.queueSize,
    utilization: Number(
      (piscina.utilization * 100).toFixed(2)
    ) + '%',

    completed: piscina.completed,

    waitAvgMs: piscina.histogram.waitTime.average,
    waitP99Ms: piscina.histogram.waitTime.p99,

    runAvgMs: piscina.histogram.runTime.average,
    runP99Ms: piscina.histogram.runTime.p99,
  };

  console.log('[Piscina Metrics]', JSON.stringify(metrics));
}, 1000);

// 不让监控定时器单独阻止 Node.js 进程退出
monitor.unref();


function generateTokenInWorker(payload: any, secret: string, options: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(process.cwd(), 'app/api/thread/jwt_work_1.js');

    const worker = new Worker(workerPath, {
      workerData: { payload, secret, options },
    });

    worker.on('message', (token) => resolve(token));
    worker.on('error', (err) => reject(err));
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

export async function POST(req:NextRequest) {
    try {
        let token = '';
        
        const {email, password} = await req.json()
        if(email !== "test@gmail.com" || password !== '12345') {
             return NextResponse.json({success: false,message: 'authenticate failed'}, {status: 401})
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'sign_sync';
        const payload = { shopId: 'shop001', role: 'owner' };
        const secret = process.env.JWT_CERET || 'fallback_secret_for_test_demo';
        const options = { expiresIn: '1d' } as const;
        switch (type) {
            case 'sign_base':
                token = sign(
                    payload,
                    secret,
                    options
                )
                break;
            case 'sign_thread':
                token = await generateTokenInWorker(payload, secret, options);
                break;
            case 'sign_thread_poll':
                token = await piscina.run({ payload, secret, options });
                break;
            case 'big_data_sync':
                const start = Date.now();
                while (Date.now() - start < 200) {
                    // 在子线程里去死循环 200ms
                }
                break;
            case 'big_data_thread_poll':
                token = await piscina.run({ payload, secret, options });
                break;
            default:
                break;
        }
        const response = NextResponse.json({
            success: true,
            message: 'login success',
            shopInfo: {name: 'Test '}
        })

        response.cookies.set('auth_token', token, {
            // httpOnly: true,
            sameSite: 'strict',
            maxAge: 60*60*24, // 1day
            path: '/'
        })
        return response
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}