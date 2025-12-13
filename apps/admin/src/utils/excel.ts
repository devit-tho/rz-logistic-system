import { capitalCase } from "change-case";
import { get } from "lodash";
import { toast } from "sonner";
import * as XLSX from "xlsx";

// Ai help thanks
function flattenKeys(obj: any, prefix = ""): string[] {
  return Object.keys(obj).flatMap((key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return flattenKeys(value, newKey);
    }
    return newKey;
  });
}

export function exportToExcel<T extends Record<string, any>>(
  datas: T[],
  fileName = "default",
) {
  if (datas.length === 0) {
    toast.error("No data to export");
    return;
  }

  const keys = flattenKeys(datas[0]);

  const wsData = datas.map((data) => {
    const row: Record<string, string> = {};
    keys.forEach((key) => {
      const value = get(data, key, "");
      row[key] = value != null ? String(value) : "";
    });
    return row;
  });

  const wscols = keys.map((key) => {
    const maxLen = Math.max(
      key.length,
      ...datas.map((r) => {
        const value = get(r, key, "");
        return String(value ?? "").length || 20;
      }),
    );
    return { wch: maxLen };
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(wsData);

  const range = XLSX.utils.decode_range(worksheet["!ref"]!);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    // Get the cell address, e.g. "A1"
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    // The old header is the cell's value
    const oldHeader = worksheet[cellAddress]?.v;

    if (oldHeader) {
      // Replace with new custom header
      worksheet[cellAddress].v = capitalCase(oldHeader);
    }
  }

  worksheet["!cols"] = wscols;
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
