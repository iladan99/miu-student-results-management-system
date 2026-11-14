# Student Results Management System (SRMS)

**Mewar International University (MIU)**

## 1. Project Overview

The Student Results Management System (SRMS) is a web-based academic management application designed to support the management, processing, storage and retrieval of student academic results at Mewar International University.

The system aims to improve the accuracy, accessibility, organisation and efficiency of academic result management while reducing the challenges associated with manual result processing.

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

The project is being developed using the following technologies:

- **Frontend:** Next.js 15, React 19 and TypeScript
- **Styling:** Tailwind CSS 4
- **Backend:** Next.js server-side functionality
- **Database:** PostgreSQL
- **Database ORM:** Prisma
- **Deployment:** Vercel
- **Version Control:** Git and GitHub

## 4. Core Development Objectives

The system is intended to provide:

- Secure user authentication and access control.
- Student record management.
- Course and academic session management.
- Lecturer and administrator management.
- Continuous assessment and examination result management.
- Result computation and processing.
- Student result viewing and reporting.
- Academic result documentation.

## 5. Project Structure

```text
miu-student-results-management-system/
│
├── public/
│   ├── images/
│   │   ├── university/
│   │   └── branding/
│   └── documents/
│
├── prisma/
├── docs/
├── tests/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── about/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   ├── config/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── types/
│
├── .env.example
├── package.json
├── package-lock.json
└── README.md
```

## 6. Installation and Local Development

### Prerequisites

- Node.js
- npm
- Visual Studio Code
- PostgreSQL (required for database development)

### Setup Instructions

1. Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

2. Navigate into the project directory:

```bash
cd miu-student-results-management-system
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the application in your browser:

```text
http://localhost:3000
```

Database configuration and environment variables will be added during the database development phase.

## 7. Development Status

The project is being developed incrementally, following a structured development plan.

Current progress includes:

- Initial Next.js application setup.
- TypeScript and Tailwind CSS configuration.
- Global styling and application metadata.
- Initial homepage development.
- Project folder organisation.

Further development will cover authentication, database integration, academic management modules, result processing, testing and deployment.

## 8. Project Supervision

**Student Developer:** Abduljalil Nuruddeen

**Project Supervisor:** Mrs Aishatu Ibrahim

**Institution:** Mewar International University

**Department:** Software Engineering

---

*Developed as an undergraduate software project at Mewar International University.*