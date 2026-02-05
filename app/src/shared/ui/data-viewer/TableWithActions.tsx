"use client";

import useDataFetcher from "@/shared/hooks/useDataFetcher";
import { GeneralInput, RowType } from "@/shared/utlis/types";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FieldValues } from "react-hook-form";
import { DataColumn } from "./types";

export default function TableWithActions({
  inputs,
  url,
  columns,
  rows,
}: {
  inputs: GeneralInput[];
  onSubmitData: (data: FieldValues) => void;
  url: string;
  columns: DataColumn[];
  rows: RowType[];
}) {
  const { data, setData } = useDataFetcher({
    url,
  });

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => {
                if (column.hide) return;
                return (
                  <TableCell
                    align={column.align}
                    key={"col" + column.itemKey + index}
                  ></TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={"row" + index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {columns.map((column, index) => {
                  if (column.hide) return;
                  return (
                    <TableCell
                      {...(column.componentName && {
                        component: column.componentName,
                      })}
                      key={column.itemKey + index}
                      scope="row"
                      align={column.align || "right"}
                    >
                      {row[column.itemKey] as React.ReactNode}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
