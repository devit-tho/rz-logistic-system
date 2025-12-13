import { SelectOption } from "@/components/hook-form/rhf-select";
import { getData } from "@/config/axios";
import { swrOption } from "@/utils/swr-option";
import { AllBrokers, Broker } from "@monorepo/entities";
import {
  BrokerSearchResult,
  BrokerSearchSchema,
  CreateOrUpdateBrokerSchema,
} from "@monorepo/schemas";
import isEmpty from "lodash/isEmpty";
import { stringify } from "qs";
import { useMemo } from "react";
import useSWR from "swr";
import { Api } from ".";

export function useSearchBrokers(query: BrokerSearchSchema) {
  const swrKey = useMemo(() => ["/api/v1/broker/search", query], [query]);

  const {
    data: broker,
    isLoading,
    error,
    isValidating,
    mutate,
  } = useSWR<BrokerSearchResult>(
    swrKey,
    ([_, q]) => Api.broker.searchBrokers(q),
    swrOption,
  );

  const memoizedBrokers = useMemo(
    () => ({
      brokersData: broker?.datas || [],
      brokersMeta: broker?.meta,
      brokersLoading: isLoading || isValidating,
      brokersError: error,
      brokersEmpty: (!isLoading || !isValidating) && isEmpty(broker?.datas),
      brokersMutate: mutate,
    }),
    [broker, isLoading, error, isValidating, mutate],
  );

  return memoizedBrokers;
}

export function useBrokers() {
  const { data, isLoading, error, isValidating, mutate } = useSWR<AllBrokers[]>(
    "/api/v1/broker/all",
    Api.broker.getAllBrokers,
  );

  const brokersData = data || [];

  const brokersField = brokersData.map<SelectOption>((broker) => ({
    label: broker.name,
    value: String(broker.id),
  }));

  const memoizedBrokers = useMemo(
    () => ({
      brokersData,
      brokersField,
      brokersLoading: isLoading || isValidating,
      brokersError: error,
      brokersEmpty: (!isLoading || !isValidating) && isEmpty(data),
      brokersMutate: mutate,
    }),
    [data, isLoading, error, isValidating, mutate],
  );

  return memoizedBrokers;
}

export default {
  async getAllBrokers(): Promise<AllBrokers[]> {
    return getData<AllBrokers[]>(
      await Api.client("/api/v1/broker").get("/all"),
    );
  },
  async searchBrokers(data: BrokerSearchSchema) {
    const query = stringify(data, { skipNulls: true });

    return getData<BrokerSearchResult>(
      await Api.client("/api/v1/broker/search").get(`?${query}`),
    );
  },

  async createBroker(data: CreateOrUpdateBrokerSchema) {
    return getData<Broker>(await Api.client("/api/v1/broker").post("", data));
  },

  async updateBroker(id: string, data: CreateOrUpdateBrokerSchema) {
    await Api.client("/api/v1/broker").patch(`/${id}`, data);
  },

  async deleteBroker(id: string) {
    await Api.client("/api/v1/broker").delete(`/${id}`);
  },
};
