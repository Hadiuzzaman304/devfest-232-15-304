// ==========================================
// Internationalization (i18n) Module
// Bangla & English translations
// ==========================================

const translations = {
  en: {
    // App
    appTitle: "Tender Package Builder",
    appSubtitle: "Document Management System",
    langLabel: "EN",
    lightMode: "Light",
    darkMode: "Dark",

    // Load section
    loadTitle: "Load Tender Requirements",
    loadDesc: "Open your <code>requirements.json</code> file to begin building your tender document package.",
    loadBtn: "Open requirements.json",
    loadDragText: "or drag & drop the file here",

    // Tender info
    tenderInfoTitle: "Tender Information",
    tenderId: "Tender ID",
    tenderTitle: "Title",
    procuringEntity: "Procuring Entity",
    bidder: "Bidder",
    submissionDeadline: "Submission Deadline",

    // Upload section
    uploadTitle: "Upload Documents",
    uploadDesc: "Upload PDF files to match with tender requirements.",
    uploadBtn: "Choose PDF Files",
    uploadDrag: "Drag & drop PDF files here",
    uploadOr: "or",
    noFilesUploaded: "No files uploaded yet",
    pages: "pages",
    page: "page",
    removeFile: "Remove",
    duplicateTag: "DUPLICATE",
    notPdfError: "is not a PDF file and was rejected.",
    damagedPdfError: "appears to be damaged or password-protected.",
    fileAlreadyUploaded: "has already been uploaded.",

    // Requirements section
    requirementsTitle: "Document Requirements",
    requirementsDesc: "Match uploaded files to each requirement and enter expiry dates where needed.",
    colOrder: "#",
    colDocument: "Document",
    colType: "Type",
    colMatchedFile: "Matched File",
    colExpiry: "Expiry Date",
    colStatus: "Status",
    mandatory: "Required",
    optional: "Optional",
    selectFile: "— Select a file —",
    noFileAvailable: "No files available",
    enterExpiry: "Enter expiry date",

    // Statuses
    statusOk: "OK",
    statusMissing: "Missing",
    statusExpiryNeeded: "Expiry Date Needed",
    statusExpired: "Expired",
    statusNotProvided: "Not Provided",

    // Generate section
    generateTitle: "Generate Package",
    generateDesc: "Create the final combined PDF package for submission.",
    generateBtn: "Generate Package PDF",
    previewBtn: "Preview Package",
    downloadBtn: "Download Package",
    generating: "Generating package...",
    generated: "Package generated successfully!",
    downloadStarted: "Downloading package PDF...",
    shortcutDeadline: "Deadline",
    shortcutYear: "+1 Year",
    clear: "Clear",
    year: "Year",
    blockingTitle: "Blocking Issues",
    blockingIssues: "The following issues must be resolved before generating:",
    noBlocking: "All checks passed. Ready to generate!",

    // Blocking reasons
    blockMissing: "is required but no file is matched.",
    blockExpiryNeeded: "needs an expiry date.",
    blockExpired: "has expired before the submission deadline.",

    // Duplicate warning
    duplicateWarning: "Duplicate detected! This file has identical content to:",
    duplicateBlock: "Duplicate files cannot be matched to different requirements.",

    // Cover page (always English per rules)
    coverTitle: "TENDER DOCUMENT PACKAGE",
    coverTenderId: "Tender ID",
    coverTenderTitle: "Tender Title",
    coverProcuringEntity: "Procuring Entity",
    coverBidder: "Bidder Name",
    coverDeadline: "Submission Deadline",
    coverGenDate: "Package Generated On",
    coverDocList: "Included Documents",

    // Misc
    totalFiles: "Total Files",
    totalPages: "Total Pages",
    matched: "Matched",
    unmatched: "Unmatched",
    checklist: "Checklist",
    summary: "Summary",
    indexPage: "Index",

    // Bonus — Auto Match
    autoMatchBtn: "Auto Match",
    autoMatchSuccess: "Auto-matched {count} file(s) to requirements!",
    autoMatchNone: "No automatic matches found. Please match files manually.",

    // Bonus — Export CSV
    exportCsvBtn: "Export CSV",
    exportCsvSuccess: "Checklist exported as CSV.",

    // Bonus — Save / Load Session
    saveSessionBtn: "Save Session",
    loadSessionBtn: "Load Session",
    saveSessionSuccess: "Session saved to browser storage.",
    loadSessionSuccess: "Previous session restored!",
    loadSessionNone: "No saved session found.",
    clearSessionBtn: "Clear Saved",
    clearSessionSuccess: "Saved session cleared.",

    // Bonus — Index Page
    indexPageTitle: "TABLE OF CONTENTS",
    indexPageDoc: "Document",
    indexPagePage: "Page",
  },

  bn: {
    // App
    appTitle: "টেন্ডার প্যাকেজ বিল্ডার",
    appSubtitle: "নথি ব্যবস্থাপনা সিস্টেম",
    langLabel: "বাং",
    lightMode: "লাইট",
    darkMode: "ডার্ক",

    // Load section
    loadTitle: "টেন্ডারের প্রয়োজনীয়তা লোড করুন",
    loadDesc: "আপনার টেন্ডার নথি প্যাকেজ তৈরি শুরু করতে <code>requirements.json</code> ফাইল খুলুন।",
    loadBtn: "requirements.json খুলুন",
    loadDragText: "অথবা এখানে ফাইলটি টেনে আনুন",

    // Tender info
    tenderInfoTitle: "টেন্ডার তথ্য",
    tenderId: "টেন্ডার আইডি",
    tenderTitle: "শিরোনাম",
    procuringEntity: "ক্রয়কারী সংস্থা",
    bidder: "দরদাতা",
    submissionDeadline: "জমার সময়সীমা",

    // Upload section
    uploadTitle: "নথি আপলোড করুন",
    uploadDesc: "টেন্ডারের প্রয়োজনীয়তার সাথে মেলাতে PDF ফাইল আপলোড করুন।",
    uploadBtn: "PDF ফাইল নির্বাচন করুন",
    uploadDrag: "এখানে PDF ফাইল টেনে আনুন",
    uploadOr: "অথবা",
    noFilesUploaded: "এখনও কোনো ফাইল আপলোড হয়নি",
    pages: "পৃষ্ঠা",
    page: "পৃষ্ঠা",
    removeFile: "সরান",
    duplicateTag: "ডুপ্লিকেট",
    notPdfError: "PDF ফাইল নয়, তাই বাতিল করা হয়েছে।",
    damagedPdfError: "ক্ষতিগ্রস্ত বা পাসওয়ার্ড-সুরক্ষিত বলে মনে হচ্ছে।",
    fileAlreadyUploaded: "ইতিমধ্যে আপলোড করা হয়েছে।",

    // Requirements section
    requirementsTitle: "নথি প্রয়োজনীয়তা",
    requirementsDesc: "প্রতিটি প্রয়োজনীয়তার সাথে আপলোড করা ফাইল মেলান এবং প্রয়োজনে মেয়াদ উত্তীর্ণের তারিখ দিন।",
    colOrder: "#",
    colDocument: "নথি",
    colType: "ধরন",
    colMatchedFile: "মিলিত ফাইল",
    colExpiry: "মেয়াদ উত্তীর্ণের তারিখ",
    colStatus: "অবস্থা",
    mandatory: "আবশ্যক",
    optional: "ঐচ্ছিক",
    selectFile: "— একটি ফাইল নির্বাচন করুন —",
    noFileAvailable: "কোনো ফাইল উপলব্ধ নেই",
    enterExpiry: "মেয়াদ উত্তীর্ণের তারিখ দিন",

    // Statuses
    statusOk: "ঠিক আছে",
    statusMissing: "অনুপস্থিত",
    statusExpiryNeeded: "মেয়াদের তারিখ প্রয়োজন",
    statusExpired: "মেয়াদ উত্তীর্ণ",
    statusNotProvided: "প্রদান করা হয়নি",

    // Generate section
    generateTitle: "প্যাকেজ তৈরি করুন",
    generateDesc: "জমা দেওয়ার জন্য চূড়ান্ত সম্মিলিত PDF প্যাকেজ তৈরি করুন।",
    generateBtn: "প্যাকেজ PDF তৈরি করুন",
    previewBtn: "প্যাকেজ প্রিভিউ",
    downloadBtn: "প্যাকেজ ডাউনলোড করুন",
    generating: "প্যাকেজ তৈরি হচ্ছে...",
    generated: "প্যাকেজ সফলভাবে তৈরি হয়েছে!",
    downloadStarted: "প্যাকেজ PDF ডাউনলোড হচ্ছে...",
    shortcutDeadline: "সময়সীমা",
    shortcutYear: "+১ বছর",
    clear: "মুছুন",
    year: "বছর",
    blockingTitle: "বাধাদানকারী সমস্যা",
    blockingIssues: "তৈরি করার আগে নিম্নলিখিত সমস্যাগুলি সমাধান করতে হবে:",
    noBlocking: "সব পরীক্ষা পাস হয়েছে। তৈরি করতে প্রস্তুত!",

    // Blocking reasons
    blockMissing: "আবশ্যক কিন্তু কোনো ফাইল মেলানো হয়নি।",
    blockExpiryNeeded: "এর মেয়াদের তারিখ প্রয়োজন।",
    blockExpired: "জমার সময়সীমার আগে মেয়াদ উত্তীর্ণ হয়ে গেছে।",

    // Duplicate warning
    duplicateWarning: "ডুপ্লিকেট শনাক্ত হয়েছে! এই ফাইলের বিষয়বস্তু অভিন্ন:",
    duplicateBlock: "ডুপ্লিকেট ফাইল বিভিন্ন প্রয়োজনীয়তায় মেলানো যাবে না।",

    // Cover page stays English per problem statement rules
    coverTitle: "TENDER DOCUMENT PACKAGE",
    coverTenderId: "Tender ID",
    coverTenderTitle: "Tender Title",
    coverProcuringEntity: "Procuring Entity",
    coverBidder: "Bidder Name",
    coverDeadline: "Submission Deadline",
    coverGenDate: "Package Generated On",
    coverDocList: "Included Documents",

    // Misc
    totalFiles: "মোট ফাইল",
    totalPages: "মোট পৃষ্ঠা",
    matched: "মিলিত",
    unmatched: "অমিলিত",
    checklist: "চেকলিস্ট",
    summary: "সারসংক্ষেপ",
    indexPage: "সূচি",

    // Bonus — Auto Match
    autoMatchBtn: "স্বয়ংক্রিয় মিল",
    autoMatchSuccess: "{count} টি ফাইল স্বয়ংক্রিয়ভাবে মিলিত হয়েছে!",
    autoMatchNone: "কোনো স্বয়ংক্রিয় মিল পাওয়া যায়নি। দয়া করে ম্যানুয়ালি মেলান।",

    // Bonus — Export CSV
    exportCsvBtn: "CSV রপ্তানি",
    exportCsvSuccess: "চেকলিস্ট CSV হিসেবে রপ্তানি হয়েছে।",

    // Bonus — Save / Load Session
    saveSessionBtn: "সেশন সংরক্ষণ",
    loadSessionBtn: "সেশন লোড",
    saveSessionSuccess: "সেশন ব্রাউজার স্টোরেজে সংরক্ষিত হয়েছে।",
    loadSessionSuccess: "পূর্ববর্তী সেশন পুনরুদ্ধার হয়েছে!",
    loadSessionNone: "কোনো সংরক্ষিত সেশন পাওয়া যায়নি।",
    clearSessionBtn: "সংরক্ষিত মুছুন",
    clearSessionSuccess: "সংরক্ষিত সেশন মুছে ফেলা হয়েছে।",

    // Bonus — Index Page
    indexPageTitle: "সূচিপত্র",
    indexPageDoc: "নথি",
    indexPagePage: "পৃষ্ঠা",
  },
};

// Current language
let currentLang = "en";

function t(key) {
  return translations[currentLang]?.[key] || translations["en"]?.[key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === "bn" ? "bn" : "en";

  // Update all elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const translated = t(key);
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = translated;
    } else if (key.includes("Desc") || key.includes("loadDesc")) {
      el.innerHTML = translated;
    } else {
      el.textContent = translated;
    }
  });

  // Update document title
  document.title =
    lang === "bn"
      ? "টেন্ডার প্যাকেজ বিল্ডার"
      : "Tender Package Builder";
}

function getDocTitle(req) {
  return currentLang === "bn" && req.title_bn ? req.title_bn : req.title_en;
}
