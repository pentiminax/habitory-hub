
import { supabase } from '@/integrations/supabase/client';
import { Habit, HabitCompletion, Frequency } from '@/types/habit';
import { toast } from 'sonner';

export const fetchHabits = async (): Promise<Habit[]> => {
  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des habitudes:', error);
      toast.error('Impossible de récupérer vos habitudes');
      return [];
    }

    // Convertir la propriété 'frequency' en type Frequency
    const habitsWithCorrectTypes = data.map(habit => ({
      ...habit,
      frequency: habit.frequency as Frequency
    }));

    return habitsWithCorrectTypes || [];
  } catch (error) {
    console.error('Exception lors de la récupération des habitudes:', error);
    toast.error('Une erreur est survenue lors de la récupération de vos habitudes');
    return [];
  }
};

export const createHabit = async (habit: Omit<Habit, 'id' | 'streak' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Habit | null> => {
  try {
    // Obtenir l'utilisateur actuel
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Erreur: aucun utilisateur connecté');
      toast.error('Vous devez être connecté pour créer une habitude');
      return null;
    }

    const userId = session.user.id;

    const { data, error } = await supabase
      .from('habits')
      .insert({
        title: habit.title,
        description: habit.description || null,
        frequency: habit.frequency,
        streak: 0,
        color: habit.color || 'blue',
        user_id: userId // Ajouter l'ID de l'utilisateur ici
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création de l\'habitude:', error);
      toast.error('Impossible de créer l\'habitude');
      return null;
    }

    toast.success('Habitude créée avec succès');
    return {
      ...data,
      frequency: data.frequency as Frequency
    };
  } catch (error) {
    console.error('Exception lors de la création de l\'habitude:', error);
    toast.error('Une erreur est survenue lors de la création de l\'habitude');
    return null;
  }
};

export const updateHabit = async (id: string, habit: Partial<Habit>): Promise<Habit | null> => {
  try {
    const { data, error } = await supabase
      .from('habits')
      .update(habit)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'habitude:', error);
      toast.error('Impossible de mettre à jour l\'habitude');
      return null;
    }

    toast.success('Habitude mise à jour avec succès');
    return {
      ...data,
      frequency: data.frequency as Frequency
    };
  } catch (error) {
    console.error('Exception lors de la mise à jour de l\'habitude:', error);
    toast.error('Une erreur est survenue lors de la mise à jour de l\'habitude');
    return null;
  }
};

export const deleteHabit = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression de l\'habitude:', error);
      toast.error('Impossible de supprimer l\'habitude');
      return false;
    }

    toast.success('Habitude supprimée avec succès');
    return true;
  } catch (error) {
    console.error('Exception lors de la suppression de l\'habitude:', error);
    toast.error('Une erreur est survenue lors de la suppression de l\'habitude');
    return false;
  }
};

export const toggleHabitCompletion = async (habit: Habit): Promise<boolean> => {
  try {
    // Vérifier si l'habitude a été complétée aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existingCompletions, error: fetchError } = await supabase
      .from('habit_completions')
      .select('*')
      .eq('habit_id', habit.id)
      .eq('completed_date', today);
    
    if (fetchError) {
      console.error('Erreur lors de la vérification de complétion:', fetchError);
      toast.error('Impossible de vérifier le statut de l\'habitude');
      return false;
    }
    
    // Obtenir l'utilisateur actuel
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Erreur: aucun utilisateur connecté');
      toast.error('Vous devez être connecté pour modifier une habitude');
      return false;
    }

    const userId = session.user.id;
    
    // Si déjà complété, on supprime la complétion
    if (existingCompletions && existingCompletions.length > 0) {
      const { error: deleteError } = await supabase
        .from('habit_completions')
        .delete()
        .eq('id', existingCompletions[0].id);
      
      if (deleteError) {
        console.error('Erreur lors de la suppression de la complétion:', deleteError);
        toast.error('Impossible de marquer l\'habitude comme non complétée');
        return false;
      }
      
      // Mettre à jour le streak si nécessaire
      if (habit.streak > 0) {
        await supabase
          .from('habits')
          .update({ streak: habit.streak - 1 })
          .eq('id', habit.id);
      }
      
      toast.success('Habitude marquée comme non complétée');
      return true;
    }
    
    // Sinon, on ajoute une nouvelle complétion
    const { error: insertError } = await supabase
      .from('habit_completions')
      .insert({
        habit_id: habit.id,
        completed_date: today,
        user_id: userId // Ajouter l'ID de l'utilisateur ici
      });
    
    if (insertError) {
      console.error('Erreur lors de l\'ajout de la complétion:', insertError);
      toast.error('Impossible de marquer l\'habitude comme complétée');
      return false;
    }
    
    // Mettre à jour le streak
    await supabase
      .from('habits')
      .update({ streak: habit.streak + 1 })
      .eq('id', habit.id);
    
    toast.success('Habitude complétée avec succès');
    return true;
  } catch (error) {
    console.error('Exception lors de la gestion de la complétion:', error);
    toast.error('Une erreur est survenue');
    return false;
  }
};

export const checkHabitCompletionStatus = async (habitIds: string[]): Promise<Record<string, boolean>> => {
  if (!habitIds.length) return {};
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('habit_completions')
      .select('habit_id')
      .in('habit_id', habitIds)
      .eq('completed_date', today);
    
    if (error) {
      console.error('Erreur lors de la vérification des statuts:', error);
      return {};
    }
    
    const completionStatus: Record<string, boolean> = {};
    
    // Initialiser tous à false
    habitIds.forEach(id => {
      completionStatus[id] = false;
    });
    
    // Marquer ceux qui sont complétés
    data?.forEach(completion => {
      completionStatus[completion.habit_id] = true;
    });
    
    return completionStatus;
  } catch (error) {
    console.error('Exception lors de la vérification des statuts:', error);
    return {};
  }
};
