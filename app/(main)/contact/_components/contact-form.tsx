'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toastManager } from '@/components/ui/toast'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xblnvpvb'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toastManager.add({
          title: 'Message sent',
          description: "We'll get back to you as soon as possible.",
          type: 'success',
        })
        reset()
      } else {
        toastManager.add({
          title: 'Failed to send',
          description: 'Something went wrong. Please try again.',
          type: 'error',
        })
      }
    } catch {
      toastManager.add({
        title: 'Failed to send',
        description: 'Something went wrong. Please try again.',
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset disabled={isSubmitting} className="space-y-6">
        <FormField label="Name" error={errors.name?.message}>
          <Input
            placeholder="Your name"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <FormField label="Subject" error={errors.subject?.message}>
          <Input
            placeholder="What is this about?"
            aria-invalid={!!errors.subject}
            {...register('subject')}
          />
        </FormField>

        <FormField label="Message" error={errors.message?.message}>
          <Textarea
            placeholder="Your message..."
            rows={5}
            aria-invalid={!!errors.message}
            {...register('message')}
          />
        </FormField>
      </fieldset>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Send message'
        )}
      </Button>
    </form>
  )
}

interface FormFieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className={error ? 'text-destructive' : undefined}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

