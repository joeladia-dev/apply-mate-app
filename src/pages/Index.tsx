import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { JobCard } from '@/components/JobCard';
import { JobDialog } from '@/components/JobDialog';
import { StatsCard } from '@/components/StatsCard';
import { UserProfile } from '@/components/UserProfile';
import { JobType, JobStatus } from '@/types/job';
import {
  Plus,
  LogOut,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);
      fetchJobs();

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (!session) {
          navigate('/auth');
        } else {
          setUser(session.user);
        }
      });

      return () => subscription.unsubscribe();
    };

    initAuth();
  }, [navigate]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter((job) => job.status === statusFilter));
    }
    // Reset to first page when filter changes
    setCurrentPage(1);
  }, [statusFilter, jobs]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (jobData: Partial<JobType>) => {
    setSubmitLoading(true);
    try {
      if (selectedJob) {
        const { error } = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', selectedJob.id);
        if (error) throw error;
        toast.success('Job updated successfully!');
      } else {
        const { error } = await supabase.from('jobs').insert([
          {
            position: jobData.position!,
            company: jobData.company!,
            location: jobData.location!,
            status: jobData.status!,
            mode: jobData.mode!,
            notes: jobData.notes || null,
            user_id: user.id,
          },
        ]);
        if (error) throw error;
        toast.success('Job added successfully!');
      }
      fetchJobs();
      setDialogOpen(false);
      setSelectedJob(null);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) throw error;
      toast.success('Job deleted successfully!');
      fetchJobs();
    } catch (error: any) {
      toast.error('Failed to delete job');
    }
  };

  const handleEdit = (job: JobType) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const stats = {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === JobStatus.Pending).length,
    interview: jobs.filter((j) => j.status === JobStatus.Interview).length,
    declined: jobs.filter((j) => j.status === JobStatus.Declined).length,
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 5; // Show max 5 page numbers

    if (totalPages <= maxPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis for larger totals
      if (currentPage <= 3) {
        // Near beginning
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        // In middle
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-sky-50'>
      <header className='border-b bg-gradient-to-r from-blue-100/40 via-blue-50/30 to-sky-50/20 backdrop-blur-sm sticky top-0 z-10 shadow-sm'>
        <div
          className={`container mx-auto px-4 transition-all duration-300 ${
            isScrolled ? 'py-3' : 'py-6'
          }`}
        >
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <div className='p-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200'>
                <Briefcase className='h-7 w-7 text-white drop-shadow-sm' />
              </div>
              <div>
                <h1
                  className={`font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent transition-all duration-300 ${
                    isScrolled ? 'text-2xl' : 'text-3xl'
                  }`}
                >
                  ApplyMate
                </h1>
                <p className='text-sm text-blue-600 font-medium'>
                  Job Application Tracker
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <UserProfile user={user} />
              <Button
                variant='outline'
                onClick={handleLogout}
                size='sm'
                className='bg-white/90 hover:bg-gray-50 hover:shadow-md border-gray-200 hover:border-gray-400 text-gray-700 hover:text-gray-900 transition-all duration-200'
              >
                <LogOut className='h-4 w-4 sm:mr-2' />
                <span className='hidden sm:inline'>logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <StatsCard
            title='Total Applications'
            value={stats.total}
            icon={Briefcase}
            status='total'
          />
          <StatsCard
            title='Pending'
            value={stats.pending}
            icon={Clock}
            description='Awaiting response'
            status='pending'
          />
          <StatsCard
            title='Interviews'
            value={stats.interview}
            icon={CheckCircle}
            description='In progress'
            status='interview'
          />
          <StatsCard
            title='Declined'
            value={stats.declined}
            icon={XCircle}
            status='declined'
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6'>
          <h2 className='text-xl font-semibold text-foreground'>
            Your Applications
          </h2>
          <div className='flex gap-3 w-full sm:w-auto'>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[180px]'>
                <Filter className='h-4 w-4 mr-2' />
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value={JobStatus.Pending}>Pending</SelectItem>
                <SelectItem value={JobStatus.Interview}>Interview</SelectItem>
                <SelectItem value={JobStatus.Declined}>Declined</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className='[background:var(--gradient-primary)]'
              onClick={() => {
                setSelectedJob(null);
                setDialogOpen(true);
              }}
            >
              <Plus className='h-4 w-4 mr-2' />
              Add Job
            </Button>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className='text-center py-12'>
            <div className='inline-block p-4 bg-muted rounded-full mb-4'>
              <Briefcase className='h-12 w-12 text-muted-foreground' />
            </div>
            <h3 className='text-xl font-semibold mb-2 text-foreground'>
              No applications yet
            </h3>
            <p className='text-muted-foreground mb-6'>
              {statusFilter === 'all'
                ? 'Start tracking your job applications'
                : `No ${statusFilter} applications found`}
            </p>
            {statusFilter === 'all' && (
              <Button
                className='[background:var(--gradient-primary)]'
                onClick={() => {
                  setSelectedJob(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className='h-4 w-4 mr-2' />
                Add Your First Job
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results info */}
            <div className='flex justify-between items-center mb-4'>
              <p className='text-sm text-muted-foreground'>
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredJobs.length)} of{' '}
                {filteredJobs.length} applications
              </p>
              {totalPages > 1 && (
                <p className='text-sm text-muted-foreground'>
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>

            {/* Jobs Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {currentJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='mt-8 flex justify-center'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && setCurrentPage(currentPage - 1)
                        }
                        className={
                          currentPage <= 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>

                    {getPageNumbers().map((pageNum, index) => (
                      <PaginationItem key={index}>
                        {pageNum === '...' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum as number)}
                            isActive={currentPage === pageNum}
                            className='cursor-pointer'
                          >
                            {pageNum}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages &&
                          setCurrentPage(currentPage + 1)
                        }
                        className={
                          currentPage >= totalPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </main>

      <JobDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        job={selectedJob}
        loading={submitLoading}
      />
    </div>
  );
};

export default Index;
