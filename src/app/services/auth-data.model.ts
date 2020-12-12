export interface LoginUser {
    email: string;
    password: string;
  }
  
  export interface UserDate extends LoginUser{
    name:string;
  }
  