export interface IncomeDataType {
  id: number;
  title: string;
  amount: string;
  categoryId: number;
  date: string;
}

export interface GoalDataType {
  id: number;
  title: string;
  amount: string;
  deducePercentage: string;
  progress: number;
}
