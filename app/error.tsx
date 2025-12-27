'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Une erreur est survenue</h2>
            <p className="text-muted-foreground mb-6">
              Nous sommes désolés, une erreur inattendue s&apos;est produite.
              Veuillez réessayer ou retourner à l&apos;accueil.
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mb-4 font-mono">
                Code: {error.digest}
              </p>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => (window.location.href = '/')}>
                <Home className="mr-2 h-4 w-4" />
                Accueil
              </Button>
              <Button onClick={reset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
