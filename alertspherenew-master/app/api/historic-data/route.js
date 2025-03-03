// app/api/users/route.ts
import { NextResponse } from 'next/server';
// import { db } from '@/db/client';
// import { historic } from '@/db/schema';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse'; // PapaParse library


export async function GET() {
    const csvFilePath = path.join(process.cwd(),'app', 'data', 'filtered_data.csv');
  const csvFile = fs.readFileSync(csvFilePath, 'utf8'); // Read the CSV file

  // Parse CSV using PapaParse
  const results = Papa.parse(csvFile, { header: true });


  return NextResponse.json(results);
}
