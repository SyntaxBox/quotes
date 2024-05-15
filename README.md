# Quotes API
This is a Quotes API developed using NestJS framework, which provides a simple RESTful interface for managing quotes.

## Project Structure
```
.
├── nest-cli.json                 # Nest CLI configuration file
├── package-lock.json             # Package lock file for npm
├── package.json                  # Project metadata and dependencies
├── prisma                        # Prisma configuration and schema
│  └── schema.prisma              # Prisma schema definition
├── README.md                     # This file
├── src                           # Source code directory
│  ├── app.module.ts              # Main application module
│  ├── auth                       # Authentication module
│  │  ├── __mocks__               # Mocks for testing
│  │  ├── __tests__               # Unit tests for authentication
│  │  ├── auth.controller.ts      # Authentication controller
│  │  ├── auth.module.ts          # Authentication module
│  │  ├── auth.service.ts         # Authentication service
│  │  └── google.strategy.ts      # Google authentication strategy
│  ├── main.ts                    # Entry point of the application
│  ├── prisma                     # Prisma module
│  │  ├── prisma.module.ts        # Prisma module definition
│  │  └── prisma.service.ts       # Prisma service
│  ├── quotes                     # Quotes module
│  │  ├── __mocks__               # Mocks for testing
│  │  ├── __tests__               # Unit tests for quotes
│  │  ├── quotes.controller.ts    # Quotes controller
│  │  ├── quotes.module.ts        # Quotes module
│  │  └── quotes.service.ts       # Quotes service
│  └── shared                     # Shared utilities and components
│     ├── decorators              # Custom decorators
│     ├── dtos                    # Data transfer objects
│     ├── guards                  # Guards for routes
│     ├── interceptors            # Interceptors for request/response
│     ├── middleware              # Middleware functions
│     ├── pipes                   # Custom pipes for request data validation
│     ├── types                   # Custom types/interfaces
│     ├── utils                   # Utility functions
│     └── validators              # Input validators
├── tsconfig.build.json           # TypeScript configuration for build
└── tsconfig.json                 # TypeScript configuration

```

## Environment Variables

- `GOOGLE_OAUTH_CLIENT_ID`: Client ID for Google OAuth authentication (used in `src/auth/google.strategy.ts`).
- `GOOGLE_OAUTH_CLIENT_SECRET`: Client secret for Google OAuth authentication (used in `src/auth/google.strategy.ts`).
- `JWT_KEY`: Secret key for JWT authentication (used in `src/app.module.ts`).
- `DATABASE_URL`: URL for the database connection (used in `prisma/schema.prisma`).


## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/qhamid/quotes
    ```

2. Install dependencies:

    ```bash
    npm install
    ```


3. Run migrations:

    ```bash
    npx prisma migrate dev
    ```

4. Start the server:

    ```bash
    npm run start:dev
    ```

5. Testing

    To run tests:
    ```bash
    npm run test
    ```
7. Documentation

    API documentation Will be provided **soon**
