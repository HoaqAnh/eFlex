# **eFlex - A Personalized Competency-Based Learning Support System**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-17-blue.svg)](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

This is a "Đồ án Cơ sở" by Software Engineering students. The project aims to build a personalized e-learning system that helps users learn on a customized path, tailored to their abilities and goals.

---

## Interface Overview

|||
| :---: | :---: |
| ![Login](docs/images/login.png) | ![Register](docs/images/register.png) |
| **Login** | **Register** |
| ![Homepage](docs/images/dashboard.png) | ![Course List](docs/images/courses.png) |
| **Homepage** | **Course List** |
| ![Chatbot](docs/images/chatbot.png) | ![Course Details](docs/images/course-details.png) |
| **Chatbot** | **Course Details** |
| ![Lesson Details](docs/images/lesson-details.png) | ![Test List](docs/images/list-test.png) |
| **Lesson Details** | **Test List** |
| ![Multiple-Choice Test](docs/images/test-mc.png) | ![Reading Test](docs/images/test-reading.png) |
| **Multiple-Choice Test** | **Reading Test** |
| ![Listening Test](docs/images/test-listening.png) | ![Lesson Recommendation](docs/images/recommend-lesson.png) |
| **Listening Test** | **Lesson Recommendation** |

---

## Key Features

### For Users (Learners)

-   **Register/Login:** Supports registration via email and login with Google (OAuth2).
-   **Course Discovery:** Search, filter, and view details of available courses.
-   **Personalized Learning Path:** Enroll in courses and track progress through each section and lesson.
-   **Assignments & Tests:** Complete multiple-choice, reading comprehension, and listening tests to reinforce knowledge.
-   **Learning History:** Review enrolled courses and test results.
-   **Recommendation System:** Suggests suitable lessons and courses based on the user's abilities and interests.
-   **Chatbot:** Provides quick answers to inquiries.

### For Administrators (Admin)

-   **Overview Dashboard:** View statistics on access user online counts, courses, and other activities.
-   **User Management:** View the user list, search for users, and lock/unlock accounts.
-   **Course Management:** Add, edit, and delete courses, sections, and lessons.
-   **Test Management:** Create and manage question banks for tests.
-   **Category Management:** Organize courses into specific categories.

---

## Technologies Used

| Backend | Frontend |
| :--- | :--- |
| <ul><li>**Frameworks:** Spring Boot, Spring Security</li><li>**Language:** Java 17</li><li>**Databases:** MySQL, Redis</li><li>**Authentication:** JWT, OAuth 2.0</li><li>**Others:** WebSocket, Cloudinary, Docker, Mail Sender</li></ul> | <ul><li>**Libraries:** ReactJS, React Router</li><li>**Language:** JavaScript (ES14)</li><li>**Styling:** CSS3</li><li>**Package Manager:** NPM</li><li>**API:** Fetch API</li></ul> |

---

### Team Members

| Member Name | Main Role |
| :--- | :--- |
| [Thang Nguyen](https://github.com/imthq1) | System Analysis & Design, Backend Development, Deployment (Docker)|
| [Nguyen Duc Thien](https://github.com/nguyenducthienlq1) | System Analysis & Design, Backend Development |
| [Hoang Anh](https://github.com/HoaqAnh) | UI/UX Design, Frontend Development (ReactJS). |

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
