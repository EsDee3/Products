import { sleep } from "k6";
import http from "k6/http";
const url = 'http://localhost:7763';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 100,
      maxVUs: 200
    }
  }
  // stages: [
  //   { duration: "10s", target: 100 },
  //   { duration: "30s", target: 3000 },
  //   { duration: "1m", target: 6000 },
  //   { duration: "1.5m", target: 6500 },
  //   { duration: "45s", target: 5000 },
  //   { duration: "30s", target: 1000 },
  //   { duration: "10s", target: 0 },
  // ]
  // vus: 150,
  // iterations: 20000,
};

export default function main() {
  let response;

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  response = http.get(`${url}/123456`);

  // Automatically added sleep
  // sleep(1);
}