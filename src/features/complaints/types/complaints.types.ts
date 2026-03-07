export type ComplaintStatus = 'new' | 'in_review' | 'resolved' | 'closed';

export interface Complaint {
  id: string;
  complainantName: string;
  source: 'donor' | 'beneficiary' | 'representative';
  subject: string;
  createdAt: string;
  status: ComplaintStatus;
}

