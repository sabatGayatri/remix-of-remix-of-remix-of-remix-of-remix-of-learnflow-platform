import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart as PieChartIcon } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AnalyticsPieChartProps {
  completionRate: number;
  doubtRate: number;
  avgTimeMinutes: number;
}

const chartConfig = {
  completed: { label: 'Completed', color: 'hsl(160 70% 45%)' },
  withDoubts: { label: 'With Doubts', color: 'hsl(var(--primary))' },
  remaining: { label: 'Remaining', color: 'hsl(var(--muted))' },
};

const AnalyticsPieChart = ({ completionRate, doubtRate, avgTimeMinutes }: AnalyticsPieChartProps) => {
  const pieData = [
    { name: 'Topics Completed', value: completionRate, color: 'hsl(160 70% 45%)' },
    { name: 'Topics with Doubts', value: doubtRate, color: 'hsl(var(--primary))' },
    { name: 'Remaining', value: Math.max(0, 100 - completionRate - doubtRate), color: 'hsl(var(--muted))' },
  ].filter(d => d.value > 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PieChartIcon className="w-5 h-5 text-primary" />
          Learning Progress Overview
        </CardTitle>
        <CardDescription>
          Student engagement and topic completion metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Pie Chart */}
          <ChartContainer config={chartConfig} className="h-[220px] w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />} 
                  formatter={(value: number) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Legend and Stats */}
          <div className="flex-1 space-y-4">
            {/* Legend */}
            <div className="space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm flex-1">{item.name}</span>
                  <span className="text-sm font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>

            {/* Avg Time Stat */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Quiz Time</p>
                  <p className="text-2xl font-bold">{avgTimeMinutes} min</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsPieChart;
