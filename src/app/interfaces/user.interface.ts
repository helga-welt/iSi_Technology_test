export enum EUserType {
  admin  = "Admin",
  driver   = "Driver"
}

export interface IUser {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  type: EUserType;
}
