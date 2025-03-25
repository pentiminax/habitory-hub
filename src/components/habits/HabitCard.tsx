
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Edit, Trash2, Calendar, MoreHorizontal } from 'lucide-react';
import AnimatedButton from '../common/AnimatedButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface HabitCardProps {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  streak: number;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const HabitCard = ({
  id,
  title,
  description,
  frequency,
  streak,
  isCompleted,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const frequencyLabels = {
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`neo-card overflow-hidden h-full transition-all duration-300 ${
        isCompleted ? 'border-l-4 border-green-500' : 'border-l-4 border-transparent'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5 h-full flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center">
              <span className={`tag mr-2 ${
                frequency === 'daily' ? 'bg-blue-100 text-blue-800' :
                frequency === 'weekly' ? 'bg-purple-100 text-purple-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {frequencyLabels[frequency]}
              </span>
              {streak > 0 && (
                <span className="tag bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {streak} {streak === 1 ? 'jour' : 'jours'}
                </span>
              )}
            </div>
            <h3 className="font-medium text-lg mt-2 text-primary">{title}</h3>
            {description && (
              <p className="text-muted-foreground text-sm mt-1">{description}</p>
            )}
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1 text-muted-foreground hover:text-primary rounded-full hover:bg-secondary transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="flex flex-col gap-1">
                <button 
                  onClick={onEdit}
                  className="flex items-center gap-2 p-2 text-sm hover:bg-secondary rounded-md transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button 
                  onClick={onDelete}
                  className="flex items-center gap-2 p-2 text-sm hover:bg-red-50 text-red-600 hover:text-red-700 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="mt-auto">
          <AnimatedButton
            onClick={onToggleComplete}
            variant={isCompleted ? "outline" : "primary"}
            className={`w-full mt-4 ${
              isCompleted 
                ? 'border-green-500 text-green-600 hover:bg-green-50' 
                : ''
            }`}
            iconLeft={isCompleted ? <CheckCircle className="w-5 h-5" /> : undefined}
          >
            {isCompleted ? 'Complété aujourd\'hui' : 'Marquer comme complété'}
          </AnimatedButton>
        </div>
      </div>
    </motion.div>
  );
};

export default HabitCard;
