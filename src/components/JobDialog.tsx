import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { JobType, JobStatus, JobMode } from '@/types/job';
import { Loader2 } from 'lucide-react';

interface JobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (job: Partial<JobType>) => void;
  job?: JobType | null;
  loading?: boolean;
}

export const JobDialog = ({
  open,
  onOpenChange,
  onSubmit,
  job,
  loading,
}: JobDialogProps) => {
  const [formData, setFormData] = useState<Partial<JobType>>({
    position: '',
    company: '',
    location: '',
    status: JobStatus.Pending,
    mode: JobMode.FullTime,
    notes: '',
  });

  useEffect(() => {
    if (job) {
      setFormData(job);
    } else {
      setFormData({
        position: '',
        company: '',
        location: '',
        status: JobStatus.Pending,
        mode: JobMode.FullTime,
        notes: '',
      });
    }
  }, [job, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {job ? 'Edit Job Application' : 'Add New Job Application'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='position'>Position</Label>
            <Input
              id='position'
              placeholder='Software Engineer'
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='company'>Company</Label>
            <Input
              id='company'
              placeholder='Google Inc.'
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='location'>Location</Label>
            <Input
              id='location'
              placeholder='Manila, Philippines'
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='status'>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as JobStatus })
                }
              >
                <SelectTrigger id='status'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={JobStatus.Pending}>Pending</SelectItem>
                  <SelectItem value={JobStatus.Interview}>Interview</SelectItem>
                  <SelectItem value={JobStatus.Declined}>Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='mode'>Mode</Label>
              <Select
                value={formData.mode}
                onValueChange={(value) =>
                  setFormData({ ...formData, mode: value as JobMode })
                }
              >
                <SelectTrigger id='mode'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={JobMode.FullTime}>Full-time</SelectItem>
                  <SelectItem value={JobMode.PartTime}>Part-time</SelectItem>
                  <SelectItem value={JobMode.Internship}>Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='notes'>Notes (Optional)</Label>
            <Textarea
              id='notes'
              placeholder='Add any notes about this application... (interview details, requirements, follow-up items, etc.)'
              value={formData.notes || ''}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className='resize-none'
            />
          </div>
          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading} className='flex-1'>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                <>{job ? 'Update' : 'Add'} Job</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
