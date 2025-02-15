Task Manager

This is a task management web application built using React, TypeScript, Tailwind CSS, and Firebase Firestore for data storage. It allows users to create, edit, filter, and manage tasks.

Features

-- User authentication with Firebase.

-- Task creation, editing, and deletion.

-- Filtering tasks by category and due date.

-- File upload functionality using Firebase Storage (or Cloudinary alternative).

-- Responsive UI with Tailwind CSS.

Prerequisites

-- Ensure you have the following installed:

-- Node.js (LTS version recommended)

-- npm or yarn

-- A Firebase project with Firestore and Authentication enabled

Installation

1. Clone the repository
   
   git clone https://github.com/akshaym1412/Task_Management.git
   cd task_management

2. npm install  # or yarn install

Environment Setup

1. Create a .env file in the project root and add the following:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

Get these values from your Firebase Console.

Running the Project

1. Start the development server
---  npm run dev  # or yarn dev

2. Open http://localhost:5173 in your browser.
