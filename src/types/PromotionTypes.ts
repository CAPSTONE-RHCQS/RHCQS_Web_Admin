export interface PromotionItem {
  Id: string;
  Code: string | null;
  Value: number;
  InsDate: string;
  StartTime: string;
  Name: string;
  ExpTime: string;
  IsRunning: boolean;
}

export interface PromotionRequest {
  value: number;
  startTime: string;
  name: string;
  expTime: string;
}
