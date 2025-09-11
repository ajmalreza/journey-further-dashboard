## Project Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/journey-further/offshore-dev-test
   cd offshore-dev-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up the database**
   ```bash
   # Start PostgreSQL database using Docker
   docker-compose up -d
   
   # Run Prisma migrations
   npx prisma migrate dev
   ```

4. **Load data into the database**
   
   You have two options to load the data:
   
   **Option A: Use the web UI (Recommended)**
   - Start the development server first: `npm run dev`
   - Navigate to [http://localhost:3000/upload](http://localhost:3000/upload)
   - Upload the `data.csv` file through the web interface
   
   **Option B: Use the command line script**
   ```bash
   # This will parse data.csv and populate the database
   npm run ingest-data
   # or
   yarn ingest-data
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run ingest-data` - Run the data ingestion script
- `npx prisma studio` - Open Prisma Studio to view database data

### Database Schema

The project uses Prisma with PostgreSQL. The schema includes:

- **Clients** - Client information and metadata
- **Campaigns** - Campaign data linked to clients
- Relations between clients and campaigns

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── client/            # Client-specific pages
│   ├── dashboard/         # Dashboard page
│   └── upload/            # File upload functionality
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── scripts/              # Data ingestion and utility scripts
└── data.csv              # Source data file
```