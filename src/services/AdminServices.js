import requests from "./httpService";

const AdminServices = {
  registerAdmin: async (body) => {
    return requests.post("/admin/register", body);
  },
  loginOTPAdmin: async (body) => {
    return requests.post(`/eserve/v1/otp/send`, body);
  },
  verifyOTP: async (body) => {
    return requests.post(`/eserve/v1/otp/verify`, body);
  },
  loginAdmin: async (body) => {
    return requests.post(`/eserve/v1/login`, body);
  },
  getUser: async (userId) => {
    return requests.get(`/eserve/v1/user?userId=${userId}`);
  },
  deleteUser: async (userId) => {
    return requests.delete(`/eserve/v1/user?userId=${userId}`);
  },
  updateUserStatus: async (body) => {
    return requests.put(`/eserve/v1/user/status?userId`, body);
  },
  getOffers: async (body) => {
    return requests.get(`/eserve/v1/offers?page=1&limit=10`, body);
  },
  getBlogs: async (body) => {
    return requests.get(`/eserve/v1/blogs?page=1&limit=10`, body);
  },
  // forgetPassword: async (body) => {
  //   return requests.put("/admin/forget-password", body);
  // },

  // resetPassword: async (body) => {
  //   return requests.put("/admin/reset-password", body);
  // },

  // signUpWithProvider: async (body) => {
  //   return requests.post("/admin/signup", body);
  // },

  // addStaff: async (body) => {
  //   return requests.post("/admin/add", body);
  // },
  // getAllStaff: async (body) => {
  //   return requests.get("/admin", body);
  // },
  // getStaffById: async (id, body) => {
  //   return requests.post(`/admin/${id}`, body);
  // },

  // updateStaff: async (id, body) => {
  //   return requests.put(`/admin/${id}`, body);
  // },

  // updateStaffStatus: async (id, body) => {
  //   return requests.put(`/admin/update-status/${id}`, body);
  // },

  // deleteStaff: async (id) => {
  //   return requests.delete(`/admin/${id}`);
  // },
  assignRider: async (data) => {
    return requests.put("/eserve/v1/rider/assign", data);
  },
  assignServiceAddress: async (data) => {
    return requests.put("/eserve/v1/servicerequest/address/assign", data);
  },
  assignTechnician: async (data) => {
    return requests.put("/eserve/v1/technician/assign", data);
  },
  createOffer: async (data) => {
    return requests.post("/eserve/v1/offer", data);
  },
  updateOffer: async (data) => {
    return requests.put("/eserve/v1/offer", data);
  },
  createBlog: async (data) => {
    return requests.post("/eserve/v1/blog", data);
  },
  deleteOffer: async (offerId) => {
    return requests.delete(`/eserve/v1/offer?offerId=${offerId}`);
  },
  deleteBlog: async (blogId) => {
    return requests.delete(`/eserve/v1/blog?blogId=${blogId}`);
  },
  updateBlog: async (data) => {
    return requests.put("/eserve/v1/blog", data);
  },
  getZones: async () => {
    return requests.get("/eserve/v1/addresses?serviceCenterAddress=true");
  },
  createZone: async (data) => {
    return requests.post("/eserve/v1/address", data);
  },
  createAppliance: async (data) => {
    return requests.post("/eserve/v1/appliance/common", data);
  },
  createBrand: async (data) => {
    return requests.post("/eserve/v1/brand/common", data);
  },
  createModel: async (data) => {
    return requests.post("/eserve/v1/model/common", data);
  },
};

export default AdminServices;
