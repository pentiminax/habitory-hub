
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute top-0 inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/50 opacity-90"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl"></div>
      </div>

      {/* Contenu */}
      <div className="w-full max-w-4xl mx-auto text-center">
        <div className="animate-fade-in opacity-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary">
            Construisez des habitudes <span className="text-primary">durables</span>
          </h1>
        </div>

        <div className="animate-fade-in opacity-0 animate-delay-200">
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Suivez vos habitudes quotidiennes, hebdomadaires et mensuelles. Visualisez vos progrès et restez motivé pour atteindre vos objectifs.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in opacity-0 animate-delay-300">
          <Link 
            to="/dashboard" 
            className="btn-primary flex items-center gap-2 group"
          >
            Commencer maintenant
            <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            to="/habits" 
            className="btn-secondary"
          >
            Découvrir les fonctionnalités
          </Link>
        </div>
      </div>

      {/* Features en bas */}
      <div className="w-full max-w-4xl mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in opacity-0 animate-delay-400">
        {[
          {
            title: "Simplicité",
            description: "Interface intuitive conçue pour un usage quotidien sans friction"
          },
          {
            title: "Visualisation",
            description: "Suivez votre progression avec des graphiques et statistiques clairs"
          },
          {
            title: "Flexibilité",
            description: "Des habitudes quotidiennes, hebdomadaires ou mensuelles adaptées à vos besoins"
          }
        ].map((feature, index) => (
          <div 
            key={index} 
            className="glass-card p-6 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]"
          >
            <h3 className="text-lg font-semibold text-primary mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
