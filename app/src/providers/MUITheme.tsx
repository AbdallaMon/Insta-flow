"use client";
// src/theme/muiTheme.ts
import { colors } from "@/shared/utlis/constants";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";

export const rtlCache = createCache({
  key: "mui-rtl",
  stylisPlugins: [rtlPlugin],
});
export const muiTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",

    primary: {
      main: colors.primary,
      dark: colors.primaryActive,
      light: colors.primaryBg,
      contrastText: colors.surface,
    },

    secondary: {
      main: colors.accent,
      dark: colors.accentActive,
      light: colors.accentBg,
      contrastText: colors.surface,
    },

    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.danger },
    info: { main: colors.info },

    background: {
      default: colors.bg,
      paper: colors.surface,
    },

    text: {
      primary: colors.text,
      secondary: colors.muted,
      disabled: colors.disabledText,
    },

    divider: colors.divider,

    action: {
      hover: colors.rowHoverBg,
      disabled: colors.disabledText,
      disabledBackground: colors.disabledBg,
      focusOpacity: 0.12,
      hoverOpacity: 0.06,
      selectedOpacity: 0.1,
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: ['"Inter"', '"Cairo"', "system-ui", "Arial"].join(","),
    button: { textTransform: "none", fontWeight: 600 },
  },

  components: {
    // Buttons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: colors.primary,
          "&:hover": { backgroundColor: colors.primaryHover },
          "&:active": { backgroundColor: colors.primaryActive },
        },
        containedSecondary: {
          backgroundColor: colors.accent,
          "&:hover": { backgroundColor: colors.accentHover },
          "&:active": { backgroundColor: colors.accentActive },
        },
      },
    },

    // Paper / Card feel
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${colors.border}`,
        },
      },
    },

    // Cards
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${colors.border}`,
        },
      },
    },

    // TextField / Outlined input
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: colors.surface,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.primary,
            boxShadow: `0 0 0 4px ${colors.focusRing}`,
          },
        },
        notchedOutline: {
          borderColor: colors.border,
        },
      },
    },

    // Table header styling
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: colors.tableHeaderBg,
        },
      },
    },

    // Chip (great for statuses)
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999 },
      },
    },
  },
});

export function MUIThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
