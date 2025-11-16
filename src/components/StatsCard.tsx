import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  status?: 'total' | 'pending' | 'interview' | 'declined';
}

export const StatsCard = ({ title, value, icon: Icon, description, status = 'total' }: StatsCardProps) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'total':
        return {
          cardBg: 'bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100',
          iconBg: 'bg-gradient-to-r from-purple-500 to-indigo-600',
          iconColor: 'text-white',
          titleColor: 'text-purple-700',
          valueColor: 'text-purple-900'
        };
      case 'pending':
        return {
          cardBg: 'bg-gradient-to-br from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100',
          iconBg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          iconColor: 'text-white',
          titleColor: 'text-yellow-700',
          valueColor: 'text-orange-900'
        };
      case 'interview':
        return {
          cardBg: 'bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100',
          iconBg: 'bg-gradient-to-r from-green-500 to-emerald-600',
          iconColor: 'text-white',
          titleColor: 'text-green-700',
          valueColor: 'text-emerald-900'
        };
      case 'declined':
        return {
          cardBg: 'bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100',
          iconBg: 'bg-gradient-to-r from-red-500 to-pink-600',
          iconColor: 'text-white',
          titleColor: 'text-red-700',
          valueColor: 'text-red-900'
        };
      default:
        return {
          cardBg: 'bg-gradient-to-br from-card to-card/80',
          iconBg: '[background:hsl(270_100%_65%/0.1),hsl(270_60%_65%/0.05)]',
          iconColor: 'text-primary',
          titleColor: 'text-muted-foreground',
          valueColor: 'text-foreground'
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <Card className={`border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${styles.cardBg}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={`text-sm font-medium ${styles.titleColor}`}>{title}</p>
            <p className={`text-3xl font-bold ${styles.valueColor}`}>{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={`p-3 ${styles.iconBg} rounded-xl transition-all duration-200 hover:scale-110`}>
            <Icon className={`h-6 w-6 ${styles.iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
