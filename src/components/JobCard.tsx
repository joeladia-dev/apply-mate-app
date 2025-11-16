import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { JobType, JobStatus } from '@/types/job';
import { Building2, MapPin, Calendar, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: JobType;
  onEdit: (job: JobType) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  [JobStatus.Pending]: {
    label: 'Pending',
    className:
      'bg-status-pending/10 text-status-pending border-status-pending/20',
  },
  [JobStatus.Interview]: {
    label: 'Interview',
    className:
      'bg-status-interview/10 text-status-interview border-status-interview/20',
  },
  [JobStatus.Declined]: {
    label: 'Declined',
    className:
      'bg-status-declined/10 text-status-declined border-status-declined/20',
  },
};

const modeConfig = {
  'full-time': {
    label: 'Full-time',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  'part-time': {
    label: 'Part-time',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  internship: {
    label: 'Internship',
    className: 'bg-orange-100 text-orange-700 border-orange-200',
  },
};

export const JobCard = ({ job, onEdit, onDelete }: JobCardProps) => {
  const status = statusConfig[job.status as JobStatus];
  const mode = modeConfig[job.mode as keyof typeof modeConfig];

  return (
    <Card className='group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-border/60 hover:border-primary/20 overflow-hidden bg-gradient-to-br from-slate-50/30 via-gray-50/20 to-neutral-50/30'>
      <CardHeader className='pb-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex-1 space-y-2'>
            <h3 className='font-bold text-xl text-foreground group-hover:text-primary transition-colors leading-tight'>
              {job.position}
            </h3>
            <div className='flex items-center gap-2 text-sm text-muted-foreground/80'>
              <div className='p-1.5 rounded-md bg-purple-100'>
                <Building2 className='h-3.5 w-3.5 text-purple-600' />
              </div>
              <span className='font-medium'>{job.company}</span>
            </div>
          </div>
          <Badge
            className={`${status.className} font-medium border-0 px-3 py-1.5`}
            variant='secondary'
          >
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='pb-4 space-y-3'>
        <div className='grid grid-cols-1 gap-2'>
          <div className='flex items-center gap-3 text-sm text-muted-foreground'>
            <div className='p-1.5 rounded-md bg-blue-100 flex-shrink-0'>
              <MapPin className='h-3.5 w-3.5 text-blue-600' />
            </div>
            <span className='font-medium'>{job.location}</span>
          </div>

          <div className='flex items-center gap-3 text-sm text-muted-foreground'>
            <div className='p-1.5 rounded-md bg-green-100 flex-shrink-0'>
              <Calendar className='h-3.5 w-3.5 text-green-600' />
            </div>
            <span>
              Applied{' '}
              <span className='font-medium'>
                {formatDistanceToNow(new Date(job.created_at))}
              </span>{' '}
              ago
            </span>
          </div>
        </div>

        <div className='flex items-center justify-between pt-1'>
          <Badge
            className={`${
              mode?.className || 'bg-muted text-muted-foreground'
            } font-medium border-0 px-3 py-1`}
            variant='secondary'
          >
            {mode?.label || job.mode.replace('-', ' ')}
          </Badge>
        </div>

        {job.notes && job.notes.trim() && (
          <div className='mt-3 space-y-2'>
            <p className='text-xs font-semibold text-muted-foreground tracking-wide'>
              Notes
            </p>
            <div className='p-4 bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl border border-border/30'>
              <p className='text-sm text-muted-foreground leading-relaxed break-words max-w-full overflow-hidden text-ellipsis font-medium'>
                {job.notes.length > 200
                  ? `${job.notes.substring(0, 100)}...`
                  : job.notes}
              </p>
              {job.notes.length > 200 && (
                <button
                  className='text-xs text-primary hover:text-primary/80 font-medium hover:underline mt-2 transition-colors'
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(job.notes);
                  }}
                >
                  View full note →
                </button>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className='gap-3 pt-4 border-t border-border/40 bg-muted/20 rounded-b-lg px-4 pb-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onEdit(job)}
          className='flex-1 bg-background hover:bg-gray-50 border-blue-200 hover:border-blue-400 text-gray-700 hover:text-gray-900 transition-all duration-200 font-medium'
        >
          <Edit className='h-4 w-4 mr-2' />
          Edit
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onDelete(job.id)}
          className='flex-1 bg-background hover:bg-red-50 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200 font-medium'
        >
          <Trash2 className='h-4 w-4 mr-2' />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
