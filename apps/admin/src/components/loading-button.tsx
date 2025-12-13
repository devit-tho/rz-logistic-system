import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

interface LoadingButtonProps extends React.ComponentProps<"button"> {
  loading?: boolean;
  children: React.ReactNode;
}

export function LoadingButton({
  children,
  loading = false,
  ...other
}: LoadingButtonProps) {
  return (
    <Button {...other} disabled={loading}>
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}
