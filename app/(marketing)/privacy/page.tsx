import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
              E
            </div>
            <span className="text-xl font-semibold">ETICA</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
            <p className="text-muted-foreground">Dernière mise à jour : Décembre 2024</p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Responsable du traitement</h2>
            <p className="text-muted-foreground mb-4">
              Le responsable du traitement des données personnelles collectées via la plateforme
              ETICA est le <strong>Global Council for Ethical AI</strong>, association loi 1901.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Données collectées</h2>
            <p className="text-muted-foreground mb-4">
              Nous collectons les données suivantes dans le cadre de l'utilisation de la plateforme :
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Données d'identification</strong> : nom, prénom, adresse email professionnelle</li>
              <li><strong>Données de connexion</strong> : logs de connexion, adresse IP</li>
              <li><strong>Données d'utilisation</strong> : modélisations de SIA, arbitrages, actions documentées</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Finalités du traitement</h2>
            <p className="text-muted-foreground mb-4">
              Les données sont collectées pour les finalités suivantes :
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Fourniture du service d'évaluation éthique des SIA</li>
              <li>Gestion de votre compte utilisateur</li>
              <li>Amélioration de la plateforme et du moteur de détection des tensions</li>
              <li>Communication sur les évolutions du service (avec votre consentement)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Base légale</h2>
            <p className="text-muted-foreground mb-4">
              Le traitement de vos données repose sur :
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>L'exécution du contrat</strong> : pour la fourniture du service</li>
              <li><strong>L'intérêt légitime</strong> : pour l'amélioration de la plateforme</li>
              <li><strong>Le consentement</strong> : pour les communications marketing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Conservation des données</h2>
            <p className="text-muted-foreground mb-4">
              Vos données sont conservées pendant la durée d'utilisation de votre compte, puis
              archivées pendant une durée de 3 ans après la clôture du compte, conformément aux
              obligations légales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Vos droits</h2>
            <p className="text-muted-foreground mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement (« droit à l'oubli »)</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Pour exercer ces droits, contactez-nous via la page{' '}
              <Link href="/contact" className="text-primary hover:underline">Contact</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Sécurité</h2>
            <p className="text-muted-foreground">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
              protéger vos données contre tout accès non autorisé, modification, divulgation ou
              destruction. Les données sont chiffrées en transit et au repos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Cookies</h2>
            <p className="text-muted-foreground">
              La plateforme utilise des cookies strictement nécessaires au fonctionnement du service
              (authentification, préférences). Aucun cookie publicitaire ou de tracking tiers n'est
              utilisé.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Global Council for Ethical AI. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
