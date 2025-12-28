'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  FileText,
  Download,
  FileJson,
  FileSpreadsheet,
  File,
  Calendar,
  Clock,
  RefreshCw,
  Eye,
  RotateCcw,
  History,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

interface Version {
  id: string
  version: number
  snapshot: Record<string, unknown>
  createdAt: string
  createdBy: string
}

export default function FilesPage() {
  const params = useParams()
  const siaId = params.siaId as string
  const { toast } = useToast()

  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState<string | null>(null)
  const [creatingVersion, setCreatingVersion] = useState(false)
  const [restoringVersion, setRestoringVersion] = useState<string | null>(null)
  const [viewingVersion, setViewingVersion] = useState<Version | null>(null)

  useEffect(() => {
    async function fetchVersions() {
      try {
        const response = await fetch(`/api/sia/${siaId}/versions`)
        if (response.ok) {
          const data = await response.json()
          setVersions(data)
        }
      } catch (error) {
        console.error('Error fetching versions:', error)
      } finally {
        setLoading(false)
      }
    }

    if (siaId) {
      fetchVersions()
    }
  }, [siaId])

  const handleExport = async (format: 'pdf' | 'json' | 'csv') => {
    setExporting(format)
    try {
      const response = await fetch(`/api/sia/${siaId}/export?format=${format}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `sia-export-${siaId}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: 'Export réussi',
          description: `Le fichier ${format.toUpperCase()} a été téléchargé`,
        })
      } else {
        throw new Error('Export failed')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: `Impossible d'exporter en ${format.toUpperCase()}`,
        variant: 'destructive',
      })
    } finally {
      setExporting(null)
    }
  }

  const handleCreateVersion = async () => {
    setCreatingVersion(true)
    try {
      const response = await fetch(`/api/sia/${siaId}/versions`, {
        method: 'POST',
      })

      if (response.ok) {
        const newVersion = await response.json()
        setVersions((prev) => [newVersion, ...prev])
        toast({
          title: 'Version créée',
          description: `Version ${newVersion.version} sauvegardée`,
        })
      } else {
        throw new Error('Failed to create version')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer une version',
        variant: 'destructive',
      })
    } finally {
      setCreatingVersion(false)
    }
  }

  const handleRestoreVersion = async (version: Version) => {
    setRestoringVersion(version.id)
    try {
      const response = await fetch(`/api/sia/${siaId}/versions/${version.id}/restore`, {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: 'Version restaurée',
          description: `La version ${version.version} a été restaurée. Rechargez la page pour voir les changements.`,
        })
        // Refresh the page after a short delay
        setTimeout(() => window.location.reload(), 1500)
      } else {
        throw new Error('Failed to restore version')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de restaurer la version',
        variant: 'destructive',
      })
    } finally {
      setRestoringVersion(null)
    }
  }

  const handleViewVersion = (version: Version) => {
    setViewingVersion(version)
    toast({
      title: `Aperçu de la version ${version.version}`,
      description: 'Cette fonctionnalité est en cours de développement.',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Documents et exports</h1>
        <p className="text-muted-foreground">
          Exportez votre analyse et gérez les versions
        </p>
      </div>

      {/* Export options */}
      <Card>
        <CardHeader>
          <CardTitle>Exporter l&apos;analyse</CardTitle>
          <CardDescription>
            Téléchargez votre SIA dans différents formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-medium mb-1">Rapport PDF</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Document complet avec graphiques et recommandations
                  </p>
                  <Button
                    onClick={() => handleExport('pdf')}
                    disabled={exporting === 'pdf'}
                    className="w-full"
                  >
                    {exporting === 'pdf' ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Export en cours...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger PDF
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <FileJson className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-1">Export JSON</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Données structurées pour intégration technique
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('json')}
                    disabled={exporting === 'json'}
                    className="w-full"
                  >
                    {exporting === 'json' ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Export en cours...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger JSON
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                    <FileSpreadsheet className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-1">Export CSV</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tableur avec tensions et actions
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('csv')}
                    disabled={exporting === 'csv'}
                    className="w-full"
                  >
                    {exporting === 'csv' ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Export en cours...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger CSV
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Version history */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Historique des versions</CardTitle>
            <CardDescription>
              Sauvegardez et restaurez des versions de votre analyse
            </CardDescription>
          </div>
          <Button onClick={handleCreateVersion} disabled={creatingVersion}>
            {creatingVersion ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <History className="mr-2 h-4 w-4" />
                Créer une version
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <div className="text-center py-8">
              <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Aucune version sauvegardée</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Créez des versions pour conserver l&apos;historique de vos modifications
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-medium text-primary">v{version.version}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Version {version.version}</span>
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs">
                            Actuelle
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(version.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewVersion(version)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Voir
                    </Button>
                    {index !== 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreVersion(version)}
                        disabled={restoringVersion === version.id}
                      >
                        {restoringVersion === version.id ? (
                          <>
                            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                            Restauration...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="mr-1 h-3 w-3" />
                            Restaurer
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
