import https from 'https';

export function fetchWikiSummary(query) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    https.get(url, { headers: { 'User-Agent': 'TourByBihar/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data).extract);
          } catch (e) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function test() {
  const summary = await fetchWikiSummary("Munger Fort");
  console.log("Munger Fort:", summary);
}
test();
