import { SelectOption } from "@/components/hook-form/rhf-select";
import { getData } from "@/config/axios";
import { swrOption } from "@/utils/swr-option";
import { AllCustomers, Customer } from "@monorepo/entities";
import {
  CreateOrUpdateCustomerSchema,
  CustomerSearchResult,
  CustomerSearchSchema,
} from "@monorepo/schemas";
import isEmpty from "lodash/isEmpty";
import { stringify } from "qs";
import { useMemo } from "react";
import useSWR from "swr";
import { Api } from ".";

export function useSearchCustomers(query: CustomerSearchSchema) {
  const swrKey = useMemo(() => ["/api/v1/customer/search", query], [query]);

  const {
    data: customer,
    isLoading,
    error,
    isValidating,
    mutate,
  } = useSWR<CustomerSearchResult>(
    swrKey,
    ([_, q]) => Api.customer.searchCustomers(q),
    swrOption,
  );

  const memoizedCustomers = useMemo(
    () => ({
      customersData: customer?.datas || [],
      customersMeta: customer?.meta,
      customersLoading: isLoading || isValidating,
      customersError: error,
      customersEmpty: (!isLoading || !isValidating) && isEmpty(customer?.datas),
      customersMutate: mutate,
    }),
    [customer, isLoading, error, isValidating, mutate],
  );

  return memoizedCustomers;
}

export function useCustomers() {
  const { data, isLoading, error, mutate } = useSWR<AllCustomers[]>(
    "/api/v1/customer/all",
    Api.customer.getAllCustomers,
    swrOption,
  );

  const customersData = data || [];

  const customersField = customersData.map<SelectOption>((customer) => ({
    label: customer.organization,
    value: String(customer.id),
  }));

  const memoizedCustomers = useMemo(
    () => ({
      customersData,
      customersField,
      customersLoading: isLoading,
      customersError: error,
      customersEmpty: !data?.length && !isLoading,
      customersMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );

  return memoizedCustomers;
}

export default {
  async getAllCustomers(): Promise<AllCustomers[]> {
    return getData<AllCustomers[]>(
      await Api.client("/api/v1/customer").get("/all"),
    );
  },

  async searchCustomers(data: CustomerSearchSchema) {
    const query = stringify(data, { skipNulls: true });

    return getData<CustomerSearchResult>(
      await Api.client("/api/v1/customer/search").get(`?${query}`),
    );
  },

  async createCustomer(data: CreateOrUpdateCustomerSchema) {
    return getData<Customer>(
      await Api.client("/api/v1/customer").post("", data),
    );
  },

  async updateCustomer(id: string, data: CreateOrUpdateCustomerSchema) {
    await Api.client("/api/v1/customer").patch(`/${id}`, data);
  },

  async deleteCustomer(id: string) {
    await Api.client("/api/v1/customer").delete(`/${id}`);
  },
};
