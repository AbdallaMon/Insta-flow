"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Stack,
  CircularProgress,
  AlertTitle,
  Alert,
} from "@mui/material";
import { useLoading } from "@/providers/LoadingProvider";
import { useAlertContext } from "@/providers/MuiAlert";
import { Setter } from "@/shared/types/general";
import MainForm from "../forms/MainForm";
import { GeneralInput, methodType } from "@/shared/utlis/types";
import { submitData } from "@/shared/lib/fetchers/submit";
import { ApiResponse } from "@/shared/types/api";

interface ActionTypeModalProps {
  label: string;
  inputs: GeneralInput[];
  withClose?: boolean;
  href: string;
  setData: Setter<unknown>;
  setTotal?: Setter<number>;
  method: methodType;
  handleAfterSubmit?: (data: unknown) => void;
  submitButtonLabel?: string;
  title?: string;
  description?: string;
  initialValues?: Record<string, unknown>;
}

interface DataWithId {
  id: string | number;
  [key: string]: unknown;
}

const ActionTypeModal = ({
  label,
  inputs,
  href,
  setData,
  setTotal,
  method,
  handleAfterSubmit,
  submitButtonLabel = "ارسال",
  title,
  description,
  initialValues,
}: ActionTypeModalProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { setLoading } = useLoading();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const req = await submitData<unknown, unknown>({
        path: href,
        method: "delete",
        setLoading: setLoading,
        toastMessage: "جاري الحذف",
      });

      if (req && req.data) {
        await onSubmit(req.data);
        handleClose();
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const onSubmit = async (data: unknown) => {
    if (!data) return;

    const req = data as ApiResponse<unknown> & DataWithId;

    setData((old: unknown) => {
      if (Array.isArray(old)) {
        if (method === "post") {
          return [req, ...old];
        } else if (method === "put" || method === "patch") {
          return old.map((item: DataWithId) =>
            item.id === (req as DataWithId).id
              ? { ...item, ...(req as Record<string, unknown>) }
              : item,
          );
        } else if (method === "delete") {
          return old.filter(
            (item: DataWithId) => item.id !== (req as DataWithId).id,
          );
        }
        return old;
      } else {
        return {
          ...(old as Record<string, unknown>),
          ...(req as Record<string, unknown>),
        };
      }
    });

    if (method === "post" && setTotal) {
      setTotal((total) => total + 1);
    }

    if (method === "delete" && setTotal) {
      setTotal((total) => total - 1);
    }

    if (handleAfterSubmit) {
      handleAfterSubmit(data);
    }

    if (method !== "delete") {
      handleClose();
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          width: "100%",
          textTransform: "none",
          fontSize: "1rem",
          py: 1.2,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
          },
        }}
      >
        {label}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: 600,
            pb: 1,
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {title || label}
        </DialogTitle>

        <DialogContent sx={{ pt: 2.5 }}>
          <Stack spacing={2}>
            {description && (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1 }}
              >
                {description}
              </Typography>
            )}

            {method === "delete" && (
              <Alert severity="warning">
                <AlertTitle>تحذير</AlertTitle>
                هل أنت متأكد من رغبتك في حذف هذا العنصر؟ لا يمكن التراجع عن هذا
                الإجراء.
              </Alert>
            )}

            {method !== "delete" ? (
              <Box>
                <MainForm
                  onSubmitData={onSubmit}
                  inputs={inputs}
                  href={href}
                  method={method}
                  submitButtonLabel={submitButtonLabel}
                  initialValues={initialValues}
                />
              </Box>
            ) : null}
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ mt: 3, justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isDeleting}
              sx={{
                textTransform: "none",
                fontSize: "0.95rem",
              }}
            >
              إلغاء
            </Button>

            {method === "delete" && (
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                disabled={isDeleting}
                startIcon={isDeleting ? <CircularProgress size={20} /> : null}
                sx={{
                  textTransform: "none",
                  fontSize: "0.95rem",
                }}
              >
                {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
              </Button>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActionTypeModal;
