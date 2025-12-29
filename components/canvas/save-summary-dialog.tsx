'use client'

import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  X,
  Sparkles,
  FileCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface SaveSummaryDialogProps {
  open: boolean
  onClose: () => void
  siaId: string
  saveResult: {
    success: boolean
    tensionsDetected: number
    newTensions?: number
    nodeCount: number
    edgeCount: number
  } | null
}

export function SaveSummaryDialog({
  open,
  onClose,
  siaId,
  saveResult,
}: SaveSummaryDialogProps) {
  const router = useRouter()

  if (!saveResult) return null

  const hasTensions = saveResult.tensionsDetected > 0
  const completeness = calculateCompleteness(saveResult.nodeCount, saveResult.edgeCount)

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {saveResult.success ? (
              <>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                Cartographie sauvegardée
              </>
            ) : (
              <>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                Erreur de sauvegarde
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {saveResult.success
              ? 'Votre cartographie a été analysée pour détecter les tensions éthiques.'
              : 'Une erreur est survenue lors de la sauvegarde.'}
          </DialogDescription>
        </DialogHeader>

        {saveResult.success && (
          <div className="space-y-4">
            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Éléments</p>
                <p className="text-2xl font-bold">
                  {saveResult.nodeCount}
                  <span className="text-sm font-normal text-muted-foreground ml-1">nœuds</span>
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Connexions</p>
                <p className="text-2xl font-bold">
                  {saveResult.edgeCount}
                  <span className="text-sm font-normal text-muted-foreground ml-1">flux</span>
                </p>
              </div>
            </div>

            {/* Completeness indicator */}
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Complétude de la cartographie</span>
                <Badge variant={completeness.level === 'good' ? 'default' : 'secondary'}>
                  {completeness.percentage}%
                </Badge>
              </div>
              <Progress value={completeness.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {completeness.message}
              </p>
            </div>

            {/* Tensions result */}
            {hasTensions ? (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-orange-900">
                      {saveResult.tensionsDetected} tension{saveResult.tensionsDetected > 1 ? 's' : ''} éthique{saveResult.tensionsDetected > 1 ? 's' : ''} détectée{saveResult.tensionsDetected > 1 ? 's' : ''}
                    </h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Ces dilemmes nécessitent une analyse et un arbitrage pour garantir
                      un système éthiquement responsable.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900">
                      Aucune tension détectée
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      Complétez votre cartographie pour une analyse plus approfondie,
                      ou vérifiez manuellement les enjeux éthiques.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Continuer à éditer
          </Button>
          {hasTensions && (
            <Button
              onClick={() => router.push(`/${siaId}/tensions`)}
              className="gap-2"
            >
              Analyser les tensions
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {!hasTensions && saveResult.nodeCount >= 2 && (
            <Button
              variant="secondary"
              onClick={() => router.push(`/${siaId}`)}
              className="gap-2"
            >
              <FileCheck className="h-4 w-4" />
              Voir le tableau de bord
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function calculateCompleteness(nodeCount: number, edgeCount: number): {
  percentage: number
  level: 'minimal' | 'basic' | 'good' | 'complete'
  message: string
} {
  // Basic heuristic for completeness
  // A "complete" cartography typically has:
  // - At least 3 nodes
  // - At least 2 edges (connections)
  // - Edge count should be close to node count (connected graph)

  if (nodeCount === 0) {
    return {
      percentage: 0,
      level: 'minimal',
      message: 'Ajoutez des éléments pour commencer.',
    }
  }

  if (nodeCount === 1) {
    return {
      percentage: 15,
      level: 'minimal',
      message: 'Ajoutez d\'autres éléments et connectez-les.',
    }
  }

  if (edgeCount === 0) {
    return {
      percentage: 25,
      level: 'minimal',
      message: 'Connectez vos éléments pour créer des flux de données.',
    }
  }

  // Calculate connectivity ratio
  const connectivityRatio = edgeCount / (nodeCount - 1)
  const minExpectedNodes = 3
  const nodeScore = Math.min(nodeCount / minExpectedNodes, 1) * 40
  const edgeScore = Math.min(connectivityRatio, 1.5) / 1.5 * 40
  const diversityBonus = nodeCount >= 4 ? 20 : nodeCount >= 3 ? 10 : 0

  const percentage = Math.round(nodeScore + edgeScore + diversityBonus)

  if (percentage >= 80) {
    return {
      percentage: Math.min(percentage, 100),
      level: 'complete',
      message: 'Cartographie complète. Prête pour l\'analyse.',
    }
  }

  if (percentage >= 60) {
    return {
      percentage,
      level: 'good',
      message: 'Bonne base. Ajoutez des détails pour une analyse plus fine.',
    }
  }

  if (percentage >= 40) {
    return {
      percentage,
      level: 'basic',
      message: 'Structure de base en place. Continuez à développer.',
    }
  }

  return {
    percentage,
    level: 'minimal',
    message: 'Développez davantage votre cartographie.',
  }
}
