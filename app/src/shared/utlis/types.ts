import React from "react";
import { IconType } from "react-icons/lib";

type ToastType = "success" | "error" | "info" | "warning";
export type ToastStatus = {
  render: string;
  type: ToastType;
  isLoading: boolean;
  autoClose: number;
};

// export
export type TitleDescription = {
  title: string;
  description: string;
};
export type ColorsTokens = {
  // Brand
  primary: string;
  lightPrimary: string;
  accent: string;
  support: string;
  danger: string;
  warning: string;

  // Surfaces
  background: string; // page background
  paperBackground: string; // cards/modals
  elevatedBackground: string; // hover/raised surfaces
  surface: string; // inputs / subtle surfaces

  // Text
  text: string;
  mutedText: string;
  lightText: string;

  // Utility
  border: string;
  overlay: string;

  // Constants (real colors)
  white: string;
  black: string;
};
export type KeyFeature = {
  title: string;
  icon: IconType;
  color?: string;
};

export type GeneralPattern = {
  required?: {
    value: boolean;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
};
export type RowType = { [key: string]: unknown };

export interface GeneralInput {
  input: {
    label: string;
    name?: string;
    id: string;
    type: string;
    placeholder?: string;
    options?: { label: string; value: string }[];
    defaultValue?: string | number | boolean;
    [key: string]:
      | string
      | number
      | boolean
      | { label: string; value: string }[]
      | undefined;
  };
  pattern?: GeneralPattern;
}

export type methodType = "post" | "put" | "patch" | "delete" | "get";
