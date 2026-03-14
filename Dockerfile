# syntax=docker/dockerfile:1

FROM oven/bun:1
WORKDIR /app

# Copy dependency files and install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source files
COPY src ./src
COPY index.ts tsconfig.json drizzle.config.ts ./

# Expose application port
EXPOSE 8000

# Run the application
CMD ["sh", "-c", "bun run db:migrate && bun run index.ts"]