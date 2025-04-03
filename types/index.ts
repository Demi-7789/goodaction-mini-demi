export interface Program {
    id: string;
    nonprofit_id: string;
    title: string;
    description: string;
    sdg_goal: string;
    supporters?: string[];
    created_at: string;
    updated_at: string;
  }
  
  export interface Initiative {
    id: string;
    title: string;
    program_id: string;
    type: 'volunteer' | 'fundraise';
    goal: string;
    start_date: string;
    end_date: string;
    status: 'planned' | 'active' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
  }