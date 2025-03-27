
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

const StatsCard = ({ title, value, icon, trend }: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
            {icon}
          </div>
        </div>
        {trend && (
          <div className="flex items-center mt-4">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs text-green-500 font-medium">{trend.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
