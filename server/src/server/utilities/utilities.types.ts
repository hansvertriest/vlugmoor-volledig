export interface IAppError extends Error {
  details?: string;
  status: number;
  timestamp: number;
}
