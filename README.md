<p align="center">
    <a href="https://placebase.xyz">
        <picture>
            <source srcset=".github/assets/logo.svg">
            <img alt="Placebase Logo" src=".github/assets/logo.svg" width="72" />
        </picture>
    </a>
</p>

<h1 align="center">
    Placebase - Geographical Data API
</h1>

<p align="center">
    RESTful API providing global countries, regions and cities data.
</p>

## Documentation

API documentation can be found at [placebase.xyz/docs](https://placebase.xyz/docs)

## Getting Started

### Prerequisites

Before you begin, you will need one of the following:

- Node.js >= 22.0.0
- Docker along with the Docker Compose plugin

### Installation

1. (Docker only) Start the development environment

Enter the workspace container using the dev.sh helper script:

```sh
./dev.sh shell
```

or by running docker compose directly:

```sh
docker compose run --rm workspace bash
```

2. Install Dependencies

```sh
npm install
```

This will install dependencies for the root package and for all npm workspaces (api, web, proxy).

3. Set environment variables

Each package has its own .env file. Create the `.env` files using `.env.example` as a template
and fill them with your values:

```sh
cp api/.env.example api/.env
cp web/.env.example web/.env
```

### Development

Run all the development servers concurrently:

```sh
npm run dev
```

By default, the API will be served on `http://localhost:3000` and the website on `https://localhost:5173`.

## Built With

- Fastify
- Swagger
- SQLite
- Firebase (Auth and Firestore)
- SvelteKit

## Credits

This project uses data provided by [Countries States Cities Database](https://github.com/dr5hn/countries-states-cities-database)
Licensed under ODbL v1.0
