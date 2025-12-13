import { SelectOption } from "@/components/hook-form/rhf-select";
import { getData } from "@/config/axios";
import { swrOption } from "@/utils/swr-option";
import { AllCargos, Cargo } from "@monorepo/entities";
import {
  CargoSearchResult,
  CargoSearchSchema,
  CreateOrUpdateCargoSchema,
} from "@monorepo/schemas";
import isEmpty from "lodash/isEmpty";
import { stringify } from "qs";
import { useMemo } from "react";
import useSWR from "swr";
import { Api } from ".";

export function useSearchCargos(query: CargoSearchSchema) {
  const swrKey = useMemo(() => ["/api/v1/cargo/search", query], [query]);

  const {
    data: cargo,
    isLoading,
    error,
    isValidating,
    mutate,
  } = useSWR<CargoSearchResult>(
    swrKey,
    ([_, q]) => Api.cargo.searchCargos(q),
    swrOption,
  );

  const memoizedCargos = useMemo(
    () => ({
      cargosData: cargo?.datas || [],
      cargosMeta: cargo?.meta,
      cargosLoading: isLoading || isValidating,
      cargosError: error,
      cargosEmpty: (!isLoading || !isValidating) && isEmpty(cargo?.datas),
      cargosMutate: mutate,
    }),
    [cargo, isLoading, error, isValidating, mutate],
  );

  return memoizedCargos;
}

export function useCargos() {
  const { data, isLoading, error, isValidating, mutate } = useSWR<AllCargos[]>(
    "/api/v1/cargo/all",
    Api.cargo.getAllCargos,
  );

  const cargosData = data || [];

  const cargosField = cargosData.map<SelectOption>((cargo) => ({
    label: cargo.name,
    value: String(cargo.id),
  }));

  const memoizedCargos = useMemo(
    () => ({
      cargosData,
      cargosField,
      cargosLoading: isLoading || isValidating,
      cargosError: error,
      cargosEmpty: (!isLoading || !isValidating) && isEmpty(data),
      cargosMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );

  return memoizedCargos;
}

export default {
  async getAllCargos(): Promise<AllCargos[]> {
    return getData<AllCargos[]>(await Api.client("/api/v1/cargo").get("/all"));
  },

  async searchCargos(data: CargoSearchSchema) {
    const query = stringify(data, { skipNulls: true });

    return getData<CargoSearchResult>(
      await Api.client("/api/v1/cargo/search").get(`?${query}`),
    );
  },

  async createCargo(data: CreateOrUpdateCargoSchema) {
    return getData<Cargo>(await Api.client("/api/v1/cargo").post("", data));
  },

  async updateCargo(id: string, data: CreateOrUpdateCargoSchema) {
    await Api.client("/api/v1/cargo").patch(`/${id}`, data);
  },

  async deleteCargo(id: string) {
    await Api.client("/api/v1/cargo").delete(`/${id}`);
  },
};
