export interface UserRequest {
    id?: string;
    roleId: string;
    email: string;
    name: string;
    password: string; //for signup
    isActive: boolean;
    groupId?: string; 
  }
  