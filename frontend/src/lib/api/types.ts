export interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  due_date: string | null;
  tasks: Task[];
}
