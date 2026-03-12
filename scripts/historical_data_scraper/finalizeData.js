import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function mergeData() {
    console.log("Reading existing static 17 districts...");
    const tsFile = path.join(__dirname, '../src/data/biharTourismDataExtensive.ts');
    let content = fs.readFileSync(tsFile, 'utf-8');
    
    // Extract JSON part
    const regex = /export const biharTourismData: Record<string, BiharTourismInfo> = ([\s\S]+);\n?$/;
    const match = content.match(regex);
    if (!match) throw new Error("Could not find biharTourismData export in TS file");
    
    let existingData;
    try {
         existingData = JSON.parse(match[1]);
    } catch (e) {
         console.error("Failed to parse existing ts data JSON");
         throw e;
    }

    console.log(`Found ${Object.keys(existingData).length} existing districts.`);

    console.log("Reading dynamically scraped 21 districts...");
    const jsonFile = path.join(__dirname, 'remainingCompiled.json');
    if (!fs.existsSync(jsonFile)) throw new Error("remainingCompiled.json not found! Wait for scraper to finish.");
    const scrapedData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    console.log(`Found ${Object.keys(scrapedData).length} newly scraped districts.`);

    const mergedData = { ...existingData, ...scrapedData };
    console.log(`Total merged districts: ${Object.keys(mergedData).length}`);

    // Generate output
    const newTsContent = content.replace(regex, `export const biharTourismData: Record<string, BiharTourismInfo> = ${JSON.stringify(mergedData, null, 2)};\n`);
    
    fs.writeFileSync(tsFile, newTsContent, 'utf-8');
    console.log("Successfully compiled biharTourismDataExtensive.ts with all 38 districts!");
}

mergeData();
