# Contacts Manager Web Application

Welcome to the Contacts Manager Web Application! This is a project for COP4331C. This project is designed to help users efficiently manage their personal and professional contacts through a user-friendly web interface.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **User Authentication**: Secure login and registration system to protect user data.
- **Add New Contacts**: Easily add new contacts with details such as name, email, phone number, and address.
- **View Contacts**: Display a list of all contacts with options to view detailed information.
- **Edit Contacts**: Update existing contact information as needed.
- **Delete Contacts**: Remove contacts that are no longer needed.
- **Search Functionality**: Quickly find contacts using a search bar.

## Technologies Used

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (ES6+)

- **Backend**:
  - PHP
  - MySQL

- **Additional Tools**:
  - Composer (Dependency Management)
  - npm (Node Package Manager)
  - pnpm (Fast, disk space efficient package manager)

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- **Web Server**: Apache or Nginx
- **PHP**: Version 7.4 or higher
- **MySQL**: Version 5.7 or higher
- **Composer**: [Installation Guide](https://getcomposer.org/doc/00-intro.md)
- **Node.js and npm**: [Download and Install](https://nodejs.org/)
- **pnpm**: Install via npm:
  ```bash
  npm install -g pnpm
  ```

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/logan-g-man/contacts-manager.git
   cd contacts-manager
   ```

2. **Backend Setup**:
   - Navigate to the `LAMPAPI` directory:
     ```bash
     cd LAMPAPI
     ```
   - Install PHP dependencies using Composer:
     ```bash
     composer install
     ```
   - Configure your database settings in the `config.php` file:
     ```php
     <?php
     $dbhost = 'localhost';
     $dbuser = 'your_db_username';
     $dbpass = 'your_db_password';
     $dbname = 'contacts_manager';
     ?>
     ```
   - Import the database schema:
     - Create a database named `contacts_manager` in MySQL.
     - Import the provided SQL file to set up the necessary tables.

3. **Frontend Setup**:
   - Navigate back to the root directory:
     ```bash
     cd ..
     ```
   - Install JavaScript dependencies using pnpm:
     ```bash
     pnpm install
     ```

### Running the Application

1. **Start the Backend Server**:
   - Ensure your web server (e.g., Apache) is running and serving the `LAMPAPI` directory.

2. **Start the Frontend Development Server**:
   Make sure you have ran `pnpm install` beforehand
   ```bash
   pnpm run dev
   ```
   - The application will be accessible at `http://localhost:3000`.

## Project Structure

```
contacts-manager/
├── LAMPAPI/                # Backend PHP API
│   ├── config.php          # Database configuration
│   ├── endpoints/          # API endpoints
│   └── ...                 # Other backend files
├── css/                    # CSS stylesheets
├── js/                     # JavaScript files
├── images/                 # Image assets
├── index.html              # Main HTML file
├── package.json            # Node.js dependencies
├── composer.json           # PHP dependencies
└── README.md               # Project documentation
```
