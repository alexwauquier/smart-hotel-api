<div align="center">
  <h1>Smart Hotel API</h1>

  <h3>A RESTful API built with Express for the Smart Hotel project</h3>

  <h4>
    <a href="https://github.com/alexwauquier/smart-hotel-api/blob/main/README.fr.md">French README</a>
    •
    <a href="#project-overview">Project Overview</a>
    •
    <a href="#getting-started">Getting Started</a>
    •
    <a href="#available-routes">Available Routes</a>
  </h4>

  <img src="https://img.shields.io/github/v/release/alexwauquier/smart-hotel-api" />
</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the API Locally](#running-the-api-locally)
  - [Development Database with Docker](#development-database-with-docker)
- [Available Routes](#available-routes)
  - [Authentication](#authentication)
  - [Customers](#customers)
  - [Employees](#employees)
  - [Products](#products)

## Project Overview

The Smart Hotel API is the backend for [mobile app](https://github.com/alexwauquier/smart-hotel-mobile-app) and [web app](https://github.com/alexwauquier/smart-hotel-web-app) of the Smart Hotel project, a second-year project in cybersecurity, computer science and networks. It is designed to manage the hotel's bar orders and environmental sensors.

## Technologies Used

- **Node.js**
- **Express**
- **PostgreSQL**
- **Docker**

## Getting Started

### Requirements 

- [Node.js](https://nodejs.org/) (>= 22.9.0)
- [PostgreSQL](https://www.postgresql.org/) (if not using Docker)
- [Docker](https://www.docker.com/) (for containerized development)

### Installation

1. Clone the repository:
```
git clone https://github.com/alexwauquier/smart-hotel-api.git
```

2. Navigate to the project directory:
```
cd smart-hotel-api
```

3. Install dependencies:
```
npm install
```

### Configuration

This project includes a default `.env.development` file. You can override this by adding your own environment variables to the `.env.development.local` file. The application will automatically load variables from both files, with the .env.development.local file taking priority.

| Variable    | Description                    | Default value  |
| ----------- | ------------------------------ | -------------- |
| PORT        | Port on which the API will run | 3000           |
| DB_USER     | Database username              | smarthotel     |
| DB_PASSWORD | Database password              | smarthotel     |
| DB_HOST     | Database host                  | localhost      |
| DB_PORT     | Database port                  | 5432           |
| DB_NAME     | Database name                  | smart_hotel_db |
| JWT_SECRET  | JWT secret key                 | smarthotel     |

### Running the API Locally

To start the API in development mode with automatic restarts:
```
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### Development Database with Docker

For local development, a PostgreSQL database can be set up using Docker Compose. A `compose.development.yaml` file is provided for this setup.

To start the database:
```
docker compose -f compose.development.yaml up -d
```

This will launch a PostgreSQL container with the required configuration for testing the API.

## Available Routes

### Authentication

| Method | Endpoint                 | Description                                       |
| ------ | ------------------------ | ------------------------------------------------- |
| POST   | /api/auth/login/customer | Authenticates a customer and returns a JWT token  |
| POST   | /api/auth/login/employee | Authenticates an employee and returns a JWT token |

### Customers

| Method | Endpoint           | Description                        |
| ------ | ------------------ | ---------------------------------- |
| GET    | /api/customers     | Returns all customers              |
| GET    | /api/customers/:id | Returns a single customer by ID    |
| POST   | /api/customers     | Creates a new customer             |
| PUT    | /api/customers/:id | Updates an existing customer by ID |
| DELETE | /api/customers/:id | Deletes a customer by ID           |

### Employees

| Method | Endpoint           | Description                        |
| ------ | ------------------ | ---------------------------------- |
| GET    | /api/employees     | Returns all employees              |
| GET    | /api/employees/:id | Returns a single employee by ID    |
| POST   | /api/employees     | Creates a new employee             |
| PUT    | /api/employees/:id | Updates an existing employee by ID |
| DELETE | /api/employees/:id | Deletes a employee by ID           |

### Products

| Method | Endpoint          | Description                       |
| ------ | ----------------- | --------------------------------- |
| GET    | /api/products     | Returns all products              |
| GET    | /api/products/:id | Returns a single product by ID    |
| POST   | /api/products     | Creates a new product             |
| PUT    | /api/products/:id | Updates an existing product by ID |
| DELETE | /api/products/:id | Deletes a product by ID           |
