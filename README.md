# Electron Svelte Template

A modern template for building cross-platform desktop applications using Electron, Svelte, and Vite.

## Features

- 🚀 Fast development with Vite
- ⚡️ Reactive UI with Svelte
- 🖥️ Cross-platform desktop app with Electron
- 🧪 BDD-style testing with Vitest
- 🎨 Consistent 3-space tab formatting
- 🔧 TypeScript support
- 📦 Modern project structure

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/gsenden/electron-svelte-vite-template.git

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint
```

### Building

```bash
# Build the application
npm run build

# Build the Electron app
npm run electron:build
```

## Project Structure

```
├── electron/          # Electron main process
├── src/              # Svelte application
│   ├── routes/       # SvelteKit routes
│   └── lib/          # Shared components and utilities
├── .vscode/          # VS Code settings
└── public/           # Static assets
```

## Features in Detail

### Process Management
- Proper Vite server lifecycle management
- Clean process termination
- Development and production modes

### Testing
- BDD-style tests with describe/it blocks
- Vitest for fast test execution
- Testing Library for component testing

### Code Style
- 3-space tab width
- Prettier for consistent formatting
- ESLint for code quality
- TypeScript for type safety

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
