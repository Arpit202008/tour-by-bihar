import fs from 'fs';
import https from 'https';

const url = 'https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson';

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return download(res.headers.location).then(resolve).catch(reject);
      }
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => {
         try {
             const data = JSON.parse(rawData);
             const biharFeatures = data.features.filter(f => {
                 const props = f.properties || {};
                 const st = props.NAME_1 || props.st_nm || '';
                 return st.toLowerCase() === 'bihar';
             });
             
             if (biharFeatures.length > 5) {
                 fs.writeFileSync('./public/bihar.geojson', JSON.stringify({
                     type: 'FeatureCollection',
                     features: biharFeatures
                 }));
                 resolve(true);
             } else {
                 resolve(false);
             }
         } catch(e) {
             resolve(false);
         }
      });
    }).on('error', reject);
  });
}

download(url).then(success => {
    if(success) console.log('Successfully found and saved Bihar districts');
    else console.log('Failed to extract Bihar.');
});
