
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Calendar, Info } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';
import AnimatedButton from '@/components/common/AnimatedButton';
import ProgressChart from '@/components/dashboard/ProgressChart';

// Specific type for frequency
type Frequency = 'daily' | 'weekly' | 'monthly';

// Typed mockHabits
const mockHabits = [
  {
    id: '1',
    title: 'Méditer 10 minutes',
    description: 'Méditation de pleine conscience',
    frequency: 'daily' as Frequency,
    streak: 5,
    isCompleted: false
  },
  {
    id: '2',
    title: 'Faire du sport',
    description: '30 minutes minimum d\'exercice',
    frequency: 'weekly' as Frequency,
    streak: 2,
    isCompleted: true
  },
  {
    id: '3',
    title: 'Lire un livre',
    description: '20 pages par jour',
    frequency: 'daily' as Frequency,
    streak: 0,
    isCompleted: false
  },
  {
    id: '4',
    title: 'Révision mensuelle des finances',
    description: 'Examiner le budget et les dépenses',
    frequency: 'monthly' as Frequency,
    streak: 3,
    isCompleted: false
  }
];

const progressData = [
  { name: 'Lun', completed: 2, total: 3 },
  { name: 'Mar', completed: 3, total: 3 },
  { name: 'Mer', completed: 1, total: 3 },
  { name: 'Jeu', completed: 2, total: 3 },
  { name: 'Ven', completed: 3, total: 3 },
  { name: 'Sam', completed: 3, total: 3 },
  { name: 'Dim', completed: 0, total: 3 },
];

const Dashboard = () => {
  const [habits, setHabits] = useState(mockHabits);
  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'Tableau de bord - Habitory';
    // Simuler un chargement de données
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleComplete = (id: string) => {
    setHabits(habits.map(habit => 
      habit.id === id 
        ? { ...habit, isCompleted: !habit.isCompleted } 
        : habit
    ));
    
    const habit = habits.find(h => h.id === id);
    if (habit) {
      toast(habit.isCompleted ? "Habitude marquée comme non complétée" : "Habitude complétée !", {
        description: habit.title,
        action: {
          label: "Annuler",
          onClick: () => toggleComplete(id)
        }
      });
    }
  };

  const handleEdit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
      setEditingHabit(habit);
      setHabitFormOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
      toast(`Habitude supprimée: ${habit.title}`, {
        description: "Cette action ne peut pas être annulée",
      });
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  const handleSubmitHabit = (values: any) => {
    if (editingHabit) {
      setHabits(habits.map(habit => 
        habit.id === editingHabit.id 
          ? { ...habit, ...values } 
          : habit
      ));
      toast("Habitude modifiée", {
        description: values.title,
      });
    } else {
      const newHabit = {
        id: Date.now().toString(),
        ...values,
        streak: 0,
        isCompleted: false
      };
      setHabits([...habits, newHabit]);
      toast("Nouvelle habitude créée", {
        description: values.title,
      });
    }
    
    setEditingHabit(null);
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
                <span className="font-medium">{habits.filter(h => h.isCompleted).length}/{habits.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span>Taux de complétion</span>
                <span className="font-medium">{habits.length > 0 ? Math.round((habits.filter(h => h.isCompleted).length / habits.length) * 100) : 0}%</span>
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
                    isCompleted={habit.isCompleted}
                    onToggleComplete={() => toggleComplete(habit.id)}
                    onEdit={() => handleEdit(habit.id)}
                    onDelete={() => handleDelete(habit.id)}
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
