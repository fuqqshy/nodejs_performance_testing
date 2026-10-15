
import http from "k6/http";
import { check } from "k6";

const rate = Number(__ENV.RATE || 150);
const duration = __ENV.DURATION || "60s";

export const options = {
  scenarios: {
    cpu_load: {
      executor: "constant-arrival-rate",
      rate,
      timeUnit: "1s",
      duration,
      preAllocatedVUs: 500,
      gracefulStop: "30s",
    },
  },
  thresholds: {
    http_req_duration: [
      "p(95)<1000",
      "p(99)<2000",
    ],
    http_req_failed: ["rate<0.001"],
    dropped_iterations: ["count==0"],
  },
};

export default function () {
  const response = http.post(
    "http://[::1]:3000/api/pm2_and_cpu",
    null,
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: "15s",
    }
  );

  check(response, {
    "HTTP 200": (r) => r.status === 200,
  });
}
