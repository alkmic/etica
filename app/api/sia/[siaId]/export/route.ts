import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { DOMAINS } from '@/lib/constants/domains'

export const dynamic = 'force-dynamic'

// GET /api/sia/[siaId]/export - Export SIA in various formats
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siaId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { siaId } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Get full SIA with all related data
    const sia = await db.sia.findFirst({
      where: {
        id: siaId,
        ownerId: session.user.id,
      },
      include: {
        nodes: true,
        edges: {
          include: {
            source: true,
            target: true,
          },
        },
        tensions: {
          include: {
            tensionEdges: {
              include: {
                edge: true,
              },
            },
            arbitrations: true,
            actions: true,
          },
        },
        actions: {
          include: {
            evidences: true,
          },
        },
      },
    })

    if (!sia) {
      return NextResponse.json(
        { error: 'SIA non trouvé' },
        { status: 404 }
      )
    }

    switch (format) {
      case 'json':
        return new NextResponse(JSON.stringify(sia, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="sia-${siaId}.json"`,
          },
        })

      case 'csv':
        const csv = generateCsv(sia)
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="sia-${siaId}.csv"`,
          },
        })

      case 'pdf':
        // For PDF, we return a simple HTML that can be converted to PDF client-side
        // In production, you'd use a library like @react-pdf/renderer or puppeteer
        const html = generatePdfHtml(sia)
        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Disposition': `attachment; filename="sia-${siaId}.html"`,
          },
        })

      default:
        return NextResponse.json(
          { error: 'Format non supporté' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error exporting SIA:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'export' },
      { status: 500 }
    )
  }
}

interface SiaExport {
  id: string
  name: string
  description: string
  status: string
  decisionType: string
  userScale: string
  dataTypes: string[]
  populations: string[]
  hasVulnerable: boolean
  vigilanceScores: Record<string, unknown>
  nodes: Array<{
    id: string
    type: string
    label: string
    attributes: Record<string, unknown>
  }>
  edges: Array<{
    id: string
    source: { label: string }
    target: { label: string }
    dataCategories: string[]
  }>
  tensions: Array<{
    id: string
    pattern: string
    status: string
    severity: number
    impactedDomains: string[]
    description: string
    arbitration: {
      decision: string
      justification: string
      createdAt: Date
    } | null
  }>
  actions: Array<{
    id: string
    title: string
    description: string
    status: string
    priority: string
    category: string
    dueDate: Date | null
    assignee: string | null
  }>
  createdAt: Date
  updatedAt: Date
}

function generateCsv(sia: SiaExport): string {
  const lines: string[] = []

  // Header
  lines.push('SYSTÈME D\'INFORMATION ALGORITHMIQUE - RAPPORT D\'ANALYSE ÉTHIQUE')
  lines.push('')
  lines.push(`Nom,${escapeCsv(sia.name)}`)
  lines.push(`Description,${escapeCsv(sia.description)}`)
  lines.push(`Statut,${sia.status}`)
  lines.push(`Type de décision,${sia.decisionType}`)
  lines.push(`Échelle,${sia.userScale}`)
  lines.push(`Date de création,${new Date(sia.createdAt).toLocaleDateString('fr-FR')}`)
  lines.push('')

  // Tensions
  lines.push('TENSIONS ÉTHIQUES')
  lines.push('ID,Description,Domaines impactés,Sévérité,Statut')
  for (const tension of sia.tensions) {
    const domains = tension.impactedDomains
      .map(d => DOMAINS[d as keyof typeof DOMAINS]?.label || d)
      .join(' / ')
    lines.push([
      tension.id,
      escapeCsv(tension.description),
      escapeCsv(domains),
      tension.severity,
      tension.status,
    ].join(','))
  }
  lines.push('')

  // Actions
  lines.push('PLAN D\'ACTION')
  lines.push('ID,Titre,Description,Priorité,Statut,Catégorie,Responsable,Échéance')
  for (const action of sia.actions) {
    lines.push([
      action.id,
      escapeCsv(action.title),
      escapeCsv(action.description),
      action.priority,
      action.status,
      action.category,
      escapeCsv(action.assignee || ''),
      action.dueDate ? new Date(action.dueDate).toLocaleDateString('fr-FR') : '',
    ].join(','))
  }

  return lines.join('\n')
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function generatePdfHtml(sia: SiaExport): string {
  const vigilanceScores = sia.vigilanceScores as { global?: number; domains?: Record<string, number> }

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport SIA - ${sia.name}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
    h2 { color: #4b5563; margin-top: 30px; }
    h3 { color: #6b7280; }
    .meta { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .meta p { margin: 5px 0; }
    .score { font-size: 24px; font-weight: bold; color: #7c3aed; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
    th { background: #f9fafb; }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    .critical { background: #fee2e2; color: #dc2626; }
    .high { background: #ffedd5; color: #ea580c; }
    .medium { background: #fef3c7; color: #d97706; }
    .low { background: #dbeafe; color: #2563eb; }
    .completed { background: #dcfce7; color: #16a34a; }
    .pending { background: #f3f4f6; color: #4b5563; }
    footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <h1>Rapport d'Analyse Éthique</h1>

  <div class="meta">
    <p><strong>Système:</strong> ${sia.name}</p>
    <p><strong>Description:</strong> ${sia.description}</p>
    <p><strong>Type de décision:</strong> ${sia.decisionType}</p>
    <p><strong>Échelle:</strong> ${sia.userScale}</p>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
  </div>

  <h2>Score de Vigilance Global</h2>
  <p class="score">${(vigilanceScores?.global || 0).toFixed(1)} / 5</p>

  <h3>Scores par domaine</h3>
  <table>
    <tr>
      <th>Domaine</th>
      <th>Score</th>
    </tr>
    ${Object.entries(DOMAINS).map(([key, domain]) => `
      <tr>
        <td>${domain.label}</td>
        <td>${((vigilanceScores?.domains as Record<string, number>)?.[key] || 0).toFixed(1)} / 5</td>
      </tr>
    `).join('')}
  </table>

  <h2>Tensions Éthiques (${sia.tensions.length})</h2>
  ${sia.tensions.length === 0 ? '<p>Aucune tension détectée.</p>' : `
    <table>
      <tr>
        <th>Description</th>
        <th>Domaines</th>
        <th>Sévérité</th>
        <th>Statut</th>
      </tr>
      ${sia.tensions.map(t => `
        <tr>
          <td>${t.description}</td>
          <td>${t.impactedDomains.map(d => DOMAINS[d as keyof typeof DOMAINS]?.label || d).join(' / ')}</td>
          <td><span class="badge">${t.severity}</span></td>
          <td>${t.status}</td>
        </tr>
      `).join('')}
    </table>
  `}

  <h2>Plan d'Action (${sia.actions.length})</h2>
  ${sia.actions.length === 0 ? '<p>Aucune action planifiée.</p>' : `
    <table>
      <tr>
        <th>Action</th>
        <th>Priorité</th>
        <th>Statut</th>
        <th>Responsable</th>
      </tr>
      ${sia.actions.map(a => `
        <tr>
          <td>${a.title}</td>
          <td><span class="badge ${a.priority.toLowerCase()}">${a.priority}</span></td>
          <td><span class="badge ${a.status.toLowerCase()}">${a.status}</span></td>
          <td>${a.assignee || '-'}</td>
        </tr>
      `).join('')}
    </table>
  `}

  <footer>
    <p>Généré par ETICA - Outil d'Analyse Éthique des Systèmes d'Information Algorithmique</p>
    <p>Ce document est fourni à titre informatif et ne constitue pas un avis juridique.</p>
  </footer>
</body>
</html>
  `
}
