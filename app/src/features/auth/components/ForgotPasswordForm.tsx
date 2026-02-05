"use client";

/**
 * Forgot Password Form Component - Modern Arabic UI
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { HiOutlineMail, HiArrowLeft, HiCheckCircle } from "react-icons/hi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ForgotPasswordRequest } from "@/features/auth/types";
import { FORGOT_PASSWORD_DATA } from "@/features/auth/data";
import { useLoading } from "@/providers/LoadingProvider";

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const { loading: isSubmitting } = useLoading();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>();

  const onSubmit = async (data: ForgotPasswordRequest) => {
    const result = await forgotPassword(data);
    setSuccess(result);
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 440,
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "success.lighter",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <HiCheckCircle size={48} color="#22C55E" />
          </Box>

          <Typography variant="h4" component="h1" fontWeight={700} mb={2}>
            {FORGOT_PASSWORD_DATA.success.title}
          </Typography>

          <Alert
            severity="success"
            sx={{ mb: 3, borderRadius: 3, textAlign: "right" }}
          >
            {FORGOT_PASSWORD_DATA.success.message}
          </Alert>

          <Link href="/login">
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <HiArrowLeft size={18} />
              {FORGOT_PASSWORD_DATA.links.backToLogin}
            </Box>
          </Link>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RiSecurePaymentLine size={32} color="white" />
          </Box>
        </Box>

        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            textAlign: "center",
          }}
        >
          {FORGOT_PASSWORD_DATA.title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, textAlign: "center" }}
        >
          {FORGOT_PASSWORD_DATA.subtitle}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          <TextField
            label={FORGOT_PASSWORD_DATA.labels.email}
            type="email"
            fullWidth
            {...register("email", {
              required: FORGOT_PASSWORD_DATA.validation.emailRequired,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: FORGOT_PASSWORD_DATA.validation.emailInvalid,
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HiOutlineMail size={20} color="#64748B" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isSubmitting}
            sx={{
              mt: 1,
              py: 1.5,
              borderRadius: 3,
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: "0 4px 14px 0 rgba(37, 99, 235, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 20px 0 rgba(37, 99, 235, 0.4)",
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              FORGOT_PASSWORD_DATA.buttons.submit
            )}
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Link href="/login">
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
            >
              <HiArrowLeft size={18} />
              {FORGOT_PASSWORD_DATA.links.backToLogin}
            </Box>
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
