export interface ResponseModel<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
