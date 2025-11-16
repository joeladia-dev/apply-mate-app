export type JobType = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  position: string;
  company: string;
  location: string;
  status: 'pending' | 'interview' | 'declined';
  mode: 'full-time' | 'part-time' | 'internship';
  notes?: string;
};

export enum JobStatus {
  Pending = 'pending',
  Interview = 'interview',
  Declined = 'declined',
}

export enum JobMode {
  FullTime = 'full-time',
  PartTime = 'part-time',
  Internship = 'internship',
}
