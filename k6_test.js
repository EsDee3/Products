import { sleep } from "k6";
import http from "k6/http";
const url = 'http://localhost:33212/';

export const options = {
  stages: [
    { duration: "1m", target: 1000 },
    { duration: "3m", target: 1000 },
    { duration: "1m", target: 0 },
  ],
  ext: {
    loadimpact: {
      distribution: {
        "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 },
      },
    },
  },
};

export default function main() {
  let response;

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  response = http.get(`${url}product?pid=${getRandomInt(1, 500)}`);

  // Automatically added sleep
  sleep(1);
}