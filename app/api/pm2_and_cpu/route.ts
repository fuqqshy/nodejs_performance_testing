
import { NextResponse } from "next/server";
import { pool } from "./bench-pool";

import 'server-only'

export async function POST() {
  try {
    const result = await pool.run({
      iterations: Number(
        process.env.CPU_ITERATIONS ?? 10000
      ),
    });

    return NextResponse.json({
      ...result,
      pid: process.pid,
    });
  } catch {
    return NextResponse.json(
      { error: "Task failed" },
      { status: 500 }
    );
  }
}
