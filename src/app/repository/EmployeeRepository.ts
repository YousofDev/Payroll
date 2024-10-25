import { eq } from "drizzle-orm";
import { logger } from "@util/logger";
import { DatabaseClient } from "@data/DatabaseClient";
import { NewEmployeeModel, EmployeeModel, Employee } from "@app/model/Employee";

export class EmployeeRepository {
  private readonly db = DatabaseClient.getInstance().getConnection();

  public constructor() {
    logger.info("EmployeeRepository initialized");
  }

  public async createEmployee(
    employeeDto: NewEmployeeModel
  ): Promise<EmployeeModel> {
    const employee = await this.db
      .insert(Employee)
      .values(employeeDto)
      .returning()
      .then((rows) => rows[0]);

    return employee;
  }

  public async getAllEmployees(): Promise<EmployeeModel[]> {
    return await this.db.select().from(Employee);
  }

  public async getEmployeeById(
    employeeId: number
  ): Promise<EmployeeModel | null> {
    return await this.db
      .select()
      .from(Employee)
      .where(eq(Employee.id, employeeId))
      .then((rows) => rows[0] || null);
  }

  public async updateEmployee(
    employeeDto: NewEmployeeModel,
    employeeId: number
  ): Promise<EmployeeModel> {
    const employee = await this.db
      .update(Employee)
      .set(employeeDto)
      .where(eq(Employee.id, employeeId))
      .returning()
      .then((rows) => rows[0]);

    return employee;
  }

  public async deleteEmployeeById(employeeId: number): Promise<void> {
    await this.db.delete(Employee).where(eq(Employee.id, employeeId));
  }
}
