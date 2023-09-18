import http from 'k6/http';
import { check, sleep } from "k6";

const isNumeric = (value) => /^\d+$/.test(value);

const default_vus = 10000;

const target_vus_env = `${__ENV.TARGET_VUS}`;
const target_vus = isNumeric(target_vus_env) ? Number(target_vus_env) : default_vus;

export let options = {
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


export default function () {
  const response = http.get("http://docker.for.mac.host.internal:8082/webhook/");
  check(response, { "status is 200": (r) => r.status === 200 });
  sleep(.300);
};
