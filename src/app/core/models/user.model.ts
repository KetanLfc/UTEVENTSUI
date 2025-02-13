export interface IUser {
  id: string;
  email: string;
  name: string;
  roleId: string;
  roleName: string; 
  isActive: boolean;
  groupId?: string;
  emailConfirmed: boolean;
  }
  