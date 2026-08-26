import axios from "axios";
import Cookies from "js-cookie";

// console.log("base url", import.meta.env.VITE_APP_API_BASE_URL);

const API_BASE =
  import.meta.env.VITE_APP_API_BASE_URL ||
  "https://fixora-backend-xi.vercel.app";

const instance = axios.create({
  baseURL: API_BASE,
  timeout: 50000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent

  let token;
  if (Cookies.get("token")) {
    token = JSON.parse(Cookies.get("token"));
  }

  let company;

  if (Cookies.get("company")) {
    company = Cookies.get("company");
  }

  const verificationToken = "@EServe-FmtnKgUrp5-3UlNmdKRbV";

  // console.log('Admin Http Services Cookie Read : ' + company);
  // let companyName = JSON.stringify(company);

  return {
    ...config,
    headers: {
      authorization: token ? token : null,
      company: company ? company : null,
      "x-verification-token": verificationToken,
      "fcm-token":
        "flwkEUHJCfr28Sdc6iTPQ-:APA91bFcR3xQjqtUWyDg_XQvQ--dB2Zsxd2DSIQtOpO-M9XXD11KJMw6s2d3e3p0qkfgfXN6nTLRmmE13y2DdCZOvn2A0gA-OoI0KRiymVzMYXj32yVNwRA",
    },
  };
});

const responseBody = (response) => response.data;

const requests = {
  get: (url, body, headers) =>
    instance.get(url, body, headers).then(responseBody),

  post: (url, body) => instance.post(url, body).then(responseBody),

  put: (url, body, headers) =>
    instance.put(url, body, headers).then(responseBody),

  patch: (url, body) => instance.patch(url, body).then(responseBody),

  delete: (url, body) => instance.delete(url, body).then(responseBody),
};

export default requests;
