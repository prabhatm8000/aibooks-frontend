# aibooks-frontend

Next.js + TypeScript-based frontend UI for an AI-generated open book platform.

## Table of Contents

- [About the Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Related Projects](#related-projects)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project

aibooks-frontend is the user interface for the AI Books platform. Built with Next.js and TypeScript, it provides functionalities like book management, user authentication, and seamless integration with AI-generated book content.

## Built With

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)

## Getting Started

To set up the project locally, follow these steps.

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/prabhatm8000/aibooks-frontend.git
   cd aibooks-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

### Configuration

Create a `.env.local` file in the root directory and add the following variables:

```env
NEXT_PUBLIC_LOCAL_BACKEND_URL=
NEXT_PUBLIC_PROD_BACKEND_URL=
NEXT_PUBLIC_MODE=
```

Replace the placeholder values with your actual configuration:

- `NEXT_PUBLIC_LOCAL_BACKEND_URL`: The URL of the backend service in the local development environment.
- `NEXT_PUBLIC_PROD_BACKEND_URL`: The URL of the backend service in the production environment.
- `NEXT_PUBLIC_MODE`: Set to `dev` for development or `prod` for production.

### Running the Application

1. **Start the development server:**

   ```bash
   npm run dev
   ```

   The application should now be running at `http://localhost:3000`.

2. **Build for production:**

   ```bash
   npm run build
   npm run start
   ```

   This will generate an optimized production build and start the server.

## Usage

Visit the frontend application to manage books, authenticate users, and interact with the backend services.

## Related Projects

- **Backend Repository:** The backend service for this project can be found at [prabhatm8000/aibooks-backend](https://github.com/prabhatm8000/aibooks-backend).
- **Book Generation Script:** A Python script for generating books using the Gemini API is available at [prabhatm8000/gemini-book-writer](https://github.com/prabhatm8000/gemini-book-writer).

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Prabhat Mishra - [prabhatm8000@gmail.com](mailto:prabhatm8000@gmail.com)

Project Link: [https://github.com/prabhatm8000/aibooks-frontend](https://github.com/prabhatm8000/aibooks-frontend)
