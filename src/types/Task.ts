export interface Task {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  budget: number;
  budgetType: 'fixed' | 'hourly' | 'negotiable';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
    city: string;
    state: string;
    pinCode?: string;
    country: string;
  };
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high';
  requesterId: string;
  requesterName: string;
  creatorUid: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedAt?: Date;
  estimatedDuration?: number; // in hours
  actualDuration?: number; // in hours
  scheduledDate?: Date;
  scheduledTime?: string;
  flexibility: 'strict' | 'flexible' | 'anytime';
  requirements?: string[];
  attachments?: Array<{
    type: string;
    url: string;
    filename: string;
    uploadedAt: Date;
  }>;
  tags?: string[];
  isUrgent: boolean;
  isFeatured: boolean;
  views: number;
  applications: number;
  rating: number;
  review?: string;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskListResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
