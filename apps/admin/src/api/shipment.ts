import { SelectOption } from "@/components/hook-form/rhf-select";
import { getData } from "@/config/axios";
import { swrOption } from "@/utils/swr-option";
import { AllShipments, ReportShipments, Shipment } from "@monorepo/entities";
import {
  CreateOrUpdateShipmentSchema,
  ShipmentSearchResult,
  ShipmentSearchSchema,
} from "@monorepo/schemas";
import isEmpty from "lodash/isEmpty";
import { stringify } from "qs";
import { useMemo } from "react";
import useSWR from "swr";
import { Api } from ".";

export function useSearchShipments(query: ShipmentSearchSchema) {
  const swrKey = useMemo(() => ["/api/v1/shipment/search", query], [query]);

  const {
    data: shipment,
    isLoading,
    error,
    isValidating,
    mutate,
  } = useSWR<ShipmentSearchResult>(
    swrKey,
    ([_, q]) => Api.shipment.searchShipments(q),
    swrOption,
  );

  const memoizedShipment = useMemo(
    () => ({
      shipmentsData: shipment?.datas || [],
      shipmentsMeta: shipment?.meta,
      shipmentsLoading: isLoading || isValidating,
      shipmentsError: error,
      shipmentsEmpty: (!isLoading || !isValidating) && isEmpty(shipment?.datas),
      shipmentsMutate: mutate,
    }),
    [shipment, isLoading, error, isValidating, mutate],
  );

  return memoizedShipment;
}

export function useShipments() {
  const { data, isLoading, error, isValidating, mutate } = useSWR<
    AllShipments[]
  >("/api/v1/shipment/all", Api.shipment.getAllShipments);

  const shipmentsData = data || [];

  const shipmentsField = shipmentsData.map<SelectOption>((shipment) => ({
    label: shipment.name,
    value: String(shipment.id),
  }));

  const memoizedShipments = useMemo(
    () => ({
      shipmentsData,
      shipmentsField,
      shipmentsLoading: isLoading || isValidating,
      shipmentsError: error,
      shipmentsEmpty: (!isLoading || !isValidating) && isEmpty(data),
      shipmentsMutate: mutate,
    }),
    [data, isLoading, error, isValidating, mutate],
  );

  return memoizedShipments;
}

export function useShipmentReports(data: "month" | "3-month" | "year") {
  const swrKey = useMemo(() => ["/api/v1/shipment/report", data], [data]);

  const {
    data: shipment,
    isLoading,
    error,
    isValidating,
    mutate,
  } = useSWR<ReportShipments>(swrKey, () => Api.shipment.getReports(data));

  const memoizedShipments = useMemo(
    () => ({
      reportsData: shipment?.shipments || [],
      reportsTotal: shipment?.total,
      reportsLoading: isLoading || isValidating,
      reportsError: error,
      reportsEmpty:
        (!isLoading || !isValidating) && isEmpty(shipment?.shipments),
      reportsMutate: mutate,
    }),
    [shipment, isLoading, error, isValidating, mutate],
  );

  return memoizedShipments;
}

export default {
  async getAllShipments(): Promise<AllShipments[]> {
    return getData<AllShipments[]>(
      await Api.client("/api/v1/shipment").get("/all"),
    );
  },

  async getReports(data: "month" | "3-month" | "year") {
    return getData<ReportShipments>(
      await Api.client("/api/v1/shipment").post("/report", {
        select: data,
      }),
    );
  },

  async searchShipments(
    data: ShipmentSearchSchema,
  ): Promise<ShipmentSearchResult> {
    const query = stringify(data, { skipNulls: true });

    return getData<ShipmentSearchResult>(
      await Api.client("/api/v1/shipment/search").get(`?${query}`),
    );
  },

  async createShipment(data: CreateOrUpdateShipmentSchema) {
    return getData<Shipment>(
      await Api.client("/api/v1/shipment").post("", data),
    );
  },

  async updateShipment(id: string, data: CreateOrUpdateShipmentSchema) {
    await Api.client("/api/v1/shipment").put(`/${id}`, data);
  },

  async deleteShipment(id: string) {
    await Api.client("/api/v1/shipment").delete(`/${id}`);
  },
};
