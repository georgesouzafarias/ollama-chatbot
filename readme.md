# JS Ollama Chat

An interactive chat application using Ollama with support for custom system prompts and automatic model validation.

## Features

- **Interactive Chat**: User-friendly CLI interface for AI conversations
- **Automatic Validation**: Verifies and installs Ollama models automatically
- **System Prompts**: Support for custom prompts loaded from files
- **Modular Architecture**: Code organized into reusable services and utilities
- **Complete Testing**: Unit and integration test suite with Jest

## Installation

```bash
npm install
```

## Usage

### Production mode
```bash
npm start
```

### Development mode (with watch)
```bash
npm run dev
```

### Run tests
```bash
npm test
```

## Available Commands

- Type your messages and press Enter to chat
- Type 'sair', 'exit' or 'quit' to exit the application
- Use Ctrl+C to interrupt at any time

## Project Structure

```
src/
├── app.js              # Main application
├── config/
│   └── constants.js    # Global configuration
├── services/
│   ├── model.service.js    # Model management
│   └── ollama.service.js   # Ollama integration
├── utils/
│   ├── cli.utils.js    # CLI utilities
│   └── prompt.js       # Prompt management
└── validators/         # Validators (future)

tests/                  # Unit and integration tests
prompts/               # Custom system prompts
```

## Configuration

Edit `src/config/constants.js` to customize:

- **Ollama Model**: Change the default model
- **Exit Commands**: Configure exit keywords
- **Interface Messages**: Customize displayed messages
- **File Paths**: Configure system prompt locations

## Dependencies

- **ollama**: JavaScript client for Ollama API
- **jest**: Testing framework
- **Node.js**: Version with ES modules support

## Implemented Features

- ✅ Interactive chat with Ollama
- ✅ Automatic model validation and installation
- ✅ Custom system prompt support
- ✅ Unit and integration tests
- ✅ Modular and extensible architecture

## Author

George Farias

## License

MIT