export interface Role {

}

export interface User {
  id: string | number;
  email: string;
  role: Role;
}
