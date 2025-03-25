
import { useEffect } from 'react';
import Hero from '@/components/home/Hero';
import Navbar from '@/components/layout/Navbar';

const Index = () => {
  useEffect(() => {
    document.title = 'Habitory - Suivez vos habitudes quotidiennes';
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Hero />
        
        {/* Section Fonctionnalités */}
        <section className="py-20 px-4 bg-secondary/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-primary mb-4">Comment ça fonctionne</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Développez des habitudes positives et atteignez vos objectifs avec une approche structurée et motivante.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Créez vos habitudes",
                  description: "Définissez vos habitudes avec leur fréquence (quotidienne, hebdomadaire ou mensuelle) et personnalisez-les selon vos besoins.",
                  delay: "0"
                },
                {
                  title: "Suivez votre progression",
                  description: "Marquez vos habitudes comme complétées chaque jour et construisez des séries ininterrompues pour rester motivé.",
                  delay: "100"
                },
                {
                  title: "Analysez vos performances",
                  description: "Visualisez votre progression avec des graphiques clairs et identifiez vos tendances pour améliorer votre constance.",
                  delay: "200"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="neo-card p-8 text-center hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${feature.delay}ms` }}
                >
                  <div className="bg-primary/5 w-12 h-12 rounded-full flex items-center justify-center text-primary mx-auto mb-5">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Section Témoignages */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-primary mb-4">Ils ont transformé leurs habitudes</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez comment Habitory a aidé d'autres personnes à développer des habitudes positives durables.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  quote: "Grâce à Habitory, j'ai réussi à méditer quotidiennement pendant 6 mois. La visualisation de ma progression a été particulièrement motivante.",
                  author: "Sophie L."
                },
                {
                  quote: "Le suivi hebdomadaire des habitudes m'a permis de structurer mon temps et d'atteindre mes objectifs de lecture. Une application simple mais efficace.",
                  author: "Marc T."
                }
              ].map((testimonial, index) => (
                <div 
                  key={index} 
                  className="glass-card p-8"
                >
                  <p className="text-lg italic text-foreground mb-4">{testimonial.quote}</p>
                  <p className="text-primary font-medium">— {testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Habitory</h2>
          <p className="mb-6">Construisez des habitudes durables, un jour à la fois.</p>
          <div className="text-sm opacity-80">
            © {new Date().getFullYear()} Habitory. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
