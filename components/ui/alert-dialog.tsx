"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui-components/react/alert-dialog";

import { cn } from "@/lib/utils";

function AlertDialog(props: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger(props: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal(props: AlertDialogPrimitive.Portal.Props) {
  return <AlertDialogPrimitive.Portal {...props} />;
}

function AlertDialogBackdrop({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
        "transition-all duration-200 ease-out",
        "data-ending-style:opacity-0 data-starting-style:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogPopup({
  className,
  ...props
}: AlertDialogPrimitive.Popup.Props) {
  return (
    <AlertDialogPortal>
      <AlertDialogBackdrop />
      <div className="fixed inset-0 z-50">
        <div className="flex h-dvh flex-col items-center overflow-hidden pt-6 max-sm:before:flex-1 sm:overflow-y-auto sm:p-4 sm:before:basis-[20vh] sm:after:flex-1">
          <AlertDialogPrimitive.Popup
            data-slot="alert-dialog-popup"
            className={cn(
              "row-start-2 grid w-full min-w-0 origin-top",
              "gap-5 p-6",
              "bg-background/95 backdrop-blur-xl",
              "border border-border/50 rounded-2xl",
              "shadow-2xl shadow-black/10 dark:shadow-black/30",
              "text-popover-foreground",
              "transition-[scale,opacity,translate] duration-200 ease-out will-change-transform",
              "data-ending-style:opacity-0 data-starting-style:opacity-0",
              "max-sm:overflow-y-auto max-sm:border-x-0 max-sm:rounded-t-2xl max-sm:rounded-b-none",
              "max-sm:opacity-[calc(1-min(var(--nested-dialogs),1))]",
              "max-sm:data-ending-style:translate-y-4 max-sm:data-starting-style:translate-y-4",
              "sm:max-w-lg",
              "sm:-translate-y-[calc(1.25rem*var(--nested-dialogs))]",
              "sm:scale-[calc(1-0.1*var(--nested-dialogs))]",
              "sm:data-ending-style:scale-98 sm:data-starting-style:scale-98",
              "sm:data-nested:data-ending-style:translate-y-8 sm:data-nested:data-starting-style:translate-y-8",
              className,
            )}
            {...props}
          />
        </div>
      </div>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-2",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: AlertDialogPrimitive.Title.Props) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  );
}

function AlertDialogClose(props: AlertDialogPrimitive.Close.Props) {
  return (
    <AlertDialogPrimitive.Close data-slot="alert-dialog-close" {...props} />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogBackdrop as AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogPopup,
  AlertDialogPopup as AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
};
