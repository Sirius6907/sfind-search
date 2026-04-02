# sfind - The Enterprise-Grade Intelligence Scraper

`sfind` is an ultra-powerful, command-line multi-protocol engine designed to autonomously hunt, scrape, and securely recover archived, censored, or decentralized payloads natively from the terminal. 

It seamlessly proxies queries across Clear-Net, standard DHT torrent trackers, Internet Archive Wayback snapshots, and GitHub forks, bypassing firewalls and DMCA censorship to recover absolute source files safely.

## Core Features
*   **AI Semantic Expansion:** Input a raw query, and `sfind` intelligently expands it into standard developer aliases and hacker footprints.
*   **Multi-Protocol Engine:** Scrapes historical logs (Archive.org), Git networks (GitHub API), and True Decentralized Trackers (BitTorrent DHT).
*   **Safe Deep Web Execution:** Hits standard `.onion` aggregators (Ahmia) via clear-net proxying without requiring a native Tor installation, protecting the host machine.
*   **Interactive Terminal Disambiguation:** Presents results in a highly-clean terminal UI, calculating Seeders, File Size, and Repository intelligence scoring.
*   **Sequential Automatic Sandboxing:** Safely isolates every downloaded or cloned target into heavily constrained local sequence directories (e.g., `sfind-1`, `sfind-2`).

## Installation

Because `sfind` runs natively on Node, install it instantly as a global binary:

```bash
# Clone the repository
git clone https://github.com/opcha/sfind

# Navigate into the folder
cd sfind

# Install dependencies and link the binary globally
npm install
npm link
```

## Command Usecases

**1. Basic Autonomous Deep-Hunt**
Trigger an aggressive, multi-API hunt across the open and dark web for unstructured assets.
```bash
sfind "claude code leak"
```

**2. Intelligent Hint Extraction & Scoring**
Add multi-key comma-separated hints to mathematically score exactly what you need to the very top of the list.
```bash
sfind "Windows XP source code leak, hint-iso, hint-archive"
```

**3. Enterprise Source Recovery (DMCA Bypass)**
Instruct the tool to isolate specific developer objects and rebuild them via the Wayback Machine or decentralized GitHub Forks.
```bash
sfind "Claude code 2.1.88 source code leak, hint-1900 files, 512000 lines"
```

## Disclaimer
This analytical crawler is built strictly for enterprise asset-recovery, threat intelligence tracking, and local research. Executing downloads from unknown `.onion` endpoints or unverified P2P swarms carries inherent malware vectors. Always execute within a sandboxed file system.
