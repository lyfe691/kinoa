'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleAuthButton } from '@/components/auth/oauth-provider-button'
import { useSession } from '@/lib/supabase/auth'
import { getAuthErrorMessage } from '@/lib/supabase/errors'
import { CircleAlertIcon, Loader } from 'lucide-react'
import { toast } from 'sonner'

function AuthDivider() {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
      <div className="h-px w-full bg-border" />
      <span>or</span>
      <div className="h-px w-full bg-border" />
    </div>
  )
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [oauthLoading, setOauthLoading] = React.useState(false)
  const { supabase } = useSession()
  const isSubmitting = React.useRef(false)

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (isSubmitting.current) return

      isSubmitting.current = true
      setError(null)
      setLoading(true)

      if (!supabase) {
        setError('Unable to reach the authentication service. Please try again.')
        setLoading(false)
        isSubmitting.current = false
        return
      }

      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (signInError) throw signInError

        toast.success('Signed in successfully.')
        router.push('/')
        router.refresh()
      } catch (err) {
        const message = getAuthErrorMessage(err, 'Unable to sign in. Please try again.')
        setError(message)
      } finally {
        setLoading(false)
        isSubmitting.current = false
      }
    },
    [email, password, supabase, router],
  )

  return (
    <div className="space-y-4">
      <GoogleAuthButton
        disabled={loading}
        onError={setError}
        onLoadingChange={setOauthLoading}
      />

      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || oauthLoading}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || oauthLoading}
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <Alert variant="error">
            <CircleAlertIcon />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={loading || oauthLoading}>
          {loading && <Loader className="h-4 w-4 animate-spin" />}
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Forgot your password?{' '}
          <Link href="/forgot-password" className="text-foreground underline underline-offset-4">
            Reset it
          </Link>
          .
        </p>
      </form>
    </div>
  )
}
