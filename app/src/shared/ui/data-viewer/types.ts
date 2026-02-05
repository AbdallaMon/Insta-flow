import { TableCellProps } from "@mui/material";

export type DataColumn = {
  itemKey: string;
  hide?: boolean;
  align?: TableCellProps["align"];
  componentName: TableCellProps["component"];
};
