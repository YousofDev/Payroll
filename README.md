# Payroll System

A robust, scalable, and secure payroll management system built with modern technologies to streamline employee management, payroll processing, and financial operations. This application is designed to handle user authentication, employee records, salary calculations, additions, deductions, and payslip generation with a focus on performance, security, and maintainability. It leverages TypeScript, Express.js, PostgreSQL, and Drizzle ORM, with a fully containerized setup using Docker and automated CI/CD pipelines via GitHub Actions.

---

## 🚀 Features

- **User Management**:

  - Secure user registration and login with JWT-based authentication.
  - Role-based access control (ADMIN and HR roles).
  - CRUD operations for users, including role assignment.

- **Employee Management**:

  - Create, update, retrieve, and delete employee records.
  - Store comprehensive employee details (e.g., salary, position, department, hire/termination dates).

- **Additions and Deductions**:

  - Manage addition types (e.g., bonuses, overtime) and deduction types (e.g., taxes, insurance).
  - Support for monthly or special frequency types.
  - Flexible handling of amounts or hourly-based calculations with multipliers.

- **Payslip Generation**:

  - Generate payslips with detailed breakdowns of basic salary, additions, deductions, and net salary.
  - Support for draft, processed, and paid statuses.
  - Customizable company details (name, address, logo) on payslips.

- **Security and Validation**:

  - Input validation using Zod for robust data integrity.
  - Role-based authorization middleware (`hasAuthority`).
  - Error handling with custom middleware (`catchRouteErrors`).

- **Database Management**:

  - Managed with Drizzle ORM for type-safe database migrations.
  - Separate production and test databases for isolation.
  - Automated migration scripts for consistent schema updates.

- **Scalability and Deployment**:

  - Containerized with Docker for consistent environments.
  - CI/CD pipeline using GitHub Actions for automated testing and deployment.
  - Fully tested with unit and integration tests using Jest.

---

## 🛠️ Technologies Used

- **Backend**: Express.js with TypeScript for type-safe, scalable API development.
- **Database**: PostgreSQL for reliable relational data storage.
- **ORM**: Drizzle ORM for type-safe database migrations and schema management.
- **Validation**: Zod for runtime type checking and input validation.
- **Containerization**: Docker with Docker Compose for consistent deployments.
- **CI/CD**: GitHub Actions for automated testing and deployment pipelines.
- **Testing**: Jest with Supertest for comprehensive unit and integration tests.
- **Security**: JWT (jsonwebtoken), bcrypt for password hashing, Helmet for HTTP security.
- **Logging**: Winston for structured logging and daily rotation.
- **Dependency Injection**: Custom container for modular and testable code.

---

## 📋 API Endpoints

Below is a summary of the API endpoints grouped by feature. All endpoints are prefixed with the API version (e.g., `/api/v1`).

### User Management

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/users/register` | Register a new user | Public |
| POST | `/users/login` | User login with email and password | Public |
| GET | `/users/:id` | Get user by ID | Authenticated |
| GET | `/users` | Get all users | ADMIN |
| PATCH | `/users/:id/assign-role` | Assign a role to a user | ADMIN |
| DELETE | `/users/:id` | Delete a user by ID | ADMIN |

### Employee Management

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/employees` | Get all employees | Authenticated |
| POST | `/employees` | Create a new employee | Authenticated |
| GET | `/employees/:id` | Get employee by ID | Authenticated |
| PUT | `/employees/:id` | Update employee details | Authenticated |
| DELETE | `/employees/:id` | Delete employee by ID | Authenticated |

### Addition Types

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/addition-types` | Get all addition types | Authenticated |
| POST | `/addition-types` | Create a new addition type | Authenticated |
| GET | `/addition-types/:id` | Get addition type by ID | Authenticated |
| PUT | `/addition-types/:id` | Update addition type | Authenticated |
| DELETE | `/addition-types/:id` | Delete addition type by ID | Authenticated |

### Deduction Types

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/deduction-types` | Get all deduction types | Authenticated |
| POST | `/deduction-types` | Create a new deduction type | ADMIN |
| GET | `/deduction-types/:id` | Get deduction type by ID | Authenticated |
| PUT | `/deduction-types/:id` | Update deduction type | ADMIN |
| DELETE | `/deduction-types/:id` | Delete deduction type by ID | ADMIN |

### Additions

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/additions` | Get all additions | ADMIN, HR |
| POST | `/additions` | Create a new addition | ADMIN, HR |
| GET | `/additions/:id` | Get addition by ID | ADMIN, HR |
| PUT | `/additions/:id` | Update addition | ADMIN, HR |
| DELETE | `/additions/:id` | Delete addition by ID | ADMIN, HR |

### Deductions

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/deductions` | Get all deductions | ADMIN, HR |
| POST | `/deductions` | Create a new deduction | ADMIN, HR |
| GET | `/deductions/:id` | Get deduction by ID | ADMIN, HR |
| PUT | `/deductions/:id` | Update deduction | ADMIN, HR |
| DELETE | `/deductions/:id` | Delete deduction by ID | ADMIN, HR |

### Payslips

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/payslips` | Get all payslips | Authenticated |
| POST | `/payslips` | Generate payslips for employees | Authenticated |
| GET | `/payslips/:id` | Get payslip by ID | Authenticated |
| DELETE | `/payslips/:id` | Delete payslip by ID | ADMIN |

---

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose** for containerized setup
- **PostgreSQL** for local database (if not using Docker)
- **pnpm** for package management
- **GitHub account** for CI/CD

### Local Development Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd payroll-system
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Set up environment variables**: Run the provided setup script to create a `.env` file and initialize databases:

   ```bash
   chmod +x setup-local.sh
   ./setup-local.sh
   ```

   This script:

   - Creates a `.env` file with default configurations.
   - Initializes `payroll` and `testpayroll` databases.
   - Starts Docker containers for production and test databases.
   - Runs migrations for both databases.
   - Starts the application.

4. **Run the application manually** (if not using `setup-local.sh`):

   - Start Docker containers:

     ```bash
     docker compose up -d
     ```

   - Run migrations:

     ```bash
     ./migrate.sh
     ```

   - Start the application:

     ```bash
     pnpm run dev
     ```

5. **Access the application**:
   - API URL: `http://localhost:4000/api/v1`

---

## 🧪 Testing

The application is fully tested with:

- **Unit Tests**: Covering controllers, services, and utilities.

- **Integration Tests**: Testing API endpoints with the test database.

- Run tests using:

  ```bash
  pnpm run test
  ```

To clear the Jest cache:

```bash
pnpm run clear_jest
```

---

## 🚀 Deployment

The project includes a GitHub Actions CI/CD pipeline that:

- Runs tests on every push/pull request.
- Builds and deploys the application using Docker.
- Executes migrations for production and test databases.

### Deployment Steps

1. Configure environment variables in `.env` (see `.env.example`).
2. Set up GitHub Actions secrets (e.g., `DB_PASSWORD`, `ACCESS_TOKEN_SECRET` etc.).
3. Push changes to the `main` branch to trigger the pipeline.

### Docker Deployment

- Build and run with Docker Compose:

  ```bash
  docker compose up --build -d
  ```

- Run migrations:

  ```bash
  ./migrate.sh
  ```

---

## 🗄️ Database Management

- **Drizzle ORM**: Used for type-safe schema definitions and migrations.

- **Migration Scripts**:

- Production migrations: `pnpm run migrate:prod`

- Test migrations: `pnpm run migrate:test`

### Run both: `./migrate.sh`

- **Databases**:

  - Production: `payroll` (port 5432)
  - Test: `testpayroll` (port 5433)

---

## 📬 Contact

For questions or contributions, feel free to reach out via GitHub Issues