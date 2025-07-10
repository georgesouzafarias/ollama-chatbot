# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js CLI chat application that interfaces with Ollama AI models. The application provides an interactive chat experience where users can communicate with AI models through a command-line interface.

## Architecture

The application follows a modular architecture with clear separation of concerns:

- **ChatApplication** (`src/app.js`): Main application controller that orchestrates the chat loop
- **OllamaService** (`src/services/ollama.service.js`): Handles communication with Ollama API, manages conversation context, and processes streaming responses
- **CLIUtils** (`src/utils/cli.utils.js`): Manages command-line interface interactions, input/output, and signal handling
- **Prompts** (`src/utils/prompt.js`): Handles loading and processing of system prompts from markdown files
- **CONFIG** (`src/config/constants.js`): Centralized configuration including Ollama model settings, commands, and UI messages

## Key Commands

### Development
- `npm start` - Run the application
- `npm run dev` - Run with file watching for development

### Testing
- `npm test` - Run all tests with ES modules support
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage reporting
- `npm run test:config` - Run configuration tests only
- `npm run test:prompts` - Run prompt-related tests only

### Coverage
Test coverage reports are generated in the `coverage/` directory with HTML, LCOV, and text formats.

## Project Structure

```
src/
├── app.js                    # Main application entry point
├── config/
│   └── constants.js         # Configuration constants
├── services/
│   └── ollama.service.js    # Ollama API integration
└── utils/
    ├── cli.utils.js         # CLI utilities and interface
    └── prompt.js            # Prompt loading utilities

tests/                       # Jest test files mirroring src/ structure
prompts/
└── system_prompt.md         # System prompt for AI behavior
```

## Configuration

The application is configured through `src/config/constants.js`:

- **MODEL**: Currently using `deepseek-r1:7b` Ollama model
- **STREAM**: Enabled for real-time response streaming
- **THINK**: Enabled for model reasoning display
- **EXIT_COMMANDS**: `['sair', 'exit', 'quit']` for Portuguese/English support
- **SYSTEM_PROMPT_PATH**: Points to `./prompts/system_prompt.md`

## Key Features

1. **Context Management**: Maintains conversation history throughout the session
2. **Streaming Responses**: Real-time AI response streaming to terminal
3. **System Prompts**: Customizable AI behavior through markdown files
4. **Signal Handling**: Proper cleanup on Ctrl+C interruption
5. **Multilingual Support**: Portuguese and English exit commands

## Testing Setup

- Uses Jest with ES modules support (`NODE_OPTIONS='--experimental-vm-modules'`)
- Tests exclude main app.js from coverage
- 10-second timeout for async operations
- Module name mapping handles ES module imports