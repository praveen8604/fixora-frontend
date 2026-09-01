// // import axios from "axios";
// // import Cookies from "js-cookie";

// // // console.log("base url", import.meta.env.VITE_APP_API_BASE_URL);

// // const API_BASE =
// //   import.meta.env.VITE_APP_API_BASE_URL ||
// //   "https://fixora-backend-xi.vercel.app";

// // const instance = axios.create({
// //   baseURL: API_BASE,
// //   timeout: 50000,
// //   headers: {
// //     Accept: "application/json",
// //     "Content-Type": "application/json",
// //   },
// // });

// // // Add a request interceptor
// // instance.interceptors.request.use(function (config) {
// //   // Do something before request is sent

// //   let token;
// //   if (Cookies.get("token")) {
// //     token = JSON.parse(Cookies.get("token"));
// //   }

// //   let company;

// //   if (Cookies.get("company")) {
// //     company = Cookies.get("company");
// //   }

// //   const verificationToken = "@EServe-FmtnKgUrp5-3UlNmdKRbV";

// //   // console.log('Admin Http Services Cookie Read : ' + company);
// //   // let companyName = JSON.stringify(company);

// //   return {
// //     ...config,
// //     headers: {
// //       authorization: token ? token : null,
// //       company: company ? company : null,
// //       "x-verification-token": verificationToken,
// //       "fcm-token":
// //         "flwkEUHJCfr28Sdc6iTPQ-:APA91bFcR3xQjqtUWyDg_XQvQ--dB2Zsxd2DSIQtOpO-M9XXD11KJMw6s2d3e3p0qkfgfXN6nTLRmmE13y2DdCZOvn2A0gA-OoI0KRiymVzMYXj32yVNwRA",
// //     },
// //   };
// // });

// // const responseBody = (response) => response.data;

// // const requests = {
// //   get: (url, body, headers) =>
// //     instance.get(url, body, headers).then(responseBody),

// //   post: (url, body) => instance.post(url, body).then(responseBody),

// //   put: (url, body, headers) =>
// //     instance.put(url, body, headers).then(responseBody),

// //   patch: (url, body) => instance.patch(url, body).then(responseBody),

// //   delete: (url, body) => instance.delete(url, body).then(responseBody),
// // };

// // export default requests;
















// import axios from "axios";
// import Cookies from "js-cookie";

// const instance = axios.create({
//   baseURL: "http://localhost:8000",
//   timeout: 50000,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// });

// instance.interceptors.request.use((config) => {
//   console.log("========== API REQUEST ==========");
//   console.log("METHOD:", config.method);
//   console.log("URL:", `${config.baseURL}${config.url}`);
//   console.log("BODY:", config.data);
//   console.log("=================================");

//   let token;

//   if (Cookies.get("token")) {
//     try {
//       token = JSON.parse(Cookies.get("token"));
//     } catch {
//       token = Cookies.get("token");
//     }
//   }

//   return {
//     ...config,
//     headers: {
//       ...config.headers,
//       authorization: token || null,
//       "x-verification-token": "@EServe-FmtnKgUrp5-3UlNmdKRbV",
//       "fcm-token":
//         "flwkEUHJCfr28Sdc6iTPQ-:APA91bFcR3xQjqtUWyDg_XQvQ--dB2Zsxd2DSIQtOpO-M9XXD11KJMw6s2d3e3p0qkfgfXN6nTLRmmE13y2DdCZOvn2A0gA-OoI0KRiymVzMYXj32yVNwRA",
//     },
//   };
// });

// const responseBody = (response) => response.data;

// const requests = {
//   get: (url, body, headers) =>
//     instance.get(url, body, headers).then(responseBody),

//   post: (url, body) =>
//     instance.post(url, body).then(responseBody),

//   put: (url, body, headers) =>
//     instance.put(url, body, headers).then(responseBody),

//   patch: (url, body) =>
//     instance.patch(url, body).then(responseBody),

//   delete: (url, body) =>
//     instance.delete(url, body).then(responseBody),
// };

// export default requests;








import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 50000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  console.log("========== AUTH DEBUG ==========");
  console.log("Cookie token:", token);
  console.log("Authorization header:", token);
  console.log("================================");

  config.headers = {
    ...config.headers,
    authorization: token || "",
    "x-verification-token": "@EServe-FmtnKgUrp5-3UlNmdKRbV",
    "fcm-token": "YOUR_FCM_TOKEN",
  };

  return config;
});

const responseBody = (response) => response.data;

const requests = {
  get: (url, config) =>
    instance.get(url, config).then(responseBody),

  post: (url, body) =>
    instance.post(url, body).then(responseBody),

  put: (url, body, config) =>
    instance.put(url, body, config).then(responseBody),

  patch: (url, body) =>
    instance.patch(url, body).then(responseBody),

  delete: (url, config) =>
    instance.delete(url, config).then(responseBody),
};

export default requests;