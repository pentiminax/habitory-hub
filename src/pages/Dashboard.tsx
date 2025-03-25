
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, Info } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';
import AnimatedButton from '@/components/common/AnimatedButton';
import ProgressChart from '@/components/dashboard/ProgressChart';
import { useHabits } from '@/hooks/useHabits';

const Dashboard = () => {
  const { 
    habits, 
    isLoading, 
    completionStatus, 
    createHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion
  } = useHabits();

  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [progressData, setProgressData] = useState<any[]>([]);

  useEffect(() => {
    document.title = 'Tableau de bord - Habitory';
    
    // Générer des données de progression pour le graphique
    // Dans une application réelle, ces données viendraient de Supabase
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const today = new Date().getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    
    const data = days.map((day, index) => {
      const dayIndex = (index + 1) % 7; // Convertir pour que Lundi soit 1, etc.
      const isToday = dayIndex === today;
      const isPast = today === 0 ? dayIndex < 7 : dayIndex < today;
      
      return {
        name: day,
        completed: isToday || isPast ? Math.floor(Math.random() * 3) + 1 : 0,
        total: 3
      };
    });
    
    setProgressData(data);
  }, []);

  const handleEdit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
      setEditingHabit(habit);
      setHabitFormOpen(true);
    }
  };

  const handleSubmitHabit = (values: any) => {
    if (editingHabit) {
      updateHabit({ 
        id: editingHabit.id, 
        data: values 
      });
    } else {
      createHabit(values);
    }
    
    setEditingHabit(null);
    setHabitFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Tableau de bord</h1>
            <p className="text-muted-foreground mt-1">
              Suivez vos habitudes et votre progression quotidienne
            </p>
          </div>
          
          <AnimatedButton
            onClick={() => {
              setEditingHabit(null);
              setHabitFormOpen(true);
            }}
            iconLeft={<PlusCircle className="w-5 h-5" />}
          >
            Nouvelle habitude
          </AnimatedButton>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ProgressChart 
              data={progressData} 
              title="Progression de la semaine" 
            />
          </div>
          
          <div className="glass-card p-5 flex flex-col h-full">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Résumé du jour
            </h3>
            
            <div className="space-y-4 flex-grow">
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span>Habitudes complétées</span>
                <span className="font-medium">
                  {Object.values(completionStatus).filter(v => v).length}/{habits.length}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span>Taux de complétion</span>
                <span className="font-medium">
                  {habits.length > 0 
                    ? Math.round((Object.values(completionStatus).filter(v => v).length / habits.length) * 100) 
                    : 0}%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span>Séries actives</span>
                <span className="font-medium">{habits.filter(h => h.streak > 0).length}</span>
              </div>
            </div>
            
            <Link to="/statistics" className="mt-4 self-end text-sm text-primary hover:text-primary/80 flex items-center gap-1">
              <Info className="w-4 h-4" />
              Voir les statistiques détaillées
            </Link>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-primary mb-6 mt-10">Mes habitudes</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="neo-card h-48 animate-pulse-slow">
                <div className="p-5 h-full flex flex-col">
                  <div className="bg-secondary h-5 w-20 rounded mb-3"></div>
                  <div className="bg-secondary h-7 w-3/4 rounded mb-2"></div>
                  <div className="bg-secondary h-4 w-1/2 rounded"></div>
                  <div className="mt-auto bg-secondary h-10 w-full rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {habits.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">Vous n'avez pas encore créé d'habitudes</p>
                <AnimatedButton
                  onClick={() => {
                    setEditingHabit(null);
                    setHabitFormOpen(true);
                  }}
                  iconLeft={<PlusCircle className="w-5 h-5" />}
                >
                  Créer ma première habitude
                </AnimatedButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    id={habit.id}
                    title={habit.title}
                    description={habit.description}
                    frequency={habit.frequency}
                    streak={habit.streak}
                    isCompleted={completionStatus[habit.id] || false}
                    onToggleComplete={() => toggleCompletion(habit)}
                    onEdit={() => handleEdit(habit.id)}
                    onDelete={() => deleteHabit(habit.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      <HabitForm 
        open={habitFormOpen}
        onClose={() => {
          setHabitFormOpen(false);
          setEditingHabit(null);
        }}
        onSubmit={handleSubmitHabit}
        initialValues={editingHabit || undefined}
        isEditing={!!editingHabit}
      />
    </div>
  );
};

export default Dashboard;
