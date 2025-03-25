
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Habit, Frequency } from '@/types/habit';
import { 
  fetchHabits, 
  createHabit, 
  updateHabit, 
  deleteHabit,
  toggleHabitCompletion,
  checkHabitCompletionStatus
} from '@/services/habitService';
import { supabase } from '@/integrations/supabase/client';

export const useHabits = () => {
  const queryClient = useQueryClient();
  const [filterFrequency, setFilterFrequency] = useState<'all' | Frequency>('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [completionStatus, setCompletionStatus] = useState<Record<string, boolean>>({});

  // Récupérer toutes les habitudes
  const { data: habits = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['habits'],
    queryFn: fetchHabits,
  });

  // Vérifier les statuts de complétion
  const checkCompletions = useCallback(async (habits: Habit[]) => {
    if (habits.length === 0) return;
    
    const habitIds = habits.map(h => h.id);
    const statuses = await checkHabitCompletionStatus(habitIds);
    setCompletionStatus(statuses);
  }, []);

  // Effet pour mettre à jour les filtres
  useEffect(() => {
    let result = [...habits];
    
    if (filterFrequency !== 'all') {
      result = result.filter(habit => habit.frequency === filterFrequency);
    }
    
    if (filterStatus === 'completed') {
      result = result.filter(habit => completionStatus[habit.id]);
    } else if (filterStatus === 'pending') {
      result = result.filter(habit => !completionStatus[habit.id]);
    }
    
    setFilteredHabits(result);
  }, [habits, filterFrequency, filterStatus, completionStatus]);

  // Vérifier les statuts à chaque changement de liste d'habitudes
  useEffect(() => {
    checkCompletions(habits);
  }, [habits, checkCompletions]);

  // Écouter les changements en temps réel
  useEffect(() => {
    const subscription = supabase
      .channel('habits-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'habits' 
      }, () => {
        refetch();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'habit_completions' 
      }, () => {
        checkCompletions(habits);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [habits, refetch, checkCompletions]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Habit> }) => 
      updateHabit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    }
  });

  const toggleCompletionMutation = useMutation({
    mutationFn: toggleHabitCompletion,
    onSuccess: () => {
      checkCompletions(habits);
    }
  });

  return {
    habits,
    filteredHabits,
    isLoading,
    isError,
    filterFrequency,
    setFilterFrequency,
    filterStatus,
    setFilterStatus,
    completionStatus,
    createHabit: createMutation.mutate,
    updateHabit: updateMutation.mutate,
    deleteHabit: deleteMutation.mutate,
    toggleCompletion: (habit: Habit) => toggleCompletionMutation.mutate(habit),
    refetch
  };
};
