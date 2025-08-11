# API Gateway

A lightweight Express.js-based API Gateway that routes requests to multiple microservices based on YAML configuration.

## Features

- **YAML Configuration**: Easy-to-read YAML configuration for defining services and routes
- **Dynamic Routing**: Automatically routes requests to configured microservices
- **Path Resolution**: Intelligent path resolution that strips the gateway route prefix
- **Schema Validation**: Built-in validation using Zod to ensure configuration integrity
- **Flexible Port Configuration**: Configurable port via environment variable or config file

## Installation

```bash
# Install dependencies
npm install

# Or using pnpm
pnpm install
```

## Configuration

Create a YAML configuration file to define your services. Here's an example:

```yaml
# config.yaml
port: 1810

services:
  - name: auth
    endpoint: http://localhost:3000
    route: /auth

  - name: cart
    endpoint: http://localhost:4000
    route: /cart

  - name: orders
    endpoint: http://localhost:5000
    route: /orders
```

### Configuration Schema

- `port` (optional): The port on which the gateway will run (defaults to 1810 or PORT environment variable)
- `services`: Array of service configurations
  - `name`: Human-readable name for the service
  - `endpoint`: The full URL of the target microservice
  - `route`: The route prefix that will be proxied to this service

## Usage

### Running the Gateway

```bash
# Development mode with auto-restart
npm run dev -- -c config.yaml

# Production mode
npm start -- -c config.yaml

# Using environment variable for port
PORT=3000 npm start -- -c config.yaml
```

### Command Line Arguments

- `-c, --conf <path>`: Path to the configuration file (required)

### Path Examples

With the above configuration, requests will be routed as follows:

- `GET /auth/login` → `http://localhost:3000/login`
- `POST /cart/items` → `http://localhost:4000/items`
- `GET /orders/123` → `http://localhost:5000/123`

The gateway automatically strips the route prefix (`/auth`, `/cart`, `/orders`) when forwarding requests to the target services.

## Development

### Project Structure

```
├── index.js              # Main application entry point
├── package.json          # Project dependencies and scripts
├── utils/
│   ├── config.js         # Configuration loading and parsing
│   └── schema.js         # Zod schema for configuration validation
└── tests/
    ├── config.test.js    # Configuration utility tests
    └── data/             # Test configuration files
        ├── valid.yaml
        ├── invalid_schema.yaml
        └── error.yaml
```

### Running Tests

```bash
npm test
```

Tests include:
- Valid configuration parsing
- Invalid YAML handling
- Schema validation error handling

### Dependencies

- **express**: Web framework for Node.js
- **express-http-proxy**: HTTP proxy middleware for Express
- **yaml**: YAML parser and stringifier
- **zod**: TypeScript-first schema validation

## Environment Variables

- `PORT`: Override the port specified in the configuration file

## Error Handling

The gateway includes robust error handling for:
- Missing configuration files
- Invalid YAML syntax
- Schema validation failures
- Invalid file paths

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Example Use Cases

- **Microservices Architecture**: Route requests to different microservices based on path prefixes
- **API Versioning**: Route different API versions to different service instances
- **Load Balancing**: Distribute requests across multiple service instances
- **Development Environment**: Easily switch between different service endpoints for testing

## Troubleshooting

### Common Issues

1. **Configuration file not found**: Ensure the path provided with `-c` flag is correct
2. **Port already in use**: Change the port in configuration or set the PORT environment variable
3. **Service unreachable**: Verify that target microservices are running and accessible

### Debug Mode

Run with additional logging by setting the DEBUG environment variable:

```bash
DEBUG=* npm start -- -c config.yaml
```
