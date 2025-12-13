"use client";

import { useState, useEffect, type ReactNode } from "react";

export type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  status?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: () => void;
};

type ToastState = {
  toasts: ToastProps[];
};

// Create a unique ID for each toast
const generateId = () => Math.random().toString(36).substring(2, 9);

// Create a singleton instance that can be imported directly
let toastState: ToastState = {
  toasts: [],
};

let listeners: Array<(state: ToastState) => void> = [];

const updateState = (newState: ToastState) => {
  toastState = newState;
  listeners.forEach((listener) => listener(toastState));
};

export const toast = ({
  id = generateId(),
  title,
  description,
  action,
  status = "success",
  duration = 5000,
  onClose,
}: ToastProps) => {
  const newToast = {
    id,
    title,
    description,
    action,
    status,
    duration,
    onClose,
  };

  updateState({
    toasts: [...toastState.toasts, newToast],
  });

  return {
    id,
    dismiss: () => dismissToast(id),
    update: (props: Partial<ToastProps>) => updateToast(id, props),
  };
};

export const dismissToast = (id: string) => {
  updateState({
    toasts: toastState.toasts.filter((toast) => toast.id !== id),
  });
};

export const updateToast = (id: string, props: Partial<ToastProps>) => {
  updateState({
    toasts: toastState.toasts.map((toast) =>
      toast.id === id ? { ...toast, ...props } : toast,
    ),
  });
};

export const useToast = () => {
  const [state, setState] = useState<ToastState>(toastState);

  useEffect(() => {
    const listener = (newState: ToastState) => {
      setState(newState);
    };

    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return {
    toasts: state.toasts,
    toast,
    dismiss: dismissToast,
    update: updateToast,
  };
};
