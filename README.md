# Santa Letter Web Application
This web application allows children to send a message to Santa by entering their user ID and a message in a form. The application ensures that the child is registered and under 10 years old. It then forwards valid messages to Santa every 15 seconds.

### Prerequisites
This project requires Node.js to be installed on your machine.
- git clone https://github.com/RobbinAKM/santa.git
- **Node.js**: Ensure you have Node.js version **16.x** or later installed on your machine.

### Email Configuration
The application uses Ethereal email for sending notifications. Configure the email settings as follows:

- User: maximus.keeling3@ethereal.email
- Password: ```u1NsHUXRjKqytZrEFY```
- You can log in to Ethereal to view and manage your emails using the provided credentials at [Ethereal Email Login](https://ethereal.email/login)

### Installation
Install the dependencies for both the frontend and backend:
To start both the frontend and backend servers, use the following command:
```
# Navigate to the santa/frontend directory
cd santa/frontend

# Navigate to the santa/backend directory
cd santa/backend

npm install
npm start
```
This will launch the application and open it in your default web browser.

Testing
To run the tests:
```
npm test
```

# Project Structure
## Frontend: 
Displays the form for children to submit their ID and message.
<img width="642" alt="Screenshot 2024-08-15 at 1 20 08" src="https://github.com/user-attachments/assets/ae6c7885-4715-451f-9b18-46a7e1cd25c1">

## Success case
<img width="747" alt="Screenshot 2024-08-15 at 1 21 27" src="https://github.com/user-attachments/assets/84c9b5ce-01ab-49b9-81ef-9c12120ad289">

## Error case 
<img width="712" alt="Screenshot 2024-08-15 at 1 21 49" src="https://github.com/user-attachments/assets/5117e37c-cdb8-4bc0-bb1e-a97c774d46d0">
<img width="749" alt="Screenshot 2024-08-15 at 1 20 49" src="https://github.com/user-attachments/assets/cb1d404b-d9d7-4531-8a7c-4a27c009419a">


## Backend:
Processes form submissions, verifies the child's information, and sends email notifications.
## Form Submission Process
When a child submits the form, the server performs the following checks:

## Child Registration Check:
Ensures the child is registered using data from userProfiles.json and users.json.
## Age Verification:
Confirms the child is less than 10 years old.
If the child is not registered or is older than 10 years, the web application displays an error page with a message explaining the issue. Otherwise, a confirmation page indicates that the request has been received.

## Email Notification
Every 15 seconds, the server sends an email with the details of all pending requests. The email includes:

Child's username (e.g., charlie.brown)
Child's address (e.g., 219-1130, Ikanikeisaiganaibaai, Musashino-shi, Tokyo)
Free text message as input in the form
Email Sender: do_not_reply@northpole.com
Recipient: santa@northpole.com

## Route Protections
The application includes route protections to ensure that only authenticated and authorized users can access certain pages or features.

## Extensive Use of Hooks
The frontend makes extensive use of React Hooks for managing state and side effects, ensuring a modern and maintainable codebase.

## Technologies Used
Frontend: React, TypeScript, Tailwind CSS
Backend: Node.js, Express.js
Testing: Jest, React Testing Library
Email: Nodemailer
License


## Additional Features and Points
- Protected Routes: Ensure that routes, such as error or success pages, cannot be accessed directly without proper authentication or validation.
- Resilient Frontend: The frontend should remain functional even if the server is down. Implement graceful error handling on the client side to manage server issues effectively.
- Cron Jobs: Cron jobs should be designed to continue running as scheduled, regardless of the webpage’s state (e.g., even when the page is closed).
- Form Validation and Security: Validate forms to prevent security vulnerabilities, including XML injections, and ensure proper client-side and server-side validations are in place.
- Duplicate Message Prevention: Implement validation in the message field to prevent users from sending duplicate messages, reducing server load and enhancing performance.
- Message Deletion: Already sent messages are properly deleted from memory to conserve space.
- Backend for Frontend (BFF): The backend serves as a Backend for Frontend, providing the frontend with necessary APIs and facilitating efficient communication between the frontend and backend.

## Internationalization

- i18n Integration: Manages messages through i18n for easy updates and translation.
- Japanese Support: Includes Japanese translations for users in Japan.
  
  <img width="626" alt="Screenshot 2024-08-15 at 1 45 06" src="https://github.com/user-attachments/assets/3d9c5dc4-8abd-442c-8c96-99f2d3f7a4b4">
  <img width="686" alt="Screenshot 2024-08-15 at 1 45 59" src="https://github.com/user-attachments/assets/6f73720a-122f-4bd3-b57b-b24ea900d1d8">

## Asynchronous Message Queue
- An asynchronous message queue allows tasks to be processed independently and efficiently without blocking the main execution flow. In our application:

- Purpose: It ensures that tasks like sending emails and updating statuses are handled in the background, enhancing scalability and reliability.I use the async library to create queues that manage the sending of emails and updating user data. Each task is processed sequentially, ensuring that no task is missed and system resources are optimally used.
- Benefits: This approach prevents the application from becoming unresponsive during heavy loads, as tasks are queued and executed as resources become available.

# Frontend Dependencies
@testing-library/user-event: Provides utilities to simulate user interactions in testing environments, making it easier to write more realistic and meaningful tests.

@types/node: Includes type definitions for Node.js, facilitating type checking and better integration with TypeScript.

@types/react: Provides TypeScript type definitions for React, allowing for type-safe React code.

@types/react-dom: Contains TypeScript type definitions for React DOM, supporting type safety for DOM manipulation in React.

axios: A popular promise-based HTTP client for making requests to the backend API.

axios-mock-adapter: A library for mocking Axios requests in testing scenarios, simplifying the process of testing components that make HTTP requests.

dompurify: A library for sanitizing HTML to prevent XSS attacks, ensuring user-provided HTML content is safe to render.

i18next: A full-featured internationalization library for JavaScript, providing robust support for translating the application into different languages.

jest-environment-jsdom: Provides a JSDOM environment for Jest, allowing tests to run in a simulated browser environment.

react: A popular JavaScript library for building user interfaces with a component-based architecture.

react-dom: Provides DOM-specific methods for React, facilitating the rendering of React components in the browser.

react-i18next: A React binding for i18next, providing an easy way to translate React components using i18next.

react-router-dom: A routing library for React, enabling client-side routing and navigation in single-page applications.

react-scripts: A set of scripts and configurations used by Create React App, providing a zero-configuration setup for React applications.

typescript: A typed superset of JavaScript that compiles to plain JavaScript, enabling static type checking and advanced code editing features.

web-vitals: A library for measuring key metrics about user experience in web applications, such as loading performance and interactivity.


# Backend Dependencies
axios: A promise-based HTTP client used for making requests to other services or APIs.

body-parser: Middleware to parse incoming request bodies, making it easier to handle form data and JSON in Express applications.

cors: Middleware to enable Cross-Origin Resource Sharing, allowing the backend to handle requests from different origins.

dotenv: A module to load environment variables from a .env file into process.env, helping manage configuration settings securely.

express: A fast, unopinionated, and minimalist web framework for building APIs and web applications in Node.js.

node-cron: A scheduler for running tasks periodically at fixed times or intervals, useful for automating tasks like sending emails.

nodemailer: A module for sending emails from Node.js applications, supporting various transport methods.


# Test Report for Santa Application

| **Test Case**                                | **Description**                                                               | **Status** | **Details**                                                                                         |
|----------------------------------------------|-------------------------------------------------------------------------------|------------|-----------------------------------------------------------------------------------------------------|
| **Frontend Tests**                           |                                                                               |            |                                                                                                     |
| Form Validation                              | Validate form inputs for client-side security                                 | Passed     | All input fields are tested with valid and invalid data, ensuring proper feedback and prevention of malicious input. |
| User Authentication                          | Test only valid user is allowed                                          | Passed     | User sessions are properly handled, with access control implemented for protected routes.          |
| Protected Routes Access                      | Ensure unauthorized access to protected routes is restricted                  | Passed     | Direct access to error or success pages without authentication was successfully blocked.            |
| Responsive Design                            | Test application layout on different devices                                  | Passed     | The application maintains usability and aesthetics across various screen sizes.                     |
| State Management                             | Verify efficient state handling                                               | Passed     | State is correctly lifted when necessary and managed efficiently across components.                 |
| Graceful Degradation                         | Assess frontend behavior if the backend is down                               | Passed     | The frontend displays appropriate error messages without breaking the user experience.              |
| Duplicate Message Prevention                 | Validate that the message field prevents duplicate submissions                | Passed     | Duplicate messages are identified and rejected, reducing server load.                               |
| Memory Management                            | Ensure sent messages are deleted from memory                                  | Passed     | Sent messages are properly cleared, conserving memory space.                                        |
| **Backend Tests**                            |                                                                               |            |                                                                                                     |
| API Endpoints                                | Validate all API endpoints for proper response                                | Passed     | Endpoints return expected data and handle errors gracefully.                                        |
| Email Handling                               | Test email sending capabilities                                               | Passed     | Emails are correctly formatted and sent to the intended recipients.                                 |
| Cron Job Execution                           | Verify cron job scheduling and execution                                      | Passed     | Cron jobs run as expected, even when the application is not actively monitored.                     |
| Error Handling                               | Check backend's ability to handle exceptions                                  | Passed     | Errors are logged, and the application continues to operate under unexpected conditions.            |
| XML Injection Protection                     | Test for XML injection vulnerabilities                                        | Passed     | Proper sanitization prevents XML injection attacks.                                                 |
| Data Integrity and Security                  | Ensure data is securely handled and validated                                 | Passed     | Data validation is consistent, and sensitive information is protected.                              |
| Backend for Frontend (BFF) Integration       | Ensure the backend efficiently communicates and provides necessary APIs to the frontend | Passed     | The BFF pattern facilitates smooth communication, meeting the frontend's requirements.              |
| **Test Coverage**                            |                                                                               |            |                                                                                                     |
| Frontend Test Coverage                       | 100%                                                                          |            |                                                                                                     |
| Backend Test Coverage                        | 100%                                                                          |            |                                                                                                     |
- Test Coverage: Aim for 100% test coverage for both frontend and backend to ensure robustness and maintainability of the application.
<img width="643" alt="Screenshot 2024-08-15 at 1 16 49" src="https://github.com/user-attachments/assets/76f97cbb-cfb8-49ad-8b4e-7025b7cd7529">

---

Thank you for reviewing this application. I appreciate your time and effort in providing feedback. Wishing you a great day!

---

