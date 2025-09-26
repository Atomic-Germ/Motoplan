# Motorcycle Trip Planner - API

This service provides backend APIs for the Motorcycle Trip Planner app.

Quick start (development):

1. Copy environment variables: `cp .env.example .env`
2. Install dependencies: `npm install`
3. Run locally: `npm run dev`
4. Start DB and API with Docker Compose: `docker compose -f ../infra/docker-compose.yml up --build`

Endpoints:
- GET /health - basic health check
- GET /api/plans - sample plan endpoint (returns mock data for now)

## Tests

This project uses Jest with ts-jest to run unit tests for TypeScript sources. The tests are written in a TDD style (write failing test first, implement minimal code, refactor).

Run tests:

1. Install dependencies: `npm install`
2. Run the test suite once: `npm test`
3. Run tests with watch mode: `npm run test:watch`

Key test files:
- `src/__tests__/planner.test.ts` - basic PlannerService behavior
- `src/__tests__/planner.options.test.ts` - verifies option forwarding and adapter behavior

Next test tasks:
- Add integration tests for the routing engine adapter against a local OSRM/GraphHopper instance
- Add end-to-end tests for API endpoints

Next steps:
- Add TypeORM entities for routes, POIs, users
- Integrate routing adapter (GraphHopper/OSRM)
- Add migrations and tests

## Coverage

Unit tests collect coverage via Jest. Running `npm test` in the `api/` folder will generate a `coverage/` directory with the report.

CI uploads coverage reports to Codecov (when `CODECOV_TOKEN` is configured in repository secrets) and also stores the coverage artifact on workflow runs.

## Triggering CI via GitHub CLI

You can manually trigger the CI workflow (or rerun it) from your terminal using the `gh` CLI. Example:

```bash
# Trigger the default CI workflow (runs api tests and integration job)
gh workflow run ci.yml

# Or monitor recent workflow runs
gh run list --workflow=ci.yml
```

The CI includes an `Integration Tests (stub)` job that runs lightweight HTTP-based routing integration tests (useful before adding a full OSRM/GraphHopper job).
