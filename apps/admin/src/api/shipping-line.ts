import { SelectOption } from "@/components/hook-form/rhf-select";
import { getData } from "@/config/axios";
import { swrOption } from "@/utils/swr-option";
import { AllShippingLines, ShippingLine } from "@monorepo/entities";
import {
  CreateOrUpdateShippingLineSchema,
  ShippingLineSearchResult,
  ShippingLineSearchSchema,
} from "@monorepo/schemas";
import isEmpty from "lodash/isEmpty";
import { stringify } from "qs";
import { useMemo } from "react";
import useSWR from "swr";
import { Api } from ".";

export function useSearchShippingLines(query: ShippingLineSearchSchema) {
  const swrKey = useMemo(
    () => ["/api/v1/shipping-line/search", query],
    [query],
  );

  const {
    data: shippingLine,
    isLoading,
    error,
    isValidating,
    mutate,
  } = useSWR<ShippingLineSearchResult>(
    swrKey,
    ([_, q]) => Api.shippingLine.searchShippingLine(q),
    swrOption,
  );

  const memoizedShippingLine = useMemo(
    () => ({
      shippingLinesData: shippingLine?.datas || [],
      shippingLinesMeta: shippingLine?.meta,
      shippingLinesLoading: isLoading || isValidating,
      shippingLinesError: error,
      shippingLinesEmpty:
        (!isLoading || !isValidating) && isEmpty(shippingLine?.datas),
      shippingLinesMutate: mutate,
    }),
    [shippingLine, isLoading, error, isValidating, mutate],
  );

  return memoizedShippingLine;
}

export function useShippingLines() {
  const { data, isLoading, error, isValidating, mutate } = useSWR<
    AllShippingLines[]
  >("/api/v1/shipping-line/all", Api.shippingLine.getAllShippingLines);

  const shippingLinesData = data || [];

  const shippingLinesField = shippingLinesData.map<SelectOption>(
    (shippingLine) => ({
      label: shippingLine.organization,
      value: String(shippingLine.id),
    }),
  );

  const memoizedShippingLines = useMemo(
    () => ({
      shippingLinesData,
      shippingLinesField,
      shippingLinesLoading: isLoading || isValidating,
      shippingLinesError: error,
      shippingLinesEmpty: (!isLoading || !isValidating) && isEmpty(data),
      shippingLinesMutate: mutate,
    }),
    [data, isLoading, error, mutate],
  );

  return memoizedShippingLines;
}

export default {
  async getAllShippingLines(): Promise<AllShippingLines[]> {
    return getData<AllShippingLines[]>(
      await Api.client("/api/v1/shipping-line").get("/all"),
    );
  },
  async searchShippingLine(data: ShippingLineSearchSchema) {
    const query = stringify(data, { skipNulls: true });

    return getData<ShippingLineSearchResult>(
      await Api.client("/api/v1/shipping-line/search").get(`?${query}`),
    );
  },

  async createShippingLine(data: CreateOrUpdateShippingLineSchema) {
    return getData<ShippingLine>(
      await Api.client("/api/v1/shipping-line").post("", data),
    );
  },

  async updateShippingLine(id: string, data: CreateOrUpdateShippingLineSchema) {
    await Api.client("/api/v1/shipping-line").patch(`/${id}`, data);
  },

  async deleteShippingLine(id: string) {
    await Api.client("/api/v1/shipping-line").delete(`/${id}`);
  },
};
