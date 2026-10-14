import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { Piscina } from 'piscina';
import { setTimeout as sleep } from 'node:timers/promises';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

type IOMode = 'timer' | 'file';

type IOTask = {
  mode: IOMode;
  delayMs: number;
  filePath: string;
};

type IOResult = {
  bytes: number;
};

// 初始化线程池
const piscina = new Piscina({
  filename: path.resolve(
    process.cwd(),
    'app/api/thread/io_work.js'
  ),
});

// 主线程处理异步 I/O
async function executeIO(task: IOTask): Promise<IOResult> {
  switch (task.mode) {
    case 'timer': {
      await sleep(task.delayMs);
      return { bytes: 0 };
    }

    case 'file': {
      const buffer = await readFile(task.filePath);
      return { bytes: buffer.length };
    }

    default:
      throw new Error('Unsupported I/O mode');
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (email !== 'test@gmail.com' || password !== '12345') {
      return NextResponse.json(
        { success: false, message: 'authenticate failed' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);

    const type = searchParams.get('type') || 'io_main';
    const modeParam = searchParams.get('mode') || 'timer';
    const mode: IOMode = modeParam === 'file' ? 'file' : 'timer';

    const task: IOTask = {
      mode,
      delayMs: 100,
      filePath: path.resolve(
        process.cwd(),
        'test-data/io-sample.bin'
      ),
    };

    const start = performance.now();

    let result: IOResult;

    switch (type) {
      case 'io_main':
        result = await executeIO(task);
        break;

      case 'io_pool':
        result = await piscina.run(task);
        break;

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid type' },
          { status: 400 }
        );
    }

    const duration = performance.now() - start;

    return NextResponse.json({
      success: true,
      type,
      mode,
      durationMs: Number(duration.toFixed(2)),
      bytes: result.bytes,
    });

  } catch (error) {
    console.error('I/O benchmark error:', error);

    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}