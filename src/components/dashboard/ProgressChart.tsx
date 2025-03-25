
import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';

interface ProgressData {
  name: string;
  completed: number;
  total: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  title?: string;
  className?: string;
}

const ProgressChart = ({ data, title, className }: ProgressChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // Animation de chargement des données
    const timer = setTimeout(() => {
      setChartData(data);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [data]);

  // Personnalisation du tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const completionRate = Math.round((payload[0].value / payload[1].payload.total) * 100);
      
      return (
        <div className="bg-white p-3 border border-border rounded-lg shadow-md">
          <p className="font-medium text-sm mb-1">{label}</p>
          <p className="text-sm text-blue-600">
            {payload[0].value} sur {payload[1].payload.total} habitudes
          </p>
          <p className="text-sm font-medium mt-1">
            Taux de complétion: {completionRate}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("neo-card p-5", className)}>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 0, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="completed" 
              radius={[4, 4, 0, 0]} 
              barSize={30}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => {
                const completionRate = entry.completed / entry.total;
                let color = '#94a3b8'; // Default gray
                
                if (completionRate >= 0.8) color = '#10b981'; // Green for high completion
                else if (completionRate >= 0.5) color = '#0ea5e9'; // Blue for medium completion
                else if (completionRate >= 0.3) color = '#f59e0b'; // Amber for low completion
                else if (completionRate > 0) color = '#f43f5e'; // Red for very low completion
                
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
