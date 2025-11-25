"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import { useSession } from "@/lib/supabase/auth";
import type { AccountProfile } from "@/lib/profile-utils";
import { saveProfileAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export function EmailFrame({ profile }: { profile: AccountProfile | null }) {
  const router = useRouter();
  const { refreshSession } = useSession();
  const [saving, setSaving] = React.useState(false);

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: profile?.email ?? "",
    },
  });

  React.useEffect(() => {
    form.reset({ email: profile?.email ?? "" });
  }, [profile?.email, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      const trimmedEmail = values.email.trim();
      const result = await saveProfileAction({
        email: trimmedEmail,
      });

      if (!result?.success) {
        toast.error(result?.error ?? "Update failed.");
        return;
      }

      const description = result.emailChanged
        ? result.emailRequiresConfirmation
          ? "Confirmation link sent to new email."
          : "Email updated."
        : undefined;

      toast.success("Email updated", { description });
      form.reset({ email: trimmedEmail });
      await refreshSession();
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  });

  return (
    <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col space-y-6 p-6">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Email Address</h3>
              <p className="text-sm text-muted-foreground">
                The email address associated with your account.
              </p>
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="max-w-md bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-between border-t bg-muted/40 px-6 py-4">
            <p className="text-[13px] text-muted-foreground">
              We’ll use this for account notifications and security alerts.
            </p>
            <Button
              type="submit"
              disabled={!form.formState.isDirty || saving}
              size="sm"
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              {saving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
