import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    let resolved = false;
    const timer = setTimeout(() => { if (!resolved) { resolved = true; resolve(''); } }, 3000);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        clearTimeout(timer);
        return fetchHtml(res.headers.location).then(resolve).catch(reject);
      }
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        if (!resolved) { resolved = true; clearTimeout(timer); resolve(html); }
      });
    }).on('error', (e) => {
        if (!resolved) { resolved = true; clearTimeout(timer); resolve(''); }
    });
  });
}

export async function fetchSummary(placeName, district) {
  try {
    // Try Wikipedia First
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`;
    const wikiData = await new Promise(resolve => {
        https.get(wikiUrl, { headers: { 'User-Agent': 'TourApp/1.0' }}, res => {
            let data = "";
            res.on('data', c => data += c);
            res.on('end', () => {
                try { resolve(JSON.parse(data).extract); } catch(e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
    
    if (wikiData && wikiData.length > 50 && !wikiData.includes("may refer to")) {
        return wikiData.substring(0, 300) + (wikiData.length > 300 ? "..." : "");
    }

    // Fallback to DuckDuckGo snippet
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(placeName + ' ' + district + ' history tourism')}`;
    const ddgHtml = await fetchHtml(ddgUrl);
    
    const snippetRegex = /<a class="result__snippet[^>]*>(.*?)<\/a>/s;
    const match = snippetRegex.exec(ddgHtml);
    if (match && match[1]) {
        let text = match[1].replace(/<b>/g, '').replace(/<\/b>/g, '').trim();
        if (text.length > 40) return text;
    }

    return null;
  } catch (e) {
    return null;
  }
}

async function test() {
    console.log("Testing Golghar:");
    console.log(await fetchSummary("Golghar", "Patna"));
    console.log("Testing Kauadol:");
    console.log(await fetchSummary("Kauadol", "Jehanabad"));
}

test();
