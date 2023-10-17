import http from 'k6/http';
import { check, sleep } from "k6";

const isNumeric = (value) => /^\d+$/.test(value);

const default_vus = 10000;

const target_vus_env = `${__ENV.TARGET_VUS}`;
const target_vus = isNumeric(target_vus_env) ? Number(target_vus_env) : default_vus;

export let options1 = {
  stages: [
      // Ramp-up from 1 to TARGET_VUS virtual users (VUs) in 5s
      { duration: "1s", target: target_vus },

      // Stay at rest on TARGET_VUS VUs for 10s
      { duration: "1s", target: target_vus },

      // Ramp-down from TARGET_VUS to 0 VUs for 5s
      { duration: "1s", target: 0 }
  ]
};

// export default function () {
//   const response = http.get("https://localhost:8082", {headers: {Accepts: "application/json"}});
//   check(response, { "status is 200": (r) => r.status === 200 });
//   sleep(.300);
// };

export const options = {

  scenarios: {
    basic: {
      executor: 'ramping-vus',
      startTime: '0s',
      gracefulStop: '1s',
      gracefulRampDown: '0s',
      stages: [
        { duration: '10s', target: 40 },
      ]
    },
    high_load: {
      executor: 'ramping-vus',
      startTime: '11s',
      gracefulStop: '1s',
      gracefulRampDown: '0s',
      stages: [
        { duration: '10s', target: 200 },
      ]
    },
    spike: {
      executor: 'ramping-vus',
      startTime: '22s',
      gracefulStop: '1s',
      gracefulRampDown: '0s',
      stages: [
        { duration: '10s', target: 5000 },
      ]
    }
  },

  thresholds: {
    http_req_failed: ['rate < 0.01'],
    http_req_duration: ['p(90) < 100', 'p(95) < 200', 'p(99) < 500'],
  },

  noConnectionReuse: true,

  userAgent: 'MyK6UserAgentString/1.0',

};

//Test Springboot App
// export default function () {
//   const response = http.get("http://docker.for.mac.host.internal:8082/webhook/");
//   check(response, 
//     { "status is 200": (r) => r.status === 200,
//      "text verification" : (r) => r.body.includes("Hello World This is poshak") }
//     );
//   sleep(.300);
// };


//Test Fast API Fulfillment Application
export default function () {
  const response = http.get("http://docker.for.mac.host.internal:5050/");
  check(response, 
    { "status is 200": (r) => r.status === 200,
     "text verification" : (r) => r.body.includes("Hello Poshak Jaiswal this is a test ") }
    );
  sleep(.300);
}; 