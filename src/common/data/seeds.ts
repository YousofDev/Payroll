import { Employee, NewEmployeeModel } from "@app/model/Employee";
import { AdditionType, NewAdditionTypeModel } from "@app/model/AdditionType";
import { Addition, NewAdditionModel } from "@app/model/Addition";
import { DeductionType, NewDeductionTypeModel } from "@app/model/DeductionType";
import { Deduction, NewDeductionModel } from "@app/model/Deduction";
import { DatabaseClient } from "@data/DatabaseClient";
import { NewUserModel, User } from "@app/model/User";
import { PasswordEncoder } from "@util/PasswordEncoder";

const db = DatabaseClient.getInstance().getConnection();
const passwordEncoder = new PasswordEncoder();

export async function seedDumpData() {
  try {
    const users: NewUserModel[] = [
      {
        firstName: "Ali",
        email: "ali@mail.com",
        password: await passwordEncoder.hash("123456"),
        role: "ADMIN",
      },
      {
        firstName: "Ramy",
        email: "ramy@mail.com",
        password: await passwordEncoder.hash("123456"),
        role: "HR",
      },
    ];

    await db.insert(User).values(users);

    const employees: NewEmployeeModel[] = [
      {
        id: 1,
        firstName: "Jon",
        lastName: "Pom",
        email: "jon@mail.com",
        salary: "8000",
      },
      {
        id: 2,
        firstName: "Tom",
        lastName: "Din",
        email: "tom@mail.com",
        salary: "12000",
      },
      {
        id: 3,
        firstName: "Lon",
        lastName: "Kar",
        email: "lon@mail.com",
        salary: "5000",
      },
    ];

    await db.insert(Employee).values(employees);

    const additionTypes: NewAdditionTypeModel[] = [
      {
        id: 1,
        name: "Overtime",
        frequencyType: "SPECIAL",
      },
      {
        id: 2,
        name: "Commission Sales",
        frequencyType: "SPECIAL",
      },
      {
        id: 3,
        name: "Gifts",
        frequencyType: "SPECIAL",
      },
      {
        id: 4,
        name: "Transport Allowance",
        frequencyType: "MONTHLY",
      },
      {
        id: 5,
        name: "Food Allowance",
        frequencyType: "MONTHLY",
      },
      {
        id: 6,
        name: "Rent Allowance",
        frequencyType: "MONTHLY",
      },
    ];

    await db.insert(AdditionType).values(additionTypes);

    const deductionTypes: NewDeductionTypeModel[] = [
      {
        id: 1,
        name: "Unpaid Work off",
        frequencyType: "SPECIAL",
      },
      {
        id: 2,
        name: "Salary Loans",
        frequencyType: "SPECIAL",
      },
      {
        id: 3,
        name: "Insurance",
        frequencyType: "MONTHLY",
      },
      {
        id: 4,
        name: "Income Tax",
        frequencyType: "MONTHLY",
      },
    ];

    await db.insert(DeductionType).values(deductionTypes);

    const additions: NewAdditionModel[] = [
      { employeeId: 1, additionTypeId: 4, amount: "700.00" },
      { employeeId: 1, additionTypeId: 5, amount: "1500.00" },
      { employeeId: 1, additionTypeId: 6, amount: "1000.00" },
      { employeeId: 1, additionTypeId: 1, amount: "300.00" },
      { employeeId: 1, additionTypeId: 1, amount: "500.00" },
      { employeeId: 1, additionTypeId: 2, amount: "200.00" },
      { employeeId: 1, additionTypeId: 2, amount: "4500.00" },
      { employeeId: 1, additionTypeId: 2, amount: "2000.00" },
    ];

    await db.insert(Addition).values(additions);

    const deductions: NewDeductionModel[] = [
      { employeeId: 1, deductionTypeId: 1, amount: "200.00" },
      { employeeId: 1, deductionTypeId: 1, amount: "100.00" },
      { employeeId: 1, deductionTypeId: 2, amount: "300.00" },
      { employeeId: 1, deductionTypeId: 2, amount: "300.00" },
      { employeeId: 1, deductionTypeId: 3, amount: "900.00" },
      { employeeId: 1, deductionTypeId: 4, amount: "1200.00" },
    ];

    await db.insert(Deduction).values(deductions);

    console.log("Dump data created successfully.");
  } catch (err) {
    console.error("Error creating dump data:", err);
  }
}

/*

SELECT pid, usename, datname, state 
FROM pg_stat_activity 
WHERE datname = 'payroll';

SELECT pg_terminate_backend(PID);

DROP DATABASE payroll;

CREATE DATABASE payroll;

CREATE TYPE user_role AS ENUM ('ADMIN', 'HR');
CREATE TYPE frequency_type AS ENUM ('MONTHLY', 'SPECIAL');
CREATE TYPE payslip_status AS ENUM ('DRAFT', 'PROCESSED', 'PAID');
CREATE TYPE direction AS ENUM ('ADDITION', 'DEDUCTION');

*/

seedDumpData();
