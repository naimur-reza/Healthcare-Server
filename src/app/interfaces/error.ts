export interface IGenericError {
  status: number;
  message: string;
  error: {
    issues: {
      field: string | number;
      message: string;
    }[];
  };
}
