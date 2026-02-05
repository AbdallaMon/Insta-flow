"use client";

/**
 * Reset Password Form Component - Modern Arabic UI
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineLockClosed,
} from "react-icons/hi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ResetPasswordRequest } from "@/features/auth/types";
import { RESET_PASSWORD_DATA } from "@/features/auth/data";
import { useLoading } from "@/providers/LoadingProvider";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { resetPassword } = useAuth();
  const { loading: isSubmitting } = useLoading();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<ResetPasswordRequest & { confirmPassword: string }>();

  const newPassword = watch("newPassword");

  const onSubmit = async (
    data: ResetPasswordRequest & { confirmPassword: string },
  ) => {
    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", {
        message: RESET_PASSWORD_DATA.validation.passwordsMismatch,
      });
      return;
    }

    await resetPassword({
      token,
      newPassword: data.newPassword,
    });
  };

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
          {RESET_PASSWORD_DATA.title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, textAlign: "center" }}
        >
          {RESET_PASSWORD_DATA.subtitle}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          <TextField
            label={RESET_PASSWORD_DATA.labels.newPassword}
            type={showPassword ? "text" : "password"}
            fullWidth
            {...register("newPassword", {
              required: RESET_PASSWORD_DATA.validation.passwordRequired,
              minLength: {
                value: 8,
                message: RESET_PASSWORD_DATA.validation.passwordMinLength,
              },
            })}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HiOutlineLockClosed size={20} color="#64748B" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff size={20} />
                    ) : (
                      <HiOutlineEye size={20} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <TextField
            label={RESET_PASSWORD_DATA.labels.confirmPassword}
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            {...register("confirmPassword", {
              required: RESET_PASSWORD_DATA.validation.confirmPasswordRequired,
              validate: (value) =>
                value === newPassword ||
                RESET_PASSWORD_DATA.validation.passwordsMismatch,
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HiOutlineLockClosed size={20} color="#64748B" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? (
                      <HiOutlineEyeOff size={20} />
                    ) : (
                      <HiOutlineEye size={20} />
                    )}
                  </IconButton>
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
              RESET_PASSWORD_DATA.buttons.submit
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
