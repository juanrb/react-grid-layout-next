import { ReactElement } from "react";

export type ReactRef<T extends HTMLElement> = {
  current: T | null;
};
export type ResizeHandleAxis =
  | "s"
  | "w"
  | "e"
  | "n"
  | "sw"
  | "nw"
  | "se"
  | "ne";
export type ResizeHandle =
  | ReactElement<any>
  | ((
      resizeHandleAxis: ResizeHandleAxis,
      ref: ReactRef<HTMLElement>
    ) => ReactElement<any>);
