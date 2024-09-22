# Authentication Endpoints

## POST /auth/signup
Create a new user account.
- **Request Body**:
  - `name` (string): Minimum length 2, no spaces or special characters allowed.
  - `email` (string): Must be a valid email and not already registered.
  - `password` (string): Minimum 8 characters, with at least one letter, one number, and one special character.
  - `phoneNumber` (string): Must be a valid phone number in international format.
- **Response**: Success message or validation errors.

## POST /auth/login
Login to an existing account.
- **Request Body**:
  - `email` (string): Must be a valid email.
  - `password` (string): Minimum 8 characters, with at least one letter, one number, and one special character.
- **Response**: Authentication token or validation errors.

## POST /auth/verifyToken
Verify the validity of a token.
- **Request Body**: None.
- **Response**: Success message if token is valid, error otherwise.


# Class Endpoints

## POST /api/classes
Create a new class entry.
- **Request Body**:
  - `studentId` (string): ID of the student.
  - `start` (string): Start time of the class.
  - `end` (string): End time of the class.
  - `price` (int): Price for the class
- **Response**: Success message or validation errors.

## GET /api/classes
Fetch all class entries.
- **Response**: List of classes.

## GET /api/classes/:studentId
Fetch classes for a specific student by their ID.
- **Response**: List of classes or error if the student is not found.

## DELETE /api/classes
Delete a class entry.
- **Request Body**:
  - `id` (string): ID of the class to delete.
- **Response**: Success message or validation errors.

## PUT /api/classes/change-student
Change the student for a class.
- **Request Body**:
  - `studentId` (string): ID of the new student.
  - `id` (string): ID of the class.
- **Response**: Success message or validation errors.

## PUT /api/classes/change-time
Change the time for a class.
- **Request Body**:
  - `start` (string): New start time.
  - `end` (string): New end time.
  - `id` (string): ID of the class.
- **Response**: Success message or validation errors.

## PUT /api/classes/change-status
Change the status of a class (e.g., cancelled).
- **Request Body**:
  - `cancelled` (boolean): Whether the class is cancelled.
  - `id` (string): ID of the class.
- **Response**: Success message or validation errors.

## PUT /api/classes/:id
Update a class entry.
- **Request Body**:
  - `cancelled` (boolean): Whether the class is cancelled.
  - `studentId` (string): ID of the student.
  - `start` (string): Start time of the class.
  - `end` (string): End time of the class.
  - `price` (int): Price for the class.
  - `isPaid` (boolean): Payment status.
- **Response**: Success message or validation errors.


# Dictionary Endpoints

## POST /api/dictionary
Add a new word to the student's dictionary.
- **Request Body**:
  - `studentId` (string): ID of the student.
  - `word` (string): The word to add.
  - `transcription` (string): The transcription of the word.
  - `translation` (string): The translation of the word.
- **Response**: Success message or validation errors.

## GET /api/dictionary/:studentId
Fetch the dictionary for a specific student by their ID.
- **Response**: List of words in the dictionary or error if the student is not found.

## GET /api/dictionary
Fetch all dictionary entries.
- **Response**: List of all words in the dictionary.

## DELETE /api/dictionary
Delete a word from the dictionary.
- **Request Body**:
  - `id` (string): ID of the word to delete.
- **Response**: Success message or validation errors.


# Homework Endpoints

## POST /api/homework
Create a new homework entry.
- **Request Body**:
  - `studentId` (string): ID of the student.
  - `dueDate` (string): The due date of the homework.
  - `content` (string): The content of the homework.
- **Response**: Success message or validation errors.

## GET /api/homework/:studentId
Fetch homework for a specific student by their ID.
- **Response**: List of homework entries or error if the student is not found.

## GET /api/homework
Fetch all homework entries.
- **Response**: List of homework entries.

## DELETE /api/homework
Delete a homework entry.
- **Request Body**:
  - `id` (string): ID of the homework to delete.
- **Response**: Success message or validation errors.

## PUT /api/homework/:id
Update the status of a homework entry (e.g., mark as done).
- **Request Body**:
  - `done` (boolean): Whether the homework is done.
- **Response**: Success message or validation errors.


# Student Endpoints

## GET /api/students
Fetch all students.
- **Response**: List of students.

## GET /api/students/unfiltered
Fetch all students without filters.
- **Response**: List of students.

## GET /api/students/pending
Fetch students with pending status.
- **Response**: List of pending students.

## DELETE /api/students
Delete a student.
- **Request Body**:
  - `id` (string): ID of the student to delete.
- **Response**: Success message or validation errors.

## PUT /api/students
Change the role of a student.
- **Request Body**:
  - `id` (string): ID of the student.
  - `role` (string): New role for the student.
- **Response**: Success message or validation errors.


# Test Endpoints

## POST /api/test/eng
Submit answers for the English test.
- **Request Body**:
  - `answers` (array): Array of answers.
- **Response**: Test result or validation errors.

## POST /api/test/deu
Submit answers for the German test.
- **Request Body**:
  - `answers` (array): Array of answers.
- **Response**: Test result or validation errors.

# Application Endpoints

## GET /api/application
Get all applications
- **Response**: Applications or validation errors.

## POST /api/application
Submit a new application
- **Request Body**:
  - `name` (string)
  - `email` (string)
  - `course` (string)
  - `phoneNumber` (string)
  - `howToConnect` (boolean)
- **Response**: status 201 or validation errors.

## DELETE /api/application
Delete application by id
- **Request Body**:
  - `id` (string)
- **Response**: status 200 or validation errors.

