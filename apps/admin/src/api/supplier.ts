import { SelectOption } from "@/components/hook-form/rhf-select";
import { getData } from "@/config/axios";
import { swrOption } from "@/utils/swr-option";
import { AllSuppliers, Supplier } from "@monorepo/entities";
import {
  CreateOrUpdateSupplierSchema,
  SupplierSearchResult,
  SupplierSearchSchema,
} from "@monorepo/schemas";
import isEmpty from "lodash/isEmpty";
import { stringify } from "qs";
import { useMemo } from "react";
import useSWR from "swr";
import { Api } from ".";

export function useSearchSuppliers(query: SupplierSearchSchema) {
  const swrKey = useMemo(() => ["/api/v1/supplier/search", query], [query]);

  const { data, isLoading, error, isValidating, mutate } =
    useSWR<SupplierSearchResult>(
      swrKey,
      ([_, q]) => Api.supplier.searchSuppliers(q),
      swrOption,
    );

  const memoizedSuppliers = useMemo(
    () => ({
      suppliersData: data?.datas || [],
      suppliersMeta: data?.meta,
      suppliersLoading: isLoading || isValidating,
      suppliersError: error,
      suppliersEmpty: (!isLoading || !isValidating) && isEmpty(data?.datas),
      suppliersMutate: mutate,
    }),
    [data, isLoading, error, isValidating, mutate],
  );

  return memoizedSuppliers;
}

export function useSuppliers() {
  const { data, isLoading, error, isValidating, mutate } = useSWR<
    AllSuppliers[]
  >("/api/v1/supplier/all", Api.supplier.getAllSuppliers);

  const suppliersData = data || [];

  const suppliersField = suppliersData.map<SelectOption>((supplier) => ({
    label: supplier.organization,
    value: String(supplier.id),
  }));

  const memoizedSuppliers = useMemo(
    () => ({
      suppliersData,
      suppliersField,
      suppliersLoading: isLoading || isValidating,
      suppliersError: error,
      suppliersEmpty: (!isLoading || !isValidating) && isEmpty(data),
      suppliersMutate: mutate,
    }),
    [data, isLoading, error, isValidating, mutate],
  );

  return memoizedSuppliers;
}

export default {
  async getAllSuppliers(): Promise<AllSuppliers[]> {
    return getData<AllSuppliers[]>(
      await Api.client("/api/v1/supplier").get("/all"),
    );
  },

  async searchSuppliers(
    data: SupplierSearchSchema,
  ): Promise<SupplierSearchResult> {
    const query = stringify(data, { skipNulls: true });

    return getData<SupplierSearchResult>(
      await Api.client("/api/v1/supplier/search").get(`?${query}`),
    );
  },

  async createSupplier(data: CreateOrUpdateSupplierSchema) {
    return getData<Supplier>(
      await Api.client("/api/v1/supplier").post("", data),
    );
  },

  async updateSupplier(id: string, data: CreateOrUpdateSupplierSchema) {
    await Api.client("/api/v1/supplier").patch(`/${id}`, data);
  },

  async deleteSupplier(id: string) {
    await Api.client("/api/v1/supplier").delete(`/${id}`);
  },
};
