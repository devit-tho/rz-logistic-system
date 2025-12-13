import { STORAGE_KEY } from "@/stores/auth";
import axios, { AxiosError, AxiosInstance } from "axios";
import broker from "./broker";
import cargo from "./cargo";
import customer from "./customer";
import driver from "./driver";
import shipment from "./shipment";
import shippingLine from "./shipping-line";
import supplier from "./supplier";
import truckingManagement from "./trucking-management";
import user from "./user";

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message?: string,
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const Api = {
  client(path = "", requireToken = true): AxiosInstance {
    const token = localStorage.getItem(STORAGE_KEY) || null;
    const baseURL = process.env.ADMIN_API;

    if (requireToken && !token) {
      throw new Error("Unauthorized Request");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const instance = axios.create({
      baseURL: `${baseURL}${path}`,
      headers,
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error instanceof AxiosError) {
          if (
            typeof error.response?.data?.message === "string" &&
            !!error.response?.data.statusCode
          ) {
            return Promise.reject(
              new ApiError(
                error.response?.data.statusCode,
                error.response.data.message,
              ),
            );
          }
          return Promise.reject(new Error("Unhandled API error"));
        }
        return Promise.reject(error);
      },
    );

    return instance;
  },
  shipment,
  user,
  broker,
  customer,
  supplier,
  truckingManagement,
  cargo,
  shippingLine,
  driver,
};

export { useBrokers, useSearchBrokers } from "./broker";

export { useCustomers, useSearchCustomers } from "./customer";

export { useCargos, useSearchCargos } from "./cargo";

export {
  useSearchShipments,
  useShipmentReports,
  useShipments,
} from "./shipment";

export { useSearchSuppliers, useSuppliers } from "./supplier";

export { useSearchShippingLines, useShippingLines } from "./shipping-line";

export { useSearchTruckings } from "./trucking-management";

export { useSearchUsers } from "./user";

export { useDrivers, useSearchDrivers } from "./driver";
