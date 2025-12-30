import Link from 'next/link'
import { ArrowLeft, Mail, MapPin, MessageSquare, Globe, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const contactReasons = [
  {
    icon: MessageSquare,
    title: 'Questions sur ETICA',
    description: 'Vous avez des questions sur l\'utilisation de la plateforme ou notre méthodologie.',
    email: 'support@gcea.org',
  },
  {
    icon: Users,
    title: 'Partenariats',
    description: 'Vous souhaitez collaborer avec le GCEA ou proposer un partenariat.',
    email: 'partnerships@gcea.org',
  },
  {
    icon: Globe,
    title: 'Presse et médias',
    description: 'Demandes d\'interviews, articles ou informations pour les médias.',
    email: 'press@gcea.org',
  },
]

export default function ContactPage() {
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

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Contactez-nous</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une question sur ETICA ou sur notre mission ? Nous sommes là pour vous aider.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {contactReasons.map((reason) => {
            const Icon = reason.icon
            return (
              <Card key={reason.title} className="text-center">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-2">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{reason.title}</CardTitle>
                  <CardDescription>{reason.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href={`mailto:${reason.email}`}
                    className="text-primary font-medium hover:underline"
                  >
                    {reason.email}
                  </a>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main contact info */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Global Council for Ethical AI</CardTitle>
            <CardDescription>Association loi 1901</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Email général</p>
                <a
                  href="mailto:contact@gcea.org"
                  className="text-primary hover:underline"
                >
                  contact@gcea.org
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Siège social</p>
                <p className="text-muted-foreground">Paris, France</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ teaser */}
        <div className="text-center py-8 bg-muted/50 rounded-2xl">
          <h2 className="text-xl font-semibold mb-2">Besoin d'aide rapidement ?</h2>
          <p className="text-muted-foreground mb-4">
            Consultez notre documentation et notre méthodologie pour trouver des réponses à vos questions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/methodology">Voir la méthodologie</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/about">En savoir plus sur le GCEA</Link>
            </Button>
          </div>
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
