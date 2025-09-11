# Offshore Developer Technical Test

We have provided you with a git repo which has the following:

- `Data.csv` – A CSV file with campaign and client data
- Prisma schema
- Standard NextJS app
- ShadCN installation
- Prisma installed as a dev dependency

Repo: <https://github.com/journey-further/offshore-dev-test>

---

## Task Requirements

We would like you to complete the following steps:

### 1. Data Ingestion Script

Write a data extractor which will parse the `data.csv` file and:

- Extract all the data.
- Parse it into the correct formats.
- Write it into a database using the provided Prisma schema.
- Ensure you implement the correct relations between the campaigns and the clients.

### 2. Main Dashboard Page

Implement a dashboard within the Next.js app which:

- Displays a list of all clients.
- The list should provide the ability to click through to a specific client's page.
- Displays a row of status cards which show aggregated statistics for:
  - Total Conversions
  - Total Clicks
  - Total Impressions
  - Total Revenue Generated

### 3. Client View Page

Implement a client-specific view page which:

- Displays information about the client (e.g., name, total number of campaigns).
- Displays a row of status cards which show aggregated metrics for the **current client**:
  - Total Budget
  - Most Used Channel
  - Total Impressions
  - Total Clicks
  - Total Conversions
  - Total Revenue Generated
- Displays information about all of the current client’s campaigns in a table.
- The table should have a column for each of the following: `start_date`, `end_date`, `budget`, `channel`, `impressions`, `clicks`, `conversions`, `revenue_generated`, `target_audience`, `status`.

---

## General Guidance

- **Currencies** should always be shown as a currency (e.g., £, $) and not a raw number.
- **Percentages** should always be shown as a percentage with 0 decimal places.
- **Normal numbers** should be formatted with commas using the `en-GB` standard (e.g., 1,234,567).
