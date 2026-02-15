# ReviewRATE

A company review platform with role-based access control, allowing users to browse, search, and review companies.

Overview

  ReviewRATE is a full-stack MERN application where users can discover companies, read reviews, and share their own experiences. The platform implements role-based authentication with distinct Admin and User capabilities.

## Tech Stack

Frontend:** React.js, Tailwind CSS  
Backend:** Node.js, Express.js  
Database:** MongoDB  
Authentication:** JWT, bcrypt

## Features

- User authentication (signup/login)
- Role-based access (Admin/User)
- Company search and filtering
- Location-based filtering (country/city)
- Star ratings and reviews
- Admin CRUD operations for companies

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)

### Setup

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd reviewrate

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. Environment Configuration

Create `.env` file in backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reviewrate
NODE_ENV=development
JWT_SECRET=review@12345%&*
JWT_EXPIRES_IN=7d
ADMIN_REGISTRATION_KEY=AdminQ123
```

<img width="1021" height="325" alt="Screenshot 2026-02-15 121930" src="https://github.com/user-attachments/assets/ca3473b2-8128-40e6-9db4-833ae380c030" />

3. Start the application

    ```bash
    # Terminal 1 - Backend
    cd backend
    npm start
    
    # Terminal 2 - Frontend
    cd frontend
    npm start
    ```

Application runs on `http://localhost:3000`

## User Roles & Permissions

### Admin
- Add/Edit/Delete companies
- Post reviews
- Full platform access

### User
- Browse and search companies
- Filter by location
- Post reviews
- **Cannot** manage companies
<img width="1224" height="232" alt="Screenshot 2026-02-15 122558" src="https://github.com/user-attachments/assets/5b77db92-9513-44ed-9b7d-88327cf82d65" />
<img width="1517" height="890" alt="image" src="https://github.com/user-attachments/assets/892d1ef6-11d5-4e0a-877f-597fde1b457c" />


*Admin view with "Add Company" access*

<img width="1547" height="867" alt="image" src="https://github.com/user-attachments/assets/f4a99547-7c52-4a9d-b949-a9eb4844e2fd" />

*Non-admin users see permission restrictions*

Application Walkthrough

1. User Registration & Login

Create an account with name, email, password, and account type.

<img width="862" height="772" alt="image" src="https://github.com/user-attachments/assets/7a5498f8-5678-4b10-b2a3-022f6dcf7e4a" />


Note:Admin accounts require the `ADMIN_REGISTRATION_KEY` from environment variables.

2. Browse Companies

View all companies with ratings and reviews. Search by name or filter by location.
<img width="1712" height="1025" alt="image" src="https://github.com/user-attachments/assets/fcebd26e-beac-49cd-becc-55a5dd41fc60" />


3. Search Functionality

Real-time search filters companies as you type.
<img width="1738" height="809" alt="Screenshot 2026-02-15 122013" src="https://github.com/user-attachments/assets/0758949f-353d-4546-b6da-eb13f0b3b693" />

### 4. Location Filtering

Two-tier filtering system:
1. Country/Location
2. City

<img width="1509" height="669" alt="Screenshot 2026-02-15 122104" src="https://github.com/user-attachments/assets/39f3846a-38d8-47eb-a87a-91a4f361cd97" />


### 5. Full Application Interface
<img width="1713" height="1025" alt="Screenshot 2026-02-15 121955" src="https://github.com/user-attachments/assets/8150c1c6-cef3-437f-acb3-59ab4461fa38" />


## Project Structure

```
reviewrate/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Company.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── companies.js
│   │   └── reviews.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.js
    └── package.json
```

## Key Implementation Details

### Authentication
- JWT tokens for session management
- bcrypt password hashing
- Role-based middleware protection

### Database Models

User:name, email, password (hashed), accountType  
Company:name, location, city, founded, rating, reviewCount  
Review:companyId, userId, rating, comment

### API Endpoints

```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/companies?search=&location=&city=
POST   /api/companies (Admin only)
PUT    /api/companies/:id (Admin only)
DELETE /api/companies/:id (Admin only)
POST   /api/reviews
GET    /api/reviews/:companyId
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Role-based access control
- Admin registration key protection

## Environment Variables

I have provided the screenshots to demonstrate and test the website functionalities for both Admin and Normal User login access. Although these materials are not intended for sharing, they have been provided solely for testing and evaluation purposes.


<img width="1021" height="325" alt="Screenshot 2026-02-15 121930" src="https://github.com/user-attachments/assets/e433765c-6476-4521-b03a-22fd9b8fc6cd" />


| Variable | Purpose |
|----------|---------|
| `PORT` | Server port |
| `MONGODB_URI` | Database connection |
| `JWT_SECRET` | Token signing key |
| `JWT_EXPIRES_IN` | Token expiration |
| `ADMIN_REGISTRATION_KEY` | Admin account creation key |
---  
