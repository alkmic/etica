import Link from 'next/link'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Conditions Générales d'Utilisation</h1>
          <p className="text-muted-foreground">Dernière mise à jour : Décembre 2024</p>
        </div>
      </div>

      <div className="prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Objet</h2>
          <p className="text-muted-foreground mb-4">
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et
            l'utilisation de la plateforme ETICA, développée par le Global Council for Ethical AI
            (GCEA), association loi 1901.
          </p>
          <p className="text-muted-foreground">
            ETICA est un outil d'évaluation éthique des Systèmes d'Intelligence Artificielle (SIA)
            permettant d'identifier les tensions éthiques, de documenter les arbitrages et de
            suivre les actions de mitigation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Acceptation des CGU</h2>
          <p className="text-muted-foreground">
            L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes
            CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser la plateforme.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Inscription et compte</h2>
          <p className="text-muted-foreground mb-4">
            Pour utiliser ETICA, vous devez créer un compte en fournissant des informations exactes
            et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion.
          </p>
          <p className="text-muted-foreground">
            Vous vous engagez à nous informer immédiatement de toute utilisation non autorisée de
            votre compte.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Utilisation du service</h2>
          <p className="text-muted-foreground mb-4">
            Vous vous engagez à utiliser ETICA de manière conforme à sa destination, à savoir
            l'évaluation éthique de systèmes d'IA. Vous vous interdisez notamment de :
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Utiliser la plateforme à des fins illégales ou contraires aux bonnes mœurs</li>
            <li>Tenter de compromettre la sécurité ou le fonctionnement de la plateforme</li>
            <li>Reproduire ou distribuer le contenu de la plateforme sans autorisation</li>
            <li>Utiliser la plateforme pour collecter des données personnelles de tiers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Propriété intellectuelle</h2>
          <p className="text-muted-foreground mb-4">
            La plateforme ETICA, son code source, son design, ses contenus et sa méthodologie
            sont la propriété exclusive du GCEA ou de ses partenaires.
          </p>
          <p className="text-muted-foreground">
            Les modélisations et contenus que vous créez sur la plateforme restent votre propriété.
            Vous accordez au GCEA une licence d'utilisation à des fins d'amélioration du service
            (données agrégées et anonymisées uniquement).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Limitation de responsabilité</h2>
          <p className="text-muted-foreground mb-4">
            ETICA est un outil d'aide à l'évaluation éthique. Les résultats fournis (tensions
            détectées, suggestions) ne constituent pas un avis juridique ou une certification.
          </p>
          <p className="text-muted-foreground">
            Le GCEA ne peut être tenu responsable des décisions prises sur la base des informations
            fournies par la plateforme. L'utilisateur reste seul responsable de ses arbitrages et
            de la conformité de ses systèmes d'IA.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Disponibilité du service</h2>
          <p className="text-muted-foreground">
            Le GCEA s'efforce d'assurer la disponibilité de la plateforme mais ne garantit pas un
            fonctionnement ininterrompu. Des opérations de maintenance peuvent être effectuées,
            entraînant une indisponibilité temporaire.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Modification des CGU</h2>
          <p className="text-muted-foreground">
            Le GCEA se réserve le droit de modifier les présentes CGU à tout moment. Les
            utilisateurs seront informés des modifications substantielles par email ou notification
            sur la plateforme.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Droit applicable</h2>
          <p className="text-muted-foreground">
            Les présentes CGU sont régies par le droit français. Tout litige relatif à leur
            interprétation ou exécution sera soumis aux tribunaux compétents de Paris.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Contact</h2>
          <p className="text-muted-foreground">
            Pour toute question relative aux présentes CGU, vous pouvez nous contacter via la
            page{' '}
            <Link href="/contact" className="text-primary hover:underline">Contact</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
