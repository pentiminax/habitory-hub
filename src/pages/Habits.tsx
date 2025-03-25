
import { useState, useEffect } from 'react';
import { Calendar, Filter, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';
import AnimatedButton from '@/components/common/AnimatedButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Type definition for frequency
type Frequency = 'daily' | 'weekly' | 'monthly';

// Typed mock data for the demo
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

const Habits = () => {
  const [habits, setHabits] = useState(mockHabits);
  const [filteredHabits, setFilteredHabits] = useState(mockHabits);
  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [filterFrequency, setFilterFrequency] = useState<'all' | Frequency>('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    document.title = 'Mes Habitudes - Habitory';
    
    // Appliquer les filtres
    let result = habits;
    
    if (filterFrequency !== 'all') {
      result = result.filter(habit => habit.frequency === filterFrequency);
    }
    
    if (filterStatus === 'completed') {
      result = result.filter(habit => habit.isCompleted);
    } else if (filterStatus === 'pending') {
      result = result.filter(habit => !habit.isCompleted);
    }
    
    setFilteredHabits(result);
  }, [habits, filterFrequency, filterStatus]);

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
            <h1 className="text-3xl font-bold text-primary">Mes habitudes</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos habitudes et votre routine
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
        
        <div className="bg-secondary/30 p-4 rounded-lg mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-64">
              <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Filter className="w-4 h-4" />
                Filtrer par fréquence
              </label>
              <Select
                value={filterFrequency}
                onValueChange={(value) => setFilterFrequency(value as 'all' | Frequency)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les fréquences" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les fréquences</SelectItem>
                  <SelectItem value="daily">Quotidienne</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuelle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-64">
              <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Filtrer par statut
              </label>
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="completed">Complétées</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {filteredHabits.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              {habits.length === 0 
                ? "Vous n'avez pas encore créé d'habitudes" 
                : "Aucune habitude ne correspond à vos filtres"
              }
            </p>
            {habits.length === 0 && (
              <AnimatedButton
                onClick={() => {
                  setEditingHabit(null);
                  setHabitFormOpen(true);
                }}
                iconLeft={<PlusCircle className="w-5 h-5" />}
              >
                Créer ma première habitude
              </AnimatedButton>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHabits.map(habit => (
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

export default Habits;
