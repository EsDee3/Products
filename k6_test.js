import { sleep, group, check } from "k6";
import http from "k6/http";
const url = 'http://localhost:7763';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000']
  },
  // scenarios: {
  //   constant_request_rate: {
  //     executor: 'constant-arrival-rate',
  //     rate: 1000,
  //     timeUnit: '1s',
  //     duration: '15s',
  //     preAllocatedVUs: 1000,
  //     maxVUs: 2000
  //   }
  // }
  stages: [
    { duration: "10s", target: 50 },
    { duration: "2m", target: 50 }
  ],
  // vus: 150,
  // iterations: 20000,
  ext: {
    loadimpact: {
      distribution: {
        "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 },
      },
    },
  },
};

export default function main() {

  group('grab from postgres', () => {
    const pg = http.get(`${url}/pg/12345`);
    check(pg, {
      'is status 200': (r) => r.status === 200,
    })
    const mg = http.get(`${url}/mg/12345`);
    check(mg, {
      'is status 200': (r) => r.status === 200,
    })
    const np = http.get(`${url}/np/12345`);
    check(np, {
      'is status 200': (r) => r.status === 200,
    })
  })
}




//   let response;

//   function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min) + min);
//   }

//   response = http.get(`/pg/${url}/123456`);
//   response = http.get(`/mg/${url}/123456`);
//   response = http.get(`/np/${url}/123456`);

//   // Automatically added sleep
//   // sleep(1);
// }