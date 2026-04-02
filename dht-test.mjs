import axios from 'axios';

async function testClearNetDHT(query) {
  let allResults = [];
  
  try {
    const res = await axios.get(`https://apibay.org/q.php?q=${encodeURIComponent(query)}`);
    if (Array.isArray(res.data) && res.data[0].id !== '0') {
      res.data.slice(0, 3).forEach(item => {
        allResults.push(`[${item.seeders} Seeds] ${item.name}`);
      });
    }
  } catch(e) {}

  try {
    const res = await axios.get(`https://torrentcsv.com/api/v1/search?name=${encodeURIComponent(query)}`);
    if (res.data.data) {
      res.data.data.slice(0, 3).forEach(item => {
        allResults.push(`[${item.seeders} Seeds] ${item.name}`);
      });
    }
  } catch(e) {}

  return allResults;
}

async function run() {
  console.log("==========================================");
  console.log(" 🌐 Testing Massive Decentralized Swarms ");
  console.log("==========================================\n");

  const testQueries = ["kali linux", "ubuntu 22.04", "arch linux"];

  for (const q of testQueries) {
      console.log(`\n\n[>>>] Query: "${q}"`);
      const results = await testClearNetDHT(q);
      if (results.length > 0) {
          console.table(results);
      } else {
          console.log(`  ✖ Zero deep web traces found.`);
      }
  }
}

run();
