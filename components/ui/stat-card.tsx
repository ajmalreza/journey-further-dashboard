import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { LucideIcon, Info } from "lucide-react";

interface StatCardProps {
  id: string;
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  tooltip?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  tooltip,
  className = "",
}: StatCardProps) {
  return (
    <Card className={`bg-white border border-gray-200 shadow-sm rounded-lg ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground flex items-center gap-2">
          <Icon className="h-4 w-4 text-card-foreground" />
          {title}
        </CardTitle>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-card-foreground mb-1">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

interface StatCardGridProps {
  cards: StatCardProps[];
  className?: string;
}

export function StatCardGrid({
  cards,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8",
}: StatCardGridProps) {
  return (
    <div className={className}>
      {cards.map((card) => (
        <StatCard key={card?.id} {...card} />
      ))}
    </div>
  );
}
