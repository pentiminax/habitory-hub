
import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Calendar, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Données temporaires pour la démo
const weeklyData = [
  { name: 'Lun', completion: 70 },
  { name: 'Mar', completion: 90 },
  { name: 'Mer', completion: 40 },
  { name: 'Jeu', completion: 60 },
  { name: 'Ven', completion: 100 },
  { name: 'Sam', completion: 90 },
  { name: 'Dim', completion: 30 },
];

const monthlyData = [
  { name: 'Sem 1', completion: 65 },
  { name: 'Sem 2', completion: 75 },
  { name: 'Sem 3', completion: 85 },
  { name: 'Sem 4', completion: 70 },
];

const habitCompletionData = [
  { name: 'Méditation', value: 90 },
  { name: 'Lecture', value: 60 },
  { name: 'Sport', value: 45 },
  { name: 'Finances', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Statistics = () => {
  const [timeFrame, setTimeFrame] = useState('weekly');

  useEffect(() => {
    document.title = 'Statistiques - Habitory';
  }, []);

  // Personnalisation du tooltip pour les graphiques en ligne
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-border rounded-lg shadow-md">
          <p className="font-medium text-sm mb-1">{label}</p>
          <p className="text-sm text-blue-600">
            Taux de complétion: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Personnalisation du tooltip pour le graphique en secteur
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-border rounded-lg shadow-md">
          <p className="font-medium text-sm mb-1">{payload[0].name}</p>
          <p className="text-sm text-blue-600">
            Taux de complétion: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Statistiques</h1>
          <p className="text-muted-foreground mt-1">
            Visualisez votre progression et vos tendances
          </p>
        </div>
        
        <Tabs defaultValue="completion" className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="completion" className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                Taux de complétion
              </TabsTrigger>
              <TabsTrigger value="habits" className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4" />
                Par habitude
              </TabsTrigger>
            </TabsList>
            
            <div className="w-full sm:w-48">
              <Select
                value={timeFrame}
                onValueChange={setTimeFrame}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Cette semaine</SelectItem>
                  <SelectItem value="monthly">Ce mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="completion" className="glass-card p-6">
            <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Taux de complétion {timeFrame === 'weekly' ? 'hebdomadaire' : 'mensuel'}
            </h3>
            
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timeFrame === 'weekly' ? weeklyData : monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="completion" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    dot={{ r: 6, strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                    name="Taux de complétion"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 p-4 bg-secondary rounded-lg">
              <h4 className="font-medium mb-2">Analyse</h4>
              <p className="text-muted-foreground">
                {timeFrame === 'weekly' 
                  ? "Le taux de complétion moyen cette semaine est de 68%. Les jours avec les meilleurs résultats sont le vendredi et le mardi."
                  : "Le taux de complétion moyen ce mois est de 74%. Une amélioration constante est visible au cours des semaines 1 à 3."
                }
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="habits" className="glass-card p-6">
            <h3 className="text-xl font-medium mb-6 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Taux de complétion par habitude
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={habitCompletionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={1500}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {habitCompletionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-col justify-center">
                <h4 className="font-medium mb-4">Résumé par habitude</h4>
                
                <div className="space-y-4">
                  {habitCompletionData.map((habit, index) => (
                    <div key={index} className="bg-secondary p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{habit.name}</span>
                        <span>{habit.value}%</span>
                      </div>
                      <div className="w-full bg-secondary-foreground/10 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full animate-progress-fill" 
                          style={{ 
                            width: `${habit.value}%`, 
                            backgroundColor: COLORS[index % COLORS.length] 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 bg-secondary/30 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-4">Conseils pour améliorer vos habitudes</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="bg-primary/5 rounded-full p-1 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </span>
              <span>Établissez une heure fixe dans votre journée pour chaque habitude</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary/5 rounded-full p-1 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </span>
              <span>Commencez par de petites étapes pour éviter de vous décourager</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary/5 rounded-full p-1 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </span>
              <span>Célébrez vos réussites, même les plus petites</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary/5 rounded-full p-1 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </span>
              <span>Utilisez des rappels quotidiens pour ne pas oublier vos habitudes</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Statistics;
