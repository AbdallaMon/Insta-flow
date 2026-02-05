"use client";

/**
 * Change Password Form Component - Modern Arabic UI
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineLockClosed,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { ChangePasswordRequest } from "@/features/auth/types";
import { CHANGE_PASSWORD_DATA } from "@/features/auth/data";
import { useLoading } from "@/providers/LoadingProvider";

export function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const { loading: isSubmitting } = useLoading();
  const [success, setSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    reset,
  } = useForm<ChangePasswordRequest & { confirmPassword: string }>();

  const newPassword = watch("newPassword");

  const onSubmit = async (
    data: ChangePasswordRequest & { confirmPassword: string },
  ) => {
    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", {
        message: CHANGE_PASSWORD_DATA.validation.passwordsMismatch,
      });
      return;
    }

    const result = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });

    if (result) {
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 480,
        p: { xs: 3, sm: 4 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: "primary.lighter",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HiOutlineRefresh size={28} color="#2563EB" />
        </Box>
        <Box>
          <Typography variant="h5" component="h2" fontWeight={700}>
            {CHANGE_PASSWORD_DATA.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {CHANGE_PASSWORD_DATA.subtitle}
          </Typography>
        </Box>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {CHANGE_PASSWORD_DATA.success}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
      >
        <TextField
          label={CHANGE_PASSWORD_DATA.labels.currentPassword}
          type={showCurrentPassword ? "text" : "password"}
          fullWidth
          {...register("currentPassword", {
            required: CHANGE_PASSWORD_DATA.validation.currentPasswordRequired,
          })}
          error={!!errors.currentPassword}
          helperText={errors.currentPassword?.message}
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
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  edge="end"
                  size="small"
                >
                  {showCurrentPassword ? (
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
          label={CHANGE_PASSWORD_DATA.labels.newPassword}
          type={showNewPassword ? "text" : "password"}
          fullWidth
          {...register("newPassword", {
            required: CHANGE_PASSWORD_DATA.validation.newPasswordRequired,
            minLength: {
              value: 8,
              message: CHANGE_PASSWORD_DATA.validation.passwordMinLength,
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
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                  size="small"
                >
                  {showNewPassword ? (
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
          label={CHANGE_PASSWORD_DATA.labels.confirmPassword}
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          {...register("confirmPassword", {
            required: CHANGE_PASSWORD_DATA.validation.confirmPasswordRequired,
            validate: (value) =>
              value === newPassword ||
              CHANGE_PASSWORD_DATA.validation.passwordsMismatch,
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
            CHANGE_PASSWORD_DATA.buttons.submit
          )}
        </Button>
      </Box>
    </Paper>
  );
}
