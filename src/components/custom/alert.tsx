import { AlertTriangleIcon, X } from 'lucide-react';

import { AlertDescription, AlertTitle, Alert as BaseAlert } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export function Alert({
  title,
  description,
  className,
  onCLose,
}: {
  title: string;
  description: string;
  className: string;
  onCLose?: () => void;
}) {
  return (
    <BaseAlert variant={'destructive'} className={cn('bg-card', className)}>
      <div className="flex-between">
        <div className="align-center gap-3">
          <AlertTriangleIcon size={16} className='-translate-y-0.5' />
          <AlertTitle className="text-base">{title}</AlertTitle>
        </div>
        <Button onClick={onCLose} className="cursor text-zinc-400">
          <X />
        </Button>
      </div>
      <AlertDescription className="pl-7">{description}</AlertDescription>
    </BaseAlert>
  );
}
