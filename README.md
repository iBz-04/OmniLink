# OmniLink

OmniLink is a platform designed to help integrate GPT models and calculate your api key usage in realtime. It provides both a web application and a desktop application powered by Electron.

## Features

- Chat-based interface for interacting with GPT models.
- Configurable settings and flexible model parameters.
- Desktop integration with tray support and system notifications.
- Multi-language support via i18next.
- Fast development builds using Vite and TypeScript.

## Demo

https://github.com/user-attachments/assets/6da4ee29-6025-4859-bbee-10b1042202a9

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/) (Install globally with `npm install -g pnpm`)
- [Git](https://git-scm.com/)

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository_url>
cd OmniLink
pnpm install
```

### Running in Development Mode

#### Web Application

To run the web application in development mode with hot reloading:

```bash
pnpm dev
```

#### Desktop Application (Electron)

For local development of the desktop version:

```bash
pnpm electron
```

### Building the Application

#### Web Build

Create a production build of the web application:

```bash
pnpm build
```

The output will be in the `dist` folder.

#### Desktop Build

Build and package the desktop application using Electron:

```bash
pnpm make
```

The packaged application will be available in the `release` directory.

### Testing, Formatting, and Linting

- **Linting:** Run TypeScript and ESLint checks:

  ```bash
  pnpm lint
  ```

- **Formatting:** Format the code using Prettier:

  ```bash
  pnpm format
  ```

## Deployment

While OmniLink was previously configured for GitHub Pages, it is now deployed on [Vercel](https://vercel.com/). Simply deploy the contents of the `dist` folder for your web application.

## Development Guidelines

- This project uses [Vite](https://vitejs.dev/) for fast development builds and hot module replacement.
- The desktop app is built with [Electron](https://www.electronjs.org/). Check the `electron` directory for main process code.
- Follow the established code style guidelines using Prettier and ESLint.
- Ensure that all environment variables (e.g., `VITE_GOOGLE_CLIENT_ID`) are correctly set in your deployment environment.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes with clear commit messages.
4. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or feedback, please contact [Ibrahim Rayamah](mailto:ibz.04dev@gmail.com).
