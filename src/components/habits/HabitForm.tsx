
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calendar, Clock, AlignLeft } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const habitSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(100, 'Le titre ne doit pas dépasser 100 caractères'),
  description: z.string().max(500, 'La description ne doit pas dépasser 500 caractères').optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  reminder: z.boolean().optional(),
});

type HabitFormValues = z.infer<typeof habitSchema>;

interface HabitFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: HabitFormValues) => void;
  initialValues?: Partial<HabitFormValues>;
  isEditing?: boolean;
}

const HabitForm = ({
  open,
  onClose,
  onSubmit,
  initialValues = {
    title: '',
    description: '',
    frequency: 'daily',
    reminder: false,
  },
  isEditing = false,
}: HabitFormProps) => {
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = (values: HabitFormValues) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier une habitude' : 'Créer une nouvelle habitude'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Ex: Méditer 10 minutes" {...field} className="pl-10" />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnelle)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea 
                        placeholder="Détails supplémentaires..." 
                        {...field} 
                        className="pl-10 min-h-[100px]"
                      />
                      <AlignLeft className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fréquence</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Clock className="absolute left-0 top-1 h-5 w-5 text-muted-foreground" />
                      <div className="pl-10">
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="daily" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Quotidienne</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="weekly" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Hebdomadaire</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="monthly" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Mensuelle</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {isEditing ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitForm;
