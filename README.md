# Student Results Management System (SRMS)

**Mewar International University (MIU)**

## 1. Project Overview

The Student Results Management System (SRMS) is a web-based academic result management application developed for Mewar International University.

The system is designed to support the management of student records, academic information, course registration, result processing and academic performance reporting. It provides separate access for administrators, lecturers and students.

The application aims to improve the accuracy, organisation, accessibility and efficiency of academic result management while reducing the difficulties associated with manual result processing.

## 2. Project Information

| Description | Details |
|---|---|
| Project Title | Student Results Management System |
| Student Developer | Abduljalil Nuruddeen |
| Registration Number | MIU/23/CMP/SEN/107 |
| Supervisor | Mrs Aishatu Ibrahim |
| Faculty | Computing |
| Department | Software Engineering |
| Institution | Mewar International University |

## 3. Technology Stack

- **Frontend:** Next.js 15 and React 19
- **Programming Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Backend:** Next.js server-side functionality
- **Database:** PostgreSQL (Neon)
- **Database ORM:** Prisma 6
- **Authentication:** Custom session-based authentication with bcrypt password hashing
- **Deployment:** Vercel
- **Version Control:** Git and GitHub

## 4. System Features

### Administrator Module
- Administrator authentication and dashboard.
- Academic session and semester management.
- Faculty and department management.
- Academic level and course management.
- Student account creation, editing and management.
- Lecturer account creation, editing and management.
- Bulk student registration.
- Lecturer course assignment.
- Review, approval and rejection of submitted results.
- Student, lecturer and academic result reports.

### Lecturer Module
- Lecturer authentication and dashboard.
- View assigned courses.
- View students registered for assigned courses.
- Enter continuous assessment and examination scores.
- Save and update draft results.
- Submit completed results for administrative review.
- View result submission status.

### Student Module
- Student authentication and dashboard.
- View eligible courses.
- Register for available courses.
- View approved academic results.
- View GPA and CGPA.
- Print academic results.

### General System Features
- Role-based access control.
- Password hashing and session management.
- Optional password change for all user roles.
- Result grading and computation.
- Restricted access to student and lecturer records.
- Administrative result approval workflow.

## 5. Result Grading System

The application uses the following grading scale:

| Score | Grade | Grade Point |
|---|---|---:|
| 70–100 | A | 5 |
| 60–69 | B | 4 |
| 50–59 | C | 3 |
| 45–49 | D | 2 |
| 40–44 | E | 1 |
| 0–39 | F | 0 |

Continuous Assessment contributes a maximum of 40 marks, while the examination contributes a maximum of 60 marks.

GPA and CGPA are computed using approved results and course credit units.

## 6. Installation and Local Development

### Prerequisites

- Node.js (20 or later recommended)
- npm
- Git
- PostgreSQL database
- Visual Studio Code or another code editor

### Clone the Repository

```bash
git clone https://github.com/iladan99/miu-student-results-management-system.git
cd miu-student-results-management-system
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root directory.

Add the following variables using your own PostgreSQL connection details:

```env
DATABASE_URL="YOUR_POOLED_POSTGRESQL_CONNECTION_STRING"
DIRECT_URL="YOUR_DIRECT_POSTGRESQL_CONNECTION_STRING"
```

Do not publish your `.env` file or share database credentials.

### Generate Prisma Client

```bash
npx prisma generate
```

### Apply Database Migrations

For an existing database with the project's migrations already applied, use:

```bash
npx prisma migrate deploy
```

For local development when creating new migrations, use:

```bash
npx prisma migrate dev
```

### Start the Development Server

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## 7. Available npm Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run