
import React from 'react';
import { Confession } from '@/utils/storage';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface ConfessionCardProps {
  confession: Confession;
  className?: string;
}

export const ConfessionCard = ({ confession, className }: ConfessionCardProps) => {
  // Format the date
  const formattedDate = new Date(confession.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  
  // Calculate time until expiration
  const timeUntilExpiration = confession.expiresAt - Date.now();
  const hoursLeft = Math.max(0, Math.floor(timeUntilExpiration / (1000 * 60 * 60)));

  return (
    <div 
      className={cn(
        'glass-card rounded-xl p-6 transition-all animate-fade-in animate-slide-up',
        'hover:shadow-lg hover:shadow-primary/5 hover:border-primary/10',
        className
      )}
      style={{ animationDelay: `${Math.random() * 0.5}s` }}
    >
      <p className="text-base leading-relaxed mb-4">{confession.content}</p>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Anonymous</span>
        <div className="flex items-center gap-1">
          <span>{formattedDate}</span>
          <span className="mx-1">•</span>
          <Clock className="h-3 w-3" />
          <span>Expires in {hoursLeft}h</span>
        </div>
      </div>
    </div>
  );
};

export default ConfessionCard;
