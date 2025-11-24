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
      Continue with Google
    </Button>
  )
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      role="img"
      {...props}
    >
      <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.97 9.97 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748z"></path>
    </svg>
  )
}

