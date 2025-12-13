import { SelectOption } from "@/components/hook-form/rhf-select";
import { getData } from "@/config/axios";
import { swrOption } from "@/utils/swr-option";
import { AllTruckingManagements, TruckingManagement } from "@monorepo/entities";
import {
  CreateOrUpdateTruckingSchema,
  TruckingSearchResult,
  TruckingSearchSchema,
} from "@monorepo/schemas";
import isEmpty from "lodash/isEmpty";
import { stringify } from "qs";
import { useMemo } from "react";
import useSWR from "swr";
import { Api } from ".";

export function useSearchTruckings(query: TruckingSearchSchema) {
  const swrKey = useMemo(() => ["/api/v1/trucking/search", query], [query]);

  const {
    data: trucking,
    isLoading,
    error,
    isValidating,
    mutate,
  } = useSWR<TruckingSearchResult>(
    swrKey,
    ([_, q]) => Api.truckingManagement.searchTruckings(q),
    swrOption,
  );

  const memoizedTruckings = useMemo(
    () => ({
      truckingsData: trucking?.datas || [],
      truckingsMeta: trucking?.meta,
      truckingsLoading: isLoading || isValidating,
      truckingsError: error,
      truckingsEmpty: (!isLoading || !isValidating) && isEmpty(trucking?.datas),
      truckingsMutate: mutate,
    }),
    [trucking, isLoading, error, isValidating, mutate],
  );

  return memoizedTruckings;
}

export function useTruckings() {
  const { data, isLoading, error, isValidating, mutate } = useSWR<
    AllTruckingManagements[]
  >("/api/v1/trucking/all", Api.truckingManagement.getAllTruckings, swrOption);

  const truckingsData = data || [];

  const truckingsField = truckingsData.map<SelectOption>((trucking) => ({
    label: trucking.truckPlateNumber,
    value: String(trucking.id),
  }));

  const memoizedTruckings = useMemo(
    () => ({
      truckingsData,
      truckingsField,
      truckingsLoading: isLoading || isValidating,
      truckingsError: error,
      truckingsEmpty: (!isLoading || !isValidating) && isEmpty(data),
      truckingsMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );

  return memoizedTruckings;
}

export default {
  async getAllTruckings(): Promise<AllTruckingManagements[]> {
    return getData<AllTruckingManagements[]>(
      await Api.client("/api/v1/trucking").get("/all"),
    );
  },
  async searchTruckings(data: TruckingSearchSchema) {
    const query = stringify(data, { skipNulls: true });

    return getData<TruckingSearchResult>(
      await Api.client("/api/v1/trucking/search").get(`?${query}`),
    );
  },
  async createTrucking(data: CreateOrUpdateTruckingSchema) {
    return getData<TruckingManagement>(
      await Api.client("/api/v1/trucking").post("", data),
    );
  },
  async updateTrucking(id: string, data: CreateOrUpdateTruckingSchema) {
    await Api.client("/api/v1/trucking").patch(`/${id}`, data);
  },
  async deleteTrucking(id: string) {
    await Api.client("/api/v1/trucking").delete(`/${id}`);
  },
};
