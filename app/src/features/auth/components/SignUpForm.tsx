"use client";

/**
 * Sign Up Form Component - Modern Arabic UI
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
  HiOutlineUser,
  HiCheckCircle,
} from "react-icons/hi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { SignUpRequest } from "@/features/auth/types";
import { SIGNUP_DATA } from "@/features/auth/data";
import { APP_CONSTANTS } from "@/shared/data/app-constants";
import { useLoading } from "@/providers/LoadingProvider";

export function SignUpForm() {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { loading: isSubmitting } = useLoading();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpRequest>();

  const onSubmit = async (data: SignUpRequest) => {
    await signUp(data);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        width: "100%",
      }}
    >
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
            {SIGNUP_DATA.title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, textAlign: "center" }}
          >
            {SIGNUP_DATA.subtitle}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              label={SIGNUP_DATA.labels.name}
              fullWidth
              {...register("name", {
                required: SIGNUP_DATA.validation.nameRequired,
                minLength: {
                  value: APP_CONSTANTS.validation.minNameLength,
                  message: SIGNUP_DATA.validation.nameMinLength,
                },
                maxLength: {
                  value: APP_CONSTANTS.validation.maxNameLength,
                  message: SIGNUP_DATA.validation.nameMaxLength,
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HiOutlineUser size={20} color="#64748B" />
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
              label={SIGNUP_DATA.labels.email}
              type="email"
              fullWidth
              {...register("email", {
                required: SIGNUP_DATA.validation.emailRequired,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: SIGNUP_DATA.validation.emailInvalid,
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
              label={SIGNUP_DATA.labels.password}
              type={showPassword ? "text" : "password"}
              fullWidth
              {...register("password", {
                required: SIGNUP_DATA.validation.passwordRequired,
                minLength: {
                  value: APP_CONSTANTS.validation.minPasswordLength,
                  message: SIGNUP_DATA.validation.passwordMinLength,
                },
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
                SIGNUP_DATA.buttons.submit
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {SIGNUP_DATA.dividerText}
            </Typography>
          </Divider>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            {SIGNUP_DATA.links.hasAccount}{" "}
            <Link href="/login">
              <Typography
                component="span"
                fontWeight={600}
                sx={{ cursor: "pointer" }}
              >
                {SIGNUP_DATA.links.login}
              </Typography>
            </Link>
          </Typography>
        </Paper>
      </Box>

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
            mb: 5,
          }}
        >
          {APP_CONSTANTS.appDescription}
        </Typography>

        {/* Features List */}
        <Box sx={{ maxWidth: 320 }}>
          {SIGNUP_DATA.features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
                color: "white",
              }}
            >
              <HiCheckCircle size={24} style={{ opacity: 0.9 }} />
              <Typography variant="body1" sx={{ opacity: 0.95 }}>
                {feature}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
