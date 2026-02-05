"use client";

/**
 * Login Form Component - Modern Arabic UI
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
  IconButton,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineMail,
  HiOutlineLockClosed,
} from "react-icons/hi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { LoginRequest } from "@/features/auth/types";
import { LOGIN_DATA } from "@/features/auth/data";
import { APP_CONSTANTS } from "@/shared/data/app-constants";
import { useLoading } from "@/providers/LoadingProvider";

export function LoginForm() {
  const { login } = useAuth();
  const { loading: isSubmitting } = useLoading();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    await login(data);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        width: "100%",
      }}
    >
      {/* Branding Side */}
      <Box
        sx={{
          flex: 1,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <RiSecurePaymentLine
          size={80}
          color="white"
          style={{ marginBottom: 24 }}
        />
        <Typography
          variant="h3"
          sx={{
            color: "white",
            fontWeight: 700,
            mb: 2,
            textAlign: "center",
          }}
        >
          {APP_CONSTANTS.appName}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: 400,
            lineHeight: 1.8,
          }}
        >
          {APP_CONSTANTS.appTagline}
        </Typography>
        <Box sx={{ mt: 6, display: "flex", gap: 4 }}>
          {APP_CONSTANTS.brandFeatures.map((feature) => (
            <Box
              key={feature}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "white",
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.3)",
                  mb: 1,
                }}
              />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {feature}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Form Side */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 3, sm: 6 },
          bgcolor: "background.default",
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
          {/* Mobile Logo */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "center",
              mb: 4,
            }}
          >
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
            {LOGIN_DATA.title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, textAlign: "center" }}
          >
            {LOGIN_DATA.subtitle}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              label={LOGIN_DATA.labels.email}
              type="email"
              fullWidth
              {...register("email", {
                required: LOGIN_DATA.validation.emailRequired,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: LOGIN_DATA.validation.emailInvalid,
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

            <TextField
              label={LOGIN_DATA.labels.password}
              type={showPassword ? "text" : "password"}
              fullWidth
              {...register("password", {
                required: LOGIN_DATA.validation.passwordRequired,
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
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

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Link href="/forgot-password">
                <Typography
                  component="span"
                  sx={{ fontSize: "0.875rem", cursor: "pointer" }}
                >
                  {LOGIN_DATA.links.forgotPassword}
                </Typography>
              </Link>
            </Box>

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
                LOGIN_DATA.buttons.submit
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {LOGIN_DATA.dividerText}
            </Typography>
          </Divider>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            {LOGIN_DATA.links.noAccount}{" "}
            <Link href="/signup">
              <Typography
                component="span"
                fontWeight={600}
                sx={{ cursor: "pointer" }}
              >
                {LOGIN_DATA.links.signUp}
              </Typography>
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
