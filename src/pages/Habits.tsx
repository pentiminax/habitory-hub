
import { useState, useEffect } from 'react';
import { Calendar, Filter, PlusCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import HabitCard from '@/components/habits/HabitCard';
import HabitForm from '@/components/habits/HabitForm';
import AnimatedButton from '@/components/common/AnimatedButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHabits } from '@/hooks/useHabits';
import { Frequency } from '@/types/habit';

const Habits = () => {
  const {
    filteredHabits,
    isLoading,
    filterFrequency,
    setFilterFrequency,
    filterStatus,
    setFilterStatus,
    completionStatus,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion
  } = useHabits();

  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);

  useEffect(() => {
    document.title = 'Mes Habitudes - Habitory';
  }, []);

  const handleEdit = (id: string) => {
    const habit = filteredHabits.find(h => h.id === id);
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
        ) : filteredHabits.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              {filteredHabits.length === 0 
                ? "Vous n'avez pas encore créé d'habitudes" 
                : "Aucune habitude ne correspond à vos filtres"
              }
            </p>
            {filteredHabits.length === 0 && (
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
                isCompleted={completionStatus[habit.id] || false}
                onToggleComplete={() => toggleCompletion(habit)}
                onEdit={() => handleEdit(habit.id)}
                onDelete={() => deleteHabit(habit.id)}
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
