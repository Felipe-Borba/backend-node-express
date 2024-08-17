# Backend Node Express

This repository is a simple example of

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Running Tests](#running-tests)
- [Docker Setup](#docker-setup)
- [Database Migration](#database-migration)
- [API Documentation with Swagger](#api-documentation-with-swagger)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [MySQL](https://www.mysql.com/) (if not using Docker for the database)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Felipe-Borba/backend-node-express.git
   cd backend-node-express
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Copy the `.env.example` file to `.env` and configure your environment variables:

   ```bash
   cp .env.example .env
   ```

4. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

## Usage

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

The server will start at `http://localhost:3000`.

### Building for Production

To build the project for production:

```bash
npm run build
```

### Running in Production

After building, you can start the production server with:

```bash
npm start
```

## Running Tests

This project uses Jest for testing. To run the tests, use:

```bash
npm test
```

You can also run tests in watch mode:

```bash
npm run test:watch
```

## Docker Setup

### Running with Docker Compose

If you prefer to use Docker, you can start the project using Docker Compose.

1. Build and start the containers:

   ```bash
   docker-compose up --build
   ```

2. The server will be available at `http://localhost:3000`.

### Stopping the Containers

To stop the running containers:

```bash
docker-compose down
```

## Database Migration

This project uses Prisma for database migrations.

### Applying Migrations

To apply migrations:

```bash
npx prisma migrate deploy
```

### Creating a New Migration

To create a new migration:

```bash
npx prisma migrate dev --name migration_name
```

### Database Studio

Prisma provides a UI to interact with your database:

```bash
npx prisma studio
```

## API Documentation with Swagger

This project uses Swagger for API documentation.

### Accessing Swagger UI

To view the Swagger UI, navigate to:

```bash
http://localhost:3000/docs
```

## Project Structure

Briefly describe the project's structure:

```
/src
  /controllers   # Express route handlers
  /middlewares   # Custom middlewares
  /models        # Database models (Prisma schema auto generated)
  /routes        # Express routes
  /services      # Business logic
  /utils         # Utility functions
  app.ts         # Express app configuration
  server.ts      # Server entry point
/prisma
  schema.prisma  # Prisma schema file
/tests         # Unit and integration tests
```

## Technologies

- **Node.js**: JavaScript runtime.
- **TypeScript**: Typed superset of JavaScript.
- **Express**: Web framework for Node.js.
- **Jest**: Testing framework.
- **Docker**: Containerization platform.
- **Docker Compose**: Tool for defining and running multi-container Docker applications.
- **Prisma**: ORM for Node.js and TypeScript.
- **MySQL**: Relational database management system.
- **Swagger**: API documentation tool.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.
