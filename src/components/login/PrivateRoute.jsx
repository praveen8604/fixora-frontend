// import React, { useContext } from "react";
// import { Redirect, Route } from "react-router-dom";
// import { AdminContext } from "@/context/AdminContext";

// const PrivateRoute = ({ children, ...rest }) => {
//   const { state } = useContext(AdminContext);
//   const { adminInfo } = state;
//   console.log("debugging-adminInfo: ", adminInfo);
//   return (
//     <Route
//       {...rest}
//       render={({ location }) =>
//         adminInfo?.email ? (
//           children
//         ) : (
//           <Redirect
//             to={{
//               pathname: "/login",
//               state: { from: location },
//             }}
//           />
//         )
//       }
//     />
//   );
// };

// export default PrivateRoute;
import React from "react";
import { Route } from "react-router-dom";

const PrivateRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        children
      }
    />
  );
};

export default PrivateRoute;