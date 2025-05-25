import { EmployeeModel } from "@app/model/Employee";

export class EmployeeResponseDto {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  position: string | null;
  department: string | null;
  location: string | null;
  basicSalary: number;
  hourRate: number;
  hireDate: string | null;
  terminationDate: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(employee: EmployeeModel) {
    this.id = employee.id;
    this.fullName = `${employee.firstName} ${employee.lastName}`;
    this.email = employee.email;
    this.phone = employee.phone;
    this.position = employee.position;
    this.department = employee.department;
    this.location = employee.location;
    this.basicSalary = Number(employee.basicSalary);
    this.hourRate = Number(employee.hourRate);
    this.hireDate = employee.hireDate;
    this.terminationDate = employee.terminationDate;
    this.createdAt = employee.createdAt;
    this.updatedAt = employee.updatedAt;
  }
}
