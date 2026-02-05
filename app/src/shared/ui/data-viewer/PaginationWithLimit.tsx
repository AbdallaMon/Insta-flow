import { totalLimitPages } from "@/shared/utlis/constants";
import {
  Box,
  FormControl,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { ChangeEvent } from "react";

interface PaginationWithLimitProps {
  page: number;
  totalPages: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  total: number;
}

export default function PaginationWithLimit({
  page,
  totalPages,
  limit,
  setPage,
  setLimit,
  total,
}: PaginationWithLimitProps) {
  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    const newLimit = Number(event.target.value);
    setLimit(newLimit);

    const newPage = Math.min(page, Math.ceil(total / newLimit));
    setPage(newPage || 1);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row-reverse",
        py: 2,
        px: 2,
      }}
    >
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ marginRight: "8px" }}>
          Items per page
        </Typography>
        <FormControl variant="outlined" size="small">
          <Select
            value={limit}
            onChange={handleLimitChange}
            sx={{ backgroundColor: "white" }}
          >
            {totalLimitPages.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
