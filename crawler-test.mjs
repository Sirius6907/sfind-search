import axios from 'axios';

async function scanDeepWeb(query) {
  let allResults = [];
  
  // Safe Tor Gateway Indexer (Ahmia clear-net)
  const torGatewayUrl = `https://ahmia.fi/search/?q=${encodeURIComponent(query)}`;
  
  try {
    const res = await axios.get(torGatewayUrl, { timeout: 8000 });
    
    // Regex dark web HTML for raw Magnet URIs or 40-char SHA1 Info-Hashes
    const magnetRegex = /(magnet:\?xt=urn:btih:[a-zA-Z0-9]{40}[^\s"']+)/gi;
    const hashRegex = /[^a-zA-Z0-9]([a-fA-F0-9]{40})[^a-zA-Z0-9]/g;
    
    let html = res.data;
    let m;
    while ((m = magnetRegex.exec(html)) !== null) {
      allResults.push({ source: 'Tor Gateway', type: `Deep Web Payload (Regex Match)`, value: m[1].substring(0,60) + "..." });
    }
    while ((m = hashRegex.exec(html)) !== null) {
      allResults.push({ source: 'Tor Gateway', type: `Deep Web Hash Node`, value: m[1] });
    }
  } catch(e) {
      console.log(`Gateway error: ${e.message}`);
  }

  // Deduplicate results
  const unique = Array.from(new Set(allResults.map(a => a.value)))
    .map(value => allResults.find(a => a.value === value));
    
  return unique;
}

// Test varying highly-censored or deep-web oriented queries
async function runTests() {
  console.log("==========================================");
  console.log(" 🕵️  Deep-Web & Tor Gateway Extraction Test ");
  console.log("==========================================\n");

  const testQueries = [
    "WikiLeaks Insurance File AES256",
    "Windows XP source code leak magnet",
    "Twitter algorithm source code leak"
  ];

  for (const q of testQueries) {
      console.log(`\n\n[>>>] Injecting Query: "${q}"`);
      const results = await scanDeepWeb(q);
      
      if (results.length > 0) {
          console.table(results);
      } else {
          console.log(`  ✖ Zero deep web traces found.`);
      }
  }
}

runTests();
