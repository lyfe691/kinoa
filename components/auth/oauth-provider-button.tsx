'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { getAuthErrorMessage } from '@/lib/supabase/errors'
import { useSession } from '@/lib/supabase/auth'
import { Loader } from 'lucide-react'

type GoogleAuthButtonProps = {
  disabled?: boolean
  onError?: (message: string | null) => void
  onLoadingChange?: (loading: boolean) => void
}

export function GoogleAuthButton({ disabled, onError, onLoadingChange }: GoogleAuthButtonProps) {
  const { supabase } = useSession()
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    onLoadingChange?.(loading)
  }, [loading, onLoadingChange])

  const handleClick = React.useCallback(async () => {
    if (loading || disabled) return

    onError?.(null)
    setLoading(true)

    if (!supabase) {
      onError?.('Unable to reach the authentication service. Please try again.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err) {
      const message = getAuthErrorMessage(err, 'Unable to sign in with Google. Please try again.')
      onError?.(message)
      setLoading(false)
    }
  }, [disabled, loading, onError, supabase])

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? <Loader className="h-4 w-4 animate-spin" /> : <GoogleIcon className="h-4 w-4" />}
      {loading ? 'Redirecting...' : 'Continue with Google'}
    </Button>
  )
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="img" {...props}>
      <path
        d="M22 12.232c0-.638-.057-1.252-.164-1.84H12v3.482h5.602c-.242 1.26-.978 2.326-2.084 3.042v2.51h3.375c1.977-1.822 3.107-4.507 3.107-7.194Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.7 0 4.965-.884 6.62-2.385l-3.375-2.51c-.938.63-2.141 1.005-3.245 1.005-2.495 0-4.61-1.68-5.365-3.938H3.13v2.599C4.775 20.978 8.133 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M6.635 15.172c-.21-.63-.33-1.304-.33-1.996 0-.692.12-1.366.33-1.996V8.58H3.13A10.996 10.996 0 0 0 2 13.176c0 1.723.41 3.35 1.13 4.596l3.505-2.6Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.54c1.47 0 2.784.504 3.822 1.486l2.866-2.866C16.963 3.28 14.7 2.356 12 2.356 8.133 2.356 4.775 4.377 3.13 7.005l3.505 2.599C7.39 8.22 9.505 6.54 12 6.54Z"
        fill="#EA4335"
      />
      <path d="M2 2h20v20H2z" fill="none" />
    </svg>
  )
}

