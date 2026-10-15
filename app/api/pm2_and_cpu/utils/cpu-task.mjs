
import { createHash } from "node:crypto";

const payload = Buffer.alloc(4096, 0x61);

export default function cpuTask({ iterations = 10000 }) {
  const start = performance.now();
  let digest;

  for (let i = 0; i < iterations; i++) {
    digest = createHash("sha256")
      .update(payload)
      .digest();
  }

  return {
    success: true,
    iterations,
    durationMs: performance.now() - start,
    checksum: digest.toString("hex").slice(0, 8),
  };
}
