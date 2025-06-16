
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Edit, 
  Trash, 
  Search, 
  X,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

// Define job opening structure matching Supabase
interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Department options
const departments = [
  'Sales & Marketing',
  'Operations',
  'Customer Support',
  'Marketing',
  'Finance',
  'Human Resources',
  'Technology',
  'Legal',
];

// Job types
const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
];

const CareersManager: React.FC = () => {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentJob, setCurrentJob] = useState<JobOpening | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Fetch jobs from Supabase
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setJobs(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load jobs');
      setJobs([]);
    }
    setLoading(false);
  };

  // Listen for real-time updates
  useEffect(() => {
    fetchJobs();
    
    const channel = supabase
      .channel('realtime-careers-admin')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'careers',
        },
        () => fetchJobs()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const handleAddJob = () => {
    setCurrentJob(null);
    setIsDialogOpen(true);
  };
  
  const handleEditJob = (job: JobOpening) => {
    setCurrentJob(job);
    setIsDialogOpen(true);
  };
  
  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job opening?')) return;
    
    try {
      const { error } = await supabase
        .from('careers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Job opening deleted successfully.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete job opening');
    }
  };
  
  const handleSaveJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    const jobData = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      department: (form.elements.namedItem('department') as HTMLSelectElement).value,
      location: (form.elements.namedItem('location') as HTMLInputElement).value,
      type: (form.elements.namedItem('type') as HTMLSelectElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      status: (form.elements.namedItem('status') as HTMLSelectElement).value as 'active' | 'inactive',
    };
    
    setLoading(true);
    try {
      if (currentJob) {
        // Update existing job
        const { error } = await supabase
          .from('careers')
          .update(jobData)
          .eq('id', currentJob.id);
        
        if (error) throw error;
        toast.success('Job opening updated successfully.');
      } else {
        // Add new job
        const { error } = await supabase
          .from('careers')
          .insert([jobData]);
        
        if (error) throw error;
        toast.success('Job opening added successfully.');
      }
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save job opening');
    }
    setLoading(false);
  };
  
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Careers Manager</h1>
        <Button onClick={handleAddJob} className="w-full sm:w-auto bg-brand-blue hover:bg-brand-blue/90">
          <Plus className="mr-2 h-4 w-4" /> Add New Job
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              className="pl-10"
              placeholder="Search job openings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearchTerm('')}
              className="ml-2"
            >
              <X size={18} />
            </Button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin w-8 h-8 mr-2 text-brand-blue" />
              <span>Loading jobs...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{job.title}</div>
                          <div className="text-sm text-gray-500">{job.type}</div>
                        </div>
                      </TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          job.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditJob(job)}
                          className="mr-1"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No jobs found matching your search.' : 'No job openings found. Add your first job opening.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentJob ? 'Edit Job Opening' : 'Add New Job Opening'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSaveJob} className="space-y-4 py-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Job Title
              </label>
              <Input 
                id="title" 
                name="title" 
                defaultValue={currentJob?.title || ''} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium mb-1">
                  Department
                </label>
                <select 
                  id="department" 
                  name="department"
                  defaultValue={currentJob?.department || ''}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">
                  Job Type
                </label>
                <select 
                  id="type" 
                  name="type"
                  defaultValue={currentJob?.type || ''}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                >
                  <option value="">Select Job Type</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Location
              </label>
              <Input 
                id="location" 
                name="location" 
                defaultValue={currentJob?.location || ''} 
                placeholder="City, Country or Remote" 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Job Description
              </label>
              <Textarea 
                id="description" 
                name="description" 
                rows={5}
                defaultValue={currentJob?.description || ''} 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">
                Status
              </label>
              <select 
                id="status" 
                name="status"
                defaultValue={currentJob?.status || 'active'}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90" disabled={loading}>
                {currentJob ? 'Update Job' : 'Add Job'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CareersManager;
