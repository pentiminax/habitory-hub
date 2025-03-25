
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, BarChart, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkUser();

    // Souscrire aux changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Si l'utilisateur n'est pas connecté, ne pas afficher la navbar complète
  if (!isLoggedIn && location.pathname !== '/') {
    return null;
  }

  // Pour la page d'accueil, nous afficherons toujours une barre de navigation simplifiée
  if (location.pathname === '/' && !isLoggedIn) {
    return (
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">Habitory</span>
            </Link>
            
            <Link 
              to="/auth" 
              className="transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/5"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  const navLinks = [
    { name: 'Accueil', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Tableau de bord', path: '/dashboard', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Habitudes', path: '/habits', icon: <User className="w-5 h-5" /> },
    { name: 'Statistiques', path: '/statistics', icon: <BarChart className="w-5 h-5" /> },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">Habitory</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-all duration-300 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
                    location.pathname === link.path
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-primary hover:bg-primary/5 transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-all duration-300 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3 ${
                location.pathname === link.path
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
