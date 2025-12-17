"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toastManager } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";
import { CONTACT_TOPICS, type ContactTopic } from "../config";

const topicKeys = Object.keys(CONTACT_TOPICS) as [
  ContactTopic,
  ...ContactTopic[],
];

const contactSchema = z.object({
  topic: z.enum(topicKeys, { message: "Please select a topic" }),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xblnvpvb";

interface ContactFormProps {
  defaultTopic?: ContactTopic;
}

export function ContactForm({ defaultTopic }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      topic: defaultTopic,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    const topicLabel = CONTACT_TOPICS[data.topic].label;

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...data,
          topic: topicLabel,
        }),
      });

      if (response.ok) {
        toastManager.add({
          title: "Message sent",
          description: "We'll get back to you as soon as possible.",
          type: "success",
        });
        reset();
      } else {
        toastManager.add({
          title: "Failed to send",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      }
    } catch {
      toastManager.add({
        title: "Failed to send",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset disabled={isSubmitting} className="space-y-6">
        <FormField label="Topic" error={errors.topic?.message}>
          <Controller
            name="topic"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full" aria-invalid={!!errors.topic}>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {topicKeys.map((key) => (
                    <SelectItem key={key} value={key}>
                      {CONTACT_TOPICS[key].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        <FormField label="Name" error={errors.name?.message}>
          <Input
            placeholder="Your name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </FormField>

        <FormField label="Subject" error={errors.subject?.message}>
          <Input
            placeholder="What is this about?"
            aria-invalid={!!errors.subject}
            {...register("subject")}
          />
        </FormField>

        <FormField label="Message" error={errors.message?.message}>
          <Textarea
            placeholder="Your message..."
            rows={5}
            aria-invalid={!!errors.message}
            {...register("message")}
          />
        </FormField>
      </fieldset>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner />
            Sending...
          </>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className={error ? "text-destructive" : undefined}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
