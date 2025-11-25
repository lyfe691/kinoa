"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import { useSession } from "@/lib/supabase/auth";
import type { AccountProfile } from "@/lib/supabase/profile";
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

const displayNameSchema = z.object({
  displayName: z
    .string()
    .max(25, "Display name must be 25 characters or fewer"),
});

export function DisplayNameFrame({
  profile,
}: {
  profile: AccountProfile | null;
}) {
  const router = useRouter();
  const { refreshSession } = useSession();
  const [saving, setSaving] = React.useState(false);

  const form = useForm<z.infer<typeof displayNameSchema>>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: {
      displayName: profile?.displayName ?? "",
    },
  });

  // Update form if profile changes from outside
  React.useEffect(() => {
    form.reset({ displayName: profile?.displayName ?? "" });
  }, [profile?.displayName, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      const trimmedName = values.displayName.trim();
      const result = await saveProfileAction({
        displayName: trimmedName.length ? trimmedName : null,
      });

      if (!result?.success) {
        toast.error(result?.error ?? "Update failed.");
        return;
      }

      toast.success("Display name updated");
      form.reset({ displayName: trimmedName });
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
              <h3 className="text-lg font-medium">Display Name</h3>
              <p className="text-sm text-muted-foreground">
                This is your visible name within Kinoa.
              </p>
            </div>
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your name"
                      autoComplete="name"
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
              Please use 25 characters at maximum.
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
