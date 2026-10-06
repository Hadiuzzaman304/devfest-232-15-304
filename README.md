# Tender Document Package Builder

**AI DevFest 2026 — Vibe Coding Contest**

| Field | Details |
|-------|---------|
| **Name** | Hadiuzzaman |
| **Registration Number** | 232-15-304 |
| **Live Link** | https://hadiuzzaman304.github.io/devfest-232-15-304/ |

## 🚀 How to Run

This is a frontend-only static web app. No build step required.

### Option 1: Open directly
Open `index.html` in Google Chrome.

### Option 2: Local server
```bash
npx serve .
```
Then visit `http://localhost:3000`

## ✅ Main Features Done

- [x] **Load requirements.json** — Parse and display tender details + document list sorted by order
- [x] **Upload PDF files** — Multi-file upload with drag & drop, page count display, non-PDF rejection
- [x] **Match files to requirements** — 1-to-1 matching with dropdowns, changeable/undoable
- [x] **Expiry date entry** — Date input for `has_expiry=true` documents
- [x] **Real-time status checking** — Missing, Expiry Date Needed, Expired, Not Provided, OK
- [x] **Duplicate detection** — SHA-256 hash-based identical content detection, blocks cross-matching
- [x] **Generate PDF package** — Cover page + merged documents + footers (using pdf-lib)
- [x] **Download package** — Downloads as `<tender_id>_Package.pdf`
- [x] **Bilingual UI** — Full Bangla ↔ English toggle for all labels, buttons, messages
- [x] **Dark / Light mode** — Theme toggle with persistence via localStorage

## ⭐ Bonus Features

- [x] **Handle bad files** — Damaged/password-protected PDFs show clear error messages
- [x] **Auto-match** — (Suggested) File name matching hints in dropdown
- [x] **Theme persistence** — Dark/Light mode saved in localStorage

## ⚠️ Known Issues

- Cover page and footers use standard PDF fonts (Helvetica) — Bangla text on PDF not supported without custom font embedding
- Very large PDF files (>10MB each) may be slow to process in browser

## 🤖 AI Tools Used

- Google Antigravity (Claude Opus 4.6)

## 💡 Most Useful Prompt

> "Build a frontend-only web app that helps office staff turn a set of PDF files into one complete, checked and correctly ordered PDF package. The app should load requirements.json, upload/validate PDFs, match files to requirements with 1-to-1 mapping, detect duplicates via SHA-256 hashing, check expiry dates against submission deadline, and generate a combined PDF with cover page and page footers using pdf-lib. Include dark/light mode and Bangla/English language toggle."

## 📁 Project Structure

```
├── index.html              # Main HTML page
├── css/
│   └── styles.css          # Complete styling (dark/light themes)
├── js/
│   ├── i18n.js             # Bangla/English translations
│   └── app.js              # Main application logic
├── output/                 # Generated PDF package
├── screenshots/            # App screenshots
├── contest_resources/      # Sample pack (provided)
├── LICENSE                 # MIT License
└── README.md               # This file
```

## 📦 Libraries Used

- **[pdf-lib](https://pdf-lib.js.org/)** — PDF creation, merging, and footer addition
- **[PDF.js](https://mozilla.github.io/pdf.js/)** — PDF page counting and validation
- **Web Crypto API** — SHA-256 hashing for duplicate detection
