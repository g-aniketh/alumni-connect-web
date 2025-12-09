# Alumni Connect Web - Setup Guide

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Quick Start

Follow these steps to run the application:

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages and dependencies.

### 2. Run Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another port if 5173 is busy).
Open this URL in your browser to view the app.

### 3. Build for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be generated in the `dist` folder.

### 4. Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Check code for linting errors
- `npm run lint:fix` - Auto-fix linting errors
- `npm run format` - Format code with Prettier

## Tech Stack

- **React 19** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Radix UI** - UI components
- **React Hook Form** - Form management
- **Recharts** - Data visualization

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and constants
└── types/          # TypeScript type definitions
```

## Troubleshooting

If you encounter any issues:

1. **Port already in use**: If port 5173 is busy, Vite will automatically use the next available port.
2. **Module not found**: Run `npm install` again to ensure all dependencies are installed.
3. **Build errors**: Make sure you're using Node.js v18 or higher.

---

**Note**: This application is part of the Smart India Hackathon Finals submission.
