import requests from "./httpService";

const DashboardServices = {
  getAllDashData: async (body) => {
  return requests.get(`/eserve/v1/dashboard/admin`, body);
},
  getDashboardData: async (body) => {
  return requests.get(`/eserve/v1/dashboard/admin`, body);
},
  getPaymentLogs: async (page, limit) => {
    return requests.get(`/eserve/v1/payments?page=${page}&limit=${limit}`);
  },
  getAllUsers: async (page, limit) => {
    return requests.get(`/eserve/v1/users?page=${page}&limit=${limit}`);
  },
  getTechnicians: async (page, limit) => {
    return requests.get(`/eserve/v1/technicians?page=${page}&limit=${limit}`);
  },
  getRiders: async (page, limit) => {
    return requests.get(`/eserve/v1/riders?page=${page}&limit=${limit}`);
  },
  getCustomers: async (page, limit) => {
    return requests.get(`/eserve/v1/customers?page=${page}&limit=${limit}`);
  },
  approve: async (body) => {
    return requests.put("/eserve/v1/approve/user", body);
  },
  practicingStatusUpdate: async (body) => {
    return requests.put("/eserve/v1/practicing/status", body);
  },
  getappliance: async (page, limit) => {
    return requests.get(
      `/eserve/v1/appliance/admin?page=${page}&limit=${limit}`
    );
  },
  getMappedAppliance: async () => {
    return requests.get(`/eserve/v1/appliance/mapped`);
  },

  Createappliance: async (body) => {
    return requests.post(`/eserve/v1/appliance`, body);
  },

  getBrand: async (body) => {
    return requests.get(`/eserve/v1/brand?applianceId=${body}`);
  },
  getMappedAppliance: async (body) => {
    return requests.get(`/eserve/v1/appliance/mapped`, body);
  },
  getAdminMappedAppliance: async (body) => {
    return requests.get(`/eserve/v1/appliance/admin?page=1&limit=100000`, body);
  },
  CreateBrand: async (body) => {
    return requests.post(`/eserve/v1/brand`, body);
  },
  CreateModel: async (body) => {
    return requests.post(`/eserve/v1/model`, body);
  },
  CreateRepair: async (body) => {
    return requests.post(`/eserve/v1/repair`, body);
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
};

export default DashboardServices;
