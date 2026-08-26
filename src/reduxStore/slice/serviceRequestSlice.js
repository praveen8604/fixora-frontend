import { createSlice } from "@reduxjs/toolkit";

export const serviceRequestSlice = createSlice({
  name: "serviceRequest",
  initialState: {
    loading: false,
    serviceRequests: [],
    serviceRequest: {},
    userList: [],
    totalPages: 0,
    message: null,
    status: null,
  },
  reducers: {
    serviceRequestsRequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    serviceRequestsSuccess(state, action) {
      return {
        ...state,
        loading: false,
        serviceRequests: action.payload.data?.serviceRequests,
        userList: action.payload.data?.userList,
        totalPages: action.payload.data?.totalPages,
        message: action.payload?.message,
        status: "success",
      };
    },
    serviceRequestsFail(state, action) {
      return {
        ...state,
        loading: false,
        message: action.payload?.message,
        status: "fail",
      };
    },
    serviceRequestRequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    serviceRequestSuccess(state, action) {
      return {
        ...state,
        loading: false,
        serviceRequest: action.payload.data?.serviceRequest,
        message: action.payload?.message,
        status: "success",
      };
    },
    serviceRequestFail(state, action) {
      return {
        ...state,
        loading: false,
        message: action.payload?.message,
        status: "fail",
      };
    },
    clearServiceRequest(state) {
      return {
        ...state,
        loading: false,
        serviceRequests: [],
        serviceRequest: {},
        userList: [],
        totalPages: 0,
        message: null,
        status: null,
      };
    },
  },
});

const { actions, reducer } = serviceRequestSlice;

export const {
  serviceRequestsRequest,
  serviceRequestsFail,
  serviceRequestsSuccess,
  serviceRequestRequest,
  serviceRequestFail,
  serviceRequestSuccess,
  clearServiceRequest,
} = actions;

export default reducer;
