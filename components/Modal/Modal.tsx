"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import clsx from "clsx";
import React from "react";
import { Button } from "../ui/button";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  actionLabel?: string;
  actionLoading?: boolean;
  onAction?: () => void;
  hideActions?: boolean;
  width?: string;
  className?: string;
}

export default function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  actionLabel = "تایید",
  actionLoading = false,
  onAction,
  hideActions = false,
  width,
  className,
}: ModalProps) {
  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={clsx("md:max-w-2xl max-h-[94vh]", width, className)}
      >
        {(title || description) && (
          <DialogHeader>
            {title && (
              <DialogTitle className="text-center">{title}</DialogTitle>
            )}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="py-2">{children}</div>

        {!hideActions && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              انصراف
            </Button>

            {onAction && (
              <Button onClick={onAction} loading={actionLoading}>
                {actionLabel}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
