# Scripts

This directory contains utility scripts for the application.

## Data Ingestion Script

The `ingest-data.js` script parses the `data.csv` file and populates the database with client and campaign data.

### Features

- **Data Validation**: Filters out empty rows and invalid records
- **Date Parsing**: Handles multiple date formats (YYYY-MM-DD, DD/MM/YYYY)
- **Number Parsing**: Removes currency symbols and handles "N/A" values
- **Client Management**: Creates unique clients and establishes relationships
- **Campaign Management**: Creates/updates campaigns with proper client relations
- **Error Handling**: Comprehensive error reporting and data integrity verification

### Usage

```bash
# Run the data ingestion script
npm run ingest-data

# Or run directly with node
node scripts/ingest-data.js
```

### Prerequisites

1. Database must be running (use `docker-compose up -d`)
2. Prisma migrations must be applied (`npx prisma migrate dev`)
3. `data.csv` file must exist in the project root

### Data Processing

The script handles various data quality issues:

- **Empty rows**: Automatically filtered out
- **Date formats**: Supports both ISO (YYYY-MM-DD) and European (DD/MM/YYYY) formats
- **Currency symbols**: Removes $, £, and commas from numeric values
- **Missing values**: Converts "N/A" and empty strings to null
- **Status normalization**: Ensures consistent status values (Completed, Active, Planned)

### Output

The script provides detailed logging including:
- Number of records processed
- Client creation status
- Campaign creation status
- Data integrity verification
- Summary statistics
