import requests from "./httpService";

const ServiceRequestServices = {
  createQuotation: async (body) => {
    return requests.post(`/eserve/v1/quotation`, body);
  },

  updateQuotation: async (body) => {
    return requests.put(`/eserve/v1/quotation`, body);
  },

  getQuotation: async (serviceRequestId) => {
    return requests.get(
      `/eserve/v1/quotation?serviceRequestId=${serviceRequestId}`
    );
  },

  getServiceCenterAddress: async () => {
    return requests.get(
      `/eserve/v1/addresses?serviceCenterAddress=true`
    );
  },

  createQuotationComment: async (body) => {
    return requests.put(`/eserve/v1/quotation/comment`, body);
  },
};

export default ServiceRequestServices;