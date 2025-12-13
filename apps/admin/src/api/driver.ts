import { SelectOption } from "@/components/hook-form/rhf-select";
import { getData } from "@/config/axios";
import { swrOption } from "@/utils/swr-option";
import { AllDrivers, Driver } from "@monorepo/entities";
import {
  CreateOrUpdateDriverSchema,
  DriverSearchResult,
  DriverSearchSchema,
} from "@monorepo/schemas";
import isEmpty from "lodash/isEmpty";
import { stringify } from "qs";
import { useMemo } from "react";
import useSWR from "swr";
import { Api } from ".";

export function useSearchDrivers(query: DriverSearchSchema) {
  const swrKey = useMemo(() => ["/api/v1/driver/search", query], [query]);

  const {
    data: driver,
    isLoading,
    error,
    isValidating,
    mutate,
  } = useSWR<DriverSearchResult>(
    swrKey,
    ([_, q]) => Api.driver.searchdrivers(q),
    swrOption,
  );

  const memoizeddrivers = useMemo(
    () => ({
      driversData: driver?.datas || [],
      driversMeta: driver?.meta,
      driversLoading: isLoading || isValidating,
      driversError: error,
      driversEmpty: (!isLoading || !isValidating) && isEmpty(driver?.datas),
      driversMutate: mutate,
    }),
    [driver, isLoading, error, isValidating, mutate],
  );

  return memoizeddrivers;
}

export function useDrivers() {
  const { data, isLoading, error, mutate } = useSWR<AllDrivers[]>(
    "/api/v1/driver/all",
    Api.driver.getAllDrivers,
    swrOption,
  );

  const driversData = data || [];

  const driversField = driversData.map<SelectOption>((driver) => ({
    label: driver.name,
    value: String(driver.id),
  }));

  const memoizedDrivers = useMemo(
    () => ({
      driversData,
      driversField,
      driversLoading: isLoading,
      driversError: error,
      driversEmpty: !data?.length && !isLoading,
      driversMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );

  return memoizedDrivers;
}

export default {
  async getAllDrivers(): Promise<AllDrivers[]> {
    return getData<AllDrivers[]>(
      await Api.client("/api/v1/driver").get("/all"),
    );
  },

  async searchdrivers(data: DriverSearchSchema) {
    const query = stringify(data, { skipNulls: true });

    return getData<DriverSearchResult>(
      await Api.client("/api/v1/driver/search").get(`?${query}`),
    );
  },

  async createdriver(data: CreateOrUpdateDriverSchema) {
    return getData<Driver>(await Api.client("/api/v1/driver").post("", data));
  },

  async updatedriver(id: string, data: CreateOrUpdateDriverSchema) {
    await Api.client("/api/v1/driver").patch(`/${id}`, data);
  },

  async deletedriver(id: string) {
    await Api.client("/api/v1/driver").delete(`/${id}`);
  },
};
