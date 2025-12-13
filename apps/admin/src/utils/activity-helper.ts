import { ActivityProps } from "react";

export function activityHelper(data: any): ActivityProps["mode"] {
  return data ? "visible" : "hidden";
}
