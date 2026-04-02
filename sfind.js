#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import inquirer from 'inquirer';
import ora from 'ora';
import WebTorrent from 'webtorrent';
import { execSync } from 'child_process';

// Sequence Folder Generator
function getNextDownloadPath() {
   let i = 1;
   while (fs.existsSync(path.resolve(process.cwd(), `sfind-${i}`))) {
       i++;
   }
   const finalPath = path.resolve(process.cwd(), `sfind-${i}`);
   fs.mkdirSync(finalPath, { recursive: true });
   return finalPath;
}

// Smart Parser: Breaks raw string into Core Query + Hints array
function parseQuery(rawString) {
  const parts = rawString.split(',').map(s => s.trim()).filter(s => s.length > 0);
  const core = parts[0];
  const hints = parts.slice(1).map(h => h.replace(/hint-/gi, '').trim());
  return { core, hints };
}

// Variant Generator
function generateVariants(coreTopic) {
  const base = coreTopic.toLowerCase().replace(/(leak|source|code)/g, '').trim();
  return Array.from(new Set([
    coreTopic,
    `${base} leak`,
    `${base} 2.1.88`,
    `claude-code-2.1.88.tgz`
  ]));
}

// Enterprise Intelligence Scraper
async function scrapeNetwork(variants, hints) {
  let allResults = [];
  
  // Combine hints into an aggressive search sub-string if available
  const hintStr = hints.length > 0 ? " " + hints.join(" ") : "";

  // Node 1: Archive.org
  try {
    for (const v of variants) {
      if (v.includes('claude') || v.includes('tgz') || v.includes('npm')) {
        const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=unpkg.com/*claude-code*&output=json&limit=5`;
        const res = await axios.get(cdxUrl, { timeout: 8000 });
        if (res.data && res.data.length > 1) {
          for (let i = 1; i < res.data.length; i++) {
            allResults.push({
              source: 'Archive.org',
              name: `Recovered NPM Tarball [${res.data[i][1]}]`,
              size: '60+ MB',
              score: hints.length > 0 ? 5 : 0, // baseline
              magnet: `archive:https://web.archive.org/web/${res.data[i][1]}/${res.data[i][0]}`
            });
          }
        }
      }
    }
  } catch(e) {}

  // Node 2: GitHub Intelligence (Scores repos hitting hints)
  try {
    for (const v of variants) {
      // Query specific to variants
      const gitUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(v)}`;
      const res = await axios.get(gitUrl, { timeout: 6000, headers: { 'User-Agent': 'sfind-enterprise' }});
      if (res.data && res.data.items) {
        res.data.items.slice(0, 10).forEach(repo => {
          let score = 0;
          const blob = (repo.description + " " + repo.full_name).toLowerCase();
          
          // Smart Hint Matching
          hints.forEach(hint => {
            const h = hint.toLowerCase();
            // Assign massive scoring multipliers if hints (e.g. 1900, map) are found natively in repo descriptions!
            if (blob.includes(h)) score += 50; 
            const parts = h.split(' ');
            parts.forEach(p => { if (p.length > 3 && blob.includes(p)) score += 10; });
          });

          // Core keyword matching
          if (blob.includes('source') || blob.includes('map')) score += 10;

          allResults.push({
             source: 'GitHub Network',
             name: `${repo.full_name} (${repo.description || 'Forked Leak'})`,
             size: 'Repo',
             score: score,
             magnet: `git:${repo.clone_url}` 
          });
        });
      }
    }
  } catch(e) {}

  // Sort by intelligence scores, deduplicate
  const unique = Array.from(new Set(allResults.map(a => a.magnet)))
    .map(magnet => allResults.find(a => a.magnet === magnet))
    .sort((a,b) => b.score - a.score);
    
  return unique;
}

async function downloadPayload(targetStr) {
  console.log('\n');
  const dPath = getNextDownloadPath();
  const spinner = ora(`Initializing Safe Operations Directory -> ${dPath}`).start();

  if (targetStr.startsWith('archive:')) {
     const url = targetStr.replace('archive:', '');
     try {
       spinner.text = `Downloading raw archive into isolation sequence -> ${dPath}`;
       const res = await axios.get(url, { responseType: 'stream', headers: { 'User-Agent': 'Mozilla/5.0' } });
       const dest = path.join(dPath, 'leak_archive.tgz');
       const writer = fs.createWriteStream(dest);
       res.data.pipe(writer);
       
       writer.on('finish', () => {
          spinner.succeed(`Secure HTTP Download Complete! Payload secured inside -> ${dPath}`);
          process.exit(0);
       });
     } catch(e) {
       spinner.fail(`Archive.org firewall blocked connection.`);
       process.exit(1);
     }

  } else if (targetStr.startsWith('git:')) {
     const url = targetStr.replace('git:', '');
     try {
       spinner.text = `Cloning remote decentralized framework into sequence -> ${dPath}`;
       // We clone into a sub-folder to keep it clean if needed, actually let's clone precisely INTO the sfind-# folder.
       // Git clone requires directory to be empty, which it is since we just made it.
       execSync(`git clone ${url} .`, { stdio: 'ignore', cwd: dPath });
       spinner.succeed(`Framework Successfully Installed into Isolation Folder -> ${dPath}`);
       process.exit(0);
     } catch(e) {
       spinner.fail(`Git cloning failed: ${e.message}`);
       process.exit(1);
     }
  }
}

async function run() {
  console.log("\n==============================================");
  console.log(" 🌐 sfind: AI-Hinted Enterprise Scraper ");
  console.log("==============================================\n");

  const queryRaw = process.argv.slice(2).join(' ');
  if (!queryRaw) {
    console.error("Usage: sfind [search topic, hint1, hint2]");
    process.exit(1);
  }

  const { core, hints } = parseQuery(queryRaw);
  const spinner = ora(`Engaging Core Semantic Extraction for -> "${core}"`).start();
  
  if (hints.length > 0) {
      spinner.succeed(`Discovered Core Target: [${core}]`);
      spinner.start(`Injecting ${hints.length} Smart AI Hint Trajectories -> [ ${hints.join(' | ')} ]`);
  }

  const variants = generateVariants(core);
  spinner.text = (`Analyzing cross-network nodes with Smart Weighting Algorithms...`);

  const results = await scrapeNetwork(variants, hints);
  if (results.length === 0) {
    spinner.fail("Absolute zero traces across all protocol layers given those parameters.");
    process.exit(1);
  }
  
  spinner.succeed(`Enterprise Scan Complete! Discovered an sorted ${results.length} encrypted/archived payloads via hint intelligence.`);

  const choices = results.slice(0, 15).map(r => ({
    name: `[Score: ${r.score}] [${r.source}] ${r.name}`,
    value: r.magnet
  }));

  choices.push(new inquirer.Separator());
  choices.push({ name: 'Exit (Cancel Download)', value: 'EXIT' });

  console.log('\n');
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedPayload',
      message: 'Select the optimal targeted payload based on intelligent scoring:',
      choices: choices,
      pageSize: 18
    }
  ]);

  if (answer.selectedPayload === 'EXIT') {
    console.log("Operation aborted.");
    process.exit(0);
  }

  await downloadPayload(answer.selectedPayload);
}

run().catch(e => {
  console.error("Fatal exception:", e.message);
  process.exit(1);
});
