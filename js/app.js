// ==========================================
// Tender Package Builder — Main Application
// ==========================================

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// ══════════════════════════════════════════
// STATE
// ══════════════════════════════════════════

const state = {
  tender: null,
  requirements: [],
  uploadedFiles: [],
  // requirementId -> fileId
  matches: {},
  // requirementId -> date string (YYYY-MM-DD)
  expiryDates: {},
  // Generated package blob
  packageBlob: null,
  // Theme
  theme: localStorage.getItem("tpb-theme") || "dark",
  // Language
  language: localStorage.getItem("tpb-lang") || "en",
};

// File ID counter
let fileIdCounter = 0;

// ══════════════════════════════════════════
// INITIALIZATION
// ══════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  // Apply saved theme
  applyTheme(state.theme);
  // Apply saved language
  currentLang = state.language;
  setLanguage(state.language);
  updateLanguageButton();

  // Setup drag-and-drop for load section
  setupLoadDragDrop();
  // Setup drag-and-drop for upload zone
  setupUploadDragDrop();
});

// ══════════════════════════════════════════
// THEME
// ══════════════════════════════════════════

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("tpb-theme", theme);

  const icon = document.getElementById("theme-icon");
  const label = document.getElementById("theme-label");
  if (theme === "dark") {
    icon.textContent = "🌙";
    label.textContent = t("darkMode");
  } else {
    icon.textContent = "☀️";
    label.textContent = t("lightMode");
  }
}

function toggleTheme() {
  applyTheme(state.theme === "dark" ? "light" : "dark");
}

// ══════════════════════════════════════════
// LANGUAGE
// ══════════════════════════════════════════

function toggleLanguage() {
  state.language = state.language === "en" ? "bn" : "en";
  currentLang = state.language;
  localStorage.setItem("tpb-lang", state.language);
  setLanguage(state.language);
  updateLanguageButton();

  // Re-render dynamic sections if data is loaded
  if (state.tender) {
    renderTenderInfo();
    renderRequirements();
    renderUploadStats();
    renderFileList();
    renderBlockingIssues();
  }

  // Update theme label
  const label = document.getElementById("theme-label");
  label.textContent = state.theme === "dark" ? t("darkMode") : t("lightMode");
}

function updateLanguageButton() {
  const label = document.getElementById("lang-label");
  label.textContent = state.language === "en" ? "EN" : "বাং";
}

// ══════════════════════════════════════════
// LOAD REQUIREMENTS
// ══════════════════════════════════════════

function triggerLoadRequirements() {
  document.getElementById("requirements-input").click();
}

function handleRequirementsFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  loadRequirementsFromFile(file);
}

function loadRequirementsFromFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.tender || !data.requirements) {
        showToast(
          "Invalid format: missing tender or requirements fields.",
          "error"
        );
        return;
      }
      state.tender = data.tender;
      state.requirements = data.requirements.sort(
        (a, b) => a.order - b.order
      );
      state.matches = {};
      state.expiryDates = {};
      state.packageBlob = null;

      // Show sections
      document.getElementById("load-section").classList.add("hidden");
      document.getElementById("tender-info-section").classList.remove("hidden");
      document.getElementById("workspace").classList.remove("hidden");
      document.getElementById("generate-section").classList.remove("hidden");

      renderTenderInfo();
      renderRequirements();
      renderBlockingIssues();

      showToast(
        state.language === "bn"
          ? "টেন্ডারের প্রয়োজনীয়তা সফলভাবে লোড হয়েছে!"
          : "Tender requirements loaded successfully!",
        "success"
      );
    } catch (err) {
      showToast("Failed to parse JSON: " + err.message, "error");
    }
  };
  reader.readAsText(file);
}

function setupLoadDragDrop() {
  const loadSection = document.getElementById("load-section");

  loadSection.addEventListener("dragover", (e) => {
    e.preventDefault();
    loadSection.style.borderColor = "var(--accent)";
  });

  loadSection.addEventListener("dragleave", () => {
    loadSection.style.borderColor = "";
  });

  loadSection.addEventListener("drop", (e) => {
    e.preventDefault();
    loadSection.style.borderColor = "";
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".json")) {
      loadRequirementsFromFile(file);
    } else {
      showToast("Please drop a .json file.", "error");
    }
  });
}

// ══════════════════════════════════════════
// RENDER TENDER INFO
// ══════════════════════════════════════════

function renderTenderInfo() {
  const grid = document.getElementById("tender-info-grid");
  const td = state.tender;

  const fields = [
    { key: "tenderId", value: td.tender_id },
    { key: "tenderTitle", value: td.title },
    { key: "procuringEntity", value: td.procuring_entity },
    { key: "bidder", value: td.bidder },
    { key: "submissionDeadline", value: formatDate(td.submission_deadline) },
  ];

  grid.innerHTML = fields
    .map(
      (f) => `
    <div class="info-item">
      <div class="info-label">${t(f.key)}</div>
      <div class="info-value">${f.value}</div>
    </div>
  `
    )
    .join("");
}

// ══════════════════════════════════════════
// FILE UPLOAD
// ══════════════════════════════════════════

function triggerFileUpload() {
  document.getElementById("file-upload-input").click();
}

async function handleFileUpload(event) {
  try {
    const files = Array.from(event.target.files);
    await processUploadedFiles(files);
  } finally {
    // Reset input so same file can be re-uploaded, even if error happens
    event.target.value = "";
  }
}

function setupUploadDragDrop() {
  const zone = document.getElementById("upload-zone");

  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("drag-over");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag-over");
  });

  zone.addEventListener("drop", async (e) => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    const files = Array.from(e.dataTransfer.files);
    await processUploadedFiles(files);
  });
}

async function processUploadedFiles(files) {
  for (const file of files) {
    // Check file count limit (max 30)
    if (state.uploadedFiles.length >= 30) {
      showToast("Maximum 30 files allowed.", "warning");
      break;
    }

    // Check total size limit (max 50MB)
    const currentTotalSize = state.uploadedFiles.reduce((sum, f) => sum + f.arrayBuffer.byteLength, 0);
    if (currentTotalSize + file.size > 50 * 1024 * 1024) {
      showToast("Total file size exceeds 50 MB limit.", "warning");
      break;
    }

    // Check if it's a PDF
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      showToast(`"${file.name}" ${t("notPdfError")}`, "error");
      continue;
    }

    // Read file bytes
    let arrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch {
      showToast(`"${file.name}" ${t("damagedPdfError")}`, "error");
      continue;
    }

    // Validate it's actually a PDF by trying to parse it
    let pageCount = 0;
    try {
      // Pass a COPY to pdf.js so it doesn't detach the buffer, which would break crypto.digest
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
      pageCount = pdfDoc.numPages;
    } catch {
      showToast(`"${file.name}" ${t("damagedPdfError")}`, "error");
      continue;
    }

    // Compute hash for duplicate detection
    let hash;
    try {
      hash = await computeHash(arrayBuffer);
    } catch (e) {
      console.error("Hashing failed:", e);
      showToast(`"${file.name}" failed hashing.`, "error");
      continue;
    }

    // Check if already uploaded (exact same file)
    const alreadyExists = state.uploadedFiles.some(
      (f) => f.name === file.name && f.hash === hash
    );
    if (alreadyExists) {
      showToast(`"${file.name}" ${t("fileAlreadyUploaded")}`, "warning");
      continue;
    }

    const fileEntry = {
      id: "file-" + ++fileIdCounter,
      name: file.name,
      file: file,
      arrayBuffer: arrayBuffer,
      pageCount: pageCount,
      hash: hash,
      isDuplicate: false,
      duplicateOf: null,
    };

    state.uploadedFiles.push(fileEntry);
  }

  // Detect duplicates
  detectDuplicates();

  // Re-render
  renderFileList();
  renderUploadStats();
  renderRequirements();
  renderBlockingIssues();
}

async function computeHash(arrayBuffer) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function detectDuplicates() {
  const hashMap = {};

  // Group files by hash
  for (const file of state.uploadedFiles) {
    if (!hashMap[file.hash]) {
      hashMap[file.hash] = [];
    }
    hashMap[file.hash].push(file);
  }

  // Mark duplicates
  for (const hash in hashMap) {
    const group = hashMap[hash];
    if (group.length > 1) {
      group.forEach((file) => {
        file.isDuplicate = true;
        file.duplicateOf = group
          .filter((f) => f.id !== file.id)
          .map((f) => f.name);
      });
    } else {
      group[0].isDuplicate = false;
      group[0].duplicateOf = null;
    }
  }

  // If duplicate files are matched to different requirements, unmatch the later ones
  enforceDuplicateMatchConstraint();
}

function enforceDuplicateMatchConstraint() {
  const hashToMatchedReq = {};

  for (const reqId in state.matches) {
    const fileId = state.matches[reqId];
    const file = state.uploadedFiles.find((f) => f.id === fileId);
    if (!file || !file.isDuplicate) continue;

    if (hashToMatchedReq[file.hash] && hashToMatchedReq[file.hash] !== reqId) {
      // This duplicate is matched to a different req — unmatch it
      delete state.matches[reqId];
    } else {
      hashToMatchedReq[file.hash] = reqId;
    }
  }
}

function removeFile(fileId) {
  // Remove from state
  state.uploadedFiles = state.uploadedFiles.filter((f) => f.id !== fileId);

  // Remove any matches pointing to this file
  for (const reqId in state.matches) {
    if (state.matches[reqId] === fileId) {
      delete state.matches[reqId];
      delete state.expiryDates[reqId];
    }
  }

  // Re-detect duplicates
  detectDuplicates();

  // Re-render
  renderFileList();
  renderUploadStats();
  renderRequirements();
  renderBlockingIssues();
}

// ══════════════════════════════════════════
// RENDER FILE LIST
// ══════════════════════════════════════════

function renderFileList() {
  const list = document.getElementById("file-list");

  if (state.uploadedFiles.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📄</div>
        <p>${t("noFilesUploaded")}</p>
      </div>
    `;
    return;
  }

  // Check which files are matched
  const matchedFileIds = new Set(Object.values(state.matches));

  list.innerHTML = state.uploadedFiles
    .map((file, index) => {
      const isMatched = matchedFileIds.has(file.id);
      const pageLabel =
        file.pageCount === 1
          ? `1 ${t("page")}`
          : `${file.pageCount} ${t("pages")}`;

      let tags = "";
      if (file.isDuplicate) {
        tags += `<span class="tag tag-duplicate">⚠ ${t("duplicateTag")}</span>`;
      }
      if (isMatched) {
        tags += `<span class="tag tag-matched">✓ ${t("matched")}</span>`;
      }

      let duplicateWarning = "";
      if (file.isDuplicate && file.duplicateOf) {
        duplicateWarning = `
          <div class="duplicate-warning">
            ⚠️ ${t("duplicateWarning")} ${file.duplicateOf.join(", ")}
          </div>
        `;
      }

      return `
        <div class="file-item ${file.isDuplicate ? "is-duplicate" : ""} ${isMatched ? "is-matched" : ""}" 
             style="animation-delay: ${index * 0.05}s"
             id="file-item-${file.id}">
          <div class="file-icon">${file.isDuplicate ? "⚠️" : isMatched ? "✅" : "📄"}</div>
          <div class="file-info">
            <div class="file-name" title="${file.name}">${file.name}</div>
            <div class="file-meta">${pageLabel}</div>
            <div class="file-tags">${tags}</div>
            ${duplicateWarning}
          </div>
          <button class="btn-remove" onclick="removeFile('${file.id}')">
            ${t("removeFile")}
          </button>
        </div>
      `;
    })
    .join("");
}

function renderUploadStats() {
  const stats = document.getElementById("upload-stats");
  if (state.uploadedFiles.length === 0) {
    stats.innerHTML = "";
    return;
  }

  const totalPages = state.uploadedFiles.reduce(
    (sum, f) => sum + f.pageCount,
    0
  );
  const matchedCount = Object.keys(state.matches).length;
  const duplicateCount = state.uploadedFiles.filter(
    (f) => f.isDuplicate
  ).length;

  stats.innerHTML = `
    <div class="stat-chip">
      📄 ${t("totalFiles")}: <span class="stat-value">${state.uploadedFiles.length}</span>
    </div>
    <div class="stat-chip">
      📑 ${t("totalPages")}: <span class="stat-value">${totalPages}</span>
    </div>
    <div class="stat-chip">
      ✅ ${t("matched")}: <span class="stat-value">${matchedCount}</span>
    </div>
    ${
      duplicateCount > 0
        ? `<div class="stat-chip" style="border-color: var(--status-duplicate);">
        ⚠️ ${t("duplicateTag")}: <span class="stat-value" style="color: var(--status-duplicate);">${duplicateCount}</span>
      </div>`
        : ""
    }
  `;
}

// ══════════════════════════════════════════
// MATCHING & EXPIRY
// ══════════════════════════════════════════

function matchFile(reqId, fileId) {
  if (!fileId) {
    // Unmatching
    delete state.matches[reqId];
    delete state.expiryDates[reqId];
  } else {
    // Check duplicate constraint
    const file = state.uploadedFiles.find((f) => f.id === fileId);
    if (file && file.isDuplicate) {
      // Check if any other duplicate with same hash is already matched to a different req
      const duplicatesMatchedElsewhere = Object.entries(state.matches).some(
        ([rId, fId]) => {
          if (rId === reqId) return false;
          const f = state.uploadedFiles.find((x) => x.id === fId);
          return f && f.hash === file.hash;
        }
      );

      if (duplicatesMatchedElsewhere) {
        showToast(t("duplicateBlock"), "error");
        return;
      }
    }

    state.matches[reqId] = fileId;
  }

  state.packageBlob = null;

  renderFileList();
  renderUploadStats();
  renderRequirements();
  renderBlockingIssues();
}

function setExpiryDate(reqId, date) {
  if (date) {
    state.expiryDates[reqId] = date;
  } else {
    delete state.expiryDates[reqId];
  }

  state.packageBlob = null;

  renderRequirements();
  renderBlockingIssues();
}

// ══════════════════════════════════════════
// STATUS CALCULATION
// ══════════════════════════════════════════

function getDocumentStatus(req) {
  const matchedFileId = state.matches[req.id];

  if (!matchedFileId) {
    return req.mandatory ? "missing" : "not_provided";
  }

  if (req.has_expiry) {
    const expiry = state.expiryDates[req.id];
    if (!expiry) return "expiry_needed";

    // Compare dates: expired if expiry < deadline
    const expiryDate = new Date(expiry + "T00:00:00");
    const deadlineDate = new Date(
      state.tender.submission_deadline + "T00:00:00"
    );
    if (expiryDate < deadlineDate) return "expired";
  }

  return "ok";
}

function getStatusLabel(status) {
  const map = {
    ok: t("statusOk"),
    missing: t("statusMissing"),
    expiry_needed: t("statusExpiryNeeded"),
    expired: t("statusExpired"),
    not_provided: t("statusNotProvided"),
  };
  return map[status] || status;
}

function getStatusIcon(status) {
  const map = {
    ok: "✅",
    missing: "❌",
    expiry_needed: "⏳",
    expired: "⚠️",
    not_provided: "➖",
  };
  return map[status] || "❓";
}

function getStatusClass(status) {
  const map = {
    ok: "status-ok",
    missing: "status-missing",
    expiry_needed: "status-expiry-needed",
    expired: "status-expired",
    not_provided: "status-not-provided",
  };
  return map[status] || "";
}

function isBlocking(status) {
  return ["missing", "expiry_needed", "expired"].includes(status);
}

// ══════════════════════════════════════════
// RENDER REQUIREMENTS
// ══════════════════════════════════════════

function renderRequirements() {
  const list = document.getElementById("requirements-list");

  // Build summary bar
  renderSummaryBar();

  // Get matched file IDs to exclude from available options
  const matchedFileIds = new Set(Object.values(state.matches));

  // Get hashes that are already matched (for duplicate constraint)
  const matchedHashes = new Set();
  for (const reqId in state.matches) {
    const file = state.uploadedFiles.find(
      (f) => f.id === state.matches[reqId]
    );
    if (file && file.isDuplicate) {
      matchedHashes.add(file.hash);
    }
  }

  list.innerHTML = state.requirements
    .map((req, index) => {
      const status = getDocumentStatus(req);
      const matchedFileId = state.matches[req.id];
      const matchedFile = matchedFileId
        ? state.uploadedFiles.find((f) => f.id === matchedFileId)
        : null;

      // Available files for this dropdown
      const availableFiles = state.uploadedFiles.filter((f) => {
        // If this file is already matched to this requirement, show it
        if (f.id === matchedFileId) return true;
        // If matched elsewhere, don't show
        if (matchedFileIds.has(f.id)) return false;
        // If it's a duplicate and another duplicate with same hash is already matched, don't show
        if (f.isDuplicate && matchedHashes.has(f.hash) && state.matches[req.id] !== f.id) return false;
        return true;
      });

      // Build select options
      const selectOptions = availableFiles
        .map(
          (f) =>
            `<option value="${f.id}" ${f.id === matchedFileId ? "selected" : ""}>
            ${f.name} (${f.pageCount} ${f.pageCount === 1 ? t("page") : t("pages")})${f.isDuplicate ? " ⚠️" : ""}
          </option>`
        )
        .join("");

      // Expiry date input
      let expiryField = "";
      if (req.has_expiry && matchedFileId) {
        const expiryValue = state.expiryDates[req.id] || "";
        expiryField = `
          <div class="req-field">
            <label>${t("colExpiry")}</label>
            <input type="date" 
                   value="${expiryValue}" 
                   onchange="setExpiryDate('${req.id}', this.value)" 
                   placeholder="${t("enterExpiry")}" />
          </div>
        `;
      }

      const cardStateClass = status === "ok" ? "req-matched" : status === "missing" ? "req-missing" : status === "expired" ? "req-expired" : status === "expiry_needed" ? "req-expiry-needed" : "";

      return `
        <div class="req-card ${cardStateClass}" style="animation-delay: ${index * 0.06}s" id="req-card-${req.id}">
          <div class="req-card-header">
            <div class="req-card-title">
              <div class="req-order">${req.order}</div>
              <span class="req-name">${getDocTitle(req)}</span>
            </div>
            <span class="req-type-badge ${req.mandatory ? "mandatory" : "optional"}">
              ${req.mandatory ? t("mandatory") : t("optional")}
            </span>
          </div>
          <div class="req-card-body ${!req.has_expiry || !matchedFileId ? "no-expiry" : ""}">
            <div class="req-field">
              <label>${t("colMatchedFile")}</label>
              <select onchange="matchFile('${req.id}', this.value)">
                <option value="">${t("selectFile")}</option>
                ${selectOptions}
              </select>
            </div>
            ${expiryField}
          </div>
          <div class="req-card-footer">
            <span class="status-badge ${getStatusClass(status)}">
              ${getStatusIcon(status)} ${getStatusLabel(status)}
            </span>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderSummaryBar() {
  const bar = document.getElementById("summary-bar");
  if (!state.requirements.length) {
    bar.innerHTML = "";
    return;
  }

  const counts = { ok: 0, missing: 0, expired: 0, expiry_needed: 0, not_provided: 0 };
  for (const req of state.requirements) {
    const s = getDocumentStatus(req);
    counts[s] = (counts[s] || 0) + 1;
  }

  bar.innerHTML = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(
      ([k, v]) => `
      <div class="summary-item">
        <span class="summary-dot dot-${k.replace("_", "-")}"></span>
        <span>${getStatusLabel(k)}: ${v}</span>
      </div>
    `
    )
    .join("");
}

// ══════════════════════════════════════════
// BLOCKING ISSUES & GENERATE
// ══════════════════════════════════════════

function renderBlockingIssues() {
  const container = document.getElementById("blocking-issues");
  const generateBtn = document.getElementById("generate-btn");

  const issues = [];
  for (const req of state.requirements) {
    const status = getDocumentStatus(req);
    if (status === "missing") {
      issues.push({
        type: "error",
        text: `${getDocTitle(req)} ${t("blockMissing")}`,
      });
    } else if (status === "expiry_needed") {
      issues.push({
        type: "warning",
        text: `${getDocTitle(req)} ${t("blockExpiryNeeded")}`,
      });
    } else if (status === "expired") {
      issues.push({
        type: "expired",
        text: `${getDocTitle(req)} ${t("blockExpired")}`,
      });
    }
  }

  if (issues.length === 0) {
    container.innerHTML = `
      <div class="ready-message">
        ✅ ${t("noBlocking")}
      </div>
    `;
    generateBtn.disabled = false;
  } else {
    container.innerHTML = `
      <h3>⚠️ ${t("blockingTitle")}</h3>
      <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 10px;">
        ${t("blockingIssues")}
      </p>
      <ul class="blocking-list">
        ${issues
          .map(
            (i) =>
              `<li class="${i.type === "warning" ? "warning" : i.type === "expired" ? "expired-issue" : ""}">
              ${i.type === "error" ? "❌" : i.type === "warning" ? "⏳" : "⚠️"} ${i.text}
            </li>`
          )
          .join("")}
      </ul>
    `;
    generateBtn.disabled = true;
  }

  // Hide download button if package is invalidated
  if (!state.packageBlob) {
    document.getElementById("download-btn").classList.add("hidden");
  }
}

// ══════════════════════════════════════════
// PDF PACKAGE GENERATION
// ══════════════════════════════════════════

async function handleGeneratePackage() {
  const generateBtn = document.getElementById("generate-btn");
  const progress = document.getElementById("generate-progress");
  const downloadBtn = document.getElementById("download-btn");

  generateBtn.disabled = true;
  progress.classList.remove("hidden");
  downloadBtn.classList.add("hidden");

  try {
    await generatePackagePDF();
    showToast(t("generated"), "success");
    downloadBtn.classList.remove("hidden");
  } catch (err) {
    console.error("Package generation error:", err);
    showToast("Error generating package: " + err.message, "error");
  } finally {
    progress.classList.add("hidden");
    renderBlockingIssues(); // re-check
  }
}

async function generatePackagePDF() {
  const { PDFDocument, rgb, StandardFonts } = PDFLib;

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const td = state.tender;

  // Collect matched requirements in order
  const includedDocs = state.requirements
    .filter((req) => state.matches[req.id])
    .sort((a, b) => a.order - b.order);

  // ─── 1. COVER PAGE ───
  const coverPage = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = coverPage.getSize();
  let yPos = height - 60;

  // Title
  const titleText = "TENDER DOCUMENT PACKAGE";
  const titleWidth = fontBold.widthOfTextAtSize(titleText, 22);
  coverPage.drawText(titleText, {
    x: (width - titleWidth) / 2,
    y: yPos,
    size: 22,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.2),
  });

  yPos -= 12;
  // Underline
  coverPage.drawLine({
    start: { x: 60, y: yPos },
    end: { x: width - 60, y: yPos },
    thickness: 2,
    color: rgb(0.42, 0.39, 1),
  });

  yPos -= 50;

  // Tender details — ALWAYS English on cover page (Section 6.1)
  const formatDateEnglish = (dateStr) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch { return dateStr; }
  };

  const detailLines = [
    ["Tender ID:", td.tender_id],
    ["Title:", td.title],
    ["Procuring Entity:", td.procuring_entity],
    ["Bidder:", td.bidder],
    ["Submission Deadline:", formatDateEnglish(td.submission_deadline)],
    [
      "Package Generated On:",
      formatDateEnglish(new Date().toISOString().split("T")[0]),
    ],
  ];

  for (const [label, value] of detailLines) {
    coverPage.drawText(label, {
      x: 72,
      y: yPos,
      size: 11,
      font: fontBold,
      color: rgb(0.3, 0.3, 0.4),
    });
    coverPage.drawText(value, {
      x: 240,
      y: yPos,
      size: 11,
      font: font,
      color: rgb(0.1, 0.1, 0.2),
    });
    yPos -= 24;
  }

  yPos -= 30;

  // Included documents section
  coverPage.drawText("Included Documents:", {
    x: 72,
    y: yPos,
    size: 13,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.2),
  });
  yPos -= 8;
  coverPage.drawLine({
    start: { x: 72, y: yPos },
    end: { x: width - 72, y: yPos },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.8),
  });
  yPos -= 22;

  for (let i = 0; i < includedDocs.length; i++) {
    const doc = includedDocs[i];
    const text = `${doc.order}. ${doc.title_en}`;
    coverPage.drawText(text, {
      x: 90,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.2, 0.2, 0.3),
    });
    yPos -= 20;

    if (yPos < 80) {
      // Shouldn't happen with 10 docs, but just in case
      break;
    }
  }

  // ─── 2. ADD DOCUMENT PAGES ───
  for (const req of includedDocs) {
    const fileId = state.matches[req.id];
    const file = state.uploadedFiles.find((f) => f.id === fileId);
    if (!file) continue;

    try {
      const srcDoc = await PDFDocument.load(file.arrayBuffer);
      const pageIndices = srcDoc.getPageIndices();
      const copiedPages = await pdfDoc.copyPages(srcDoc, pageIndices);
      for (const page of copiedPages) {
        pdfDoc.addPage(page);
      }
    } catch (err) {
      console.error(`Error adding pages for ${file.name}:`, err);
      throw new Error(`Failed to add pages from ${file.name}: ${err.message}`);
    }
  }

  // ─── 3. ADD FOOTERS TO ALL PAGES ───
  const totalPages = pdfDoc.getPageCount();
  const allPages = pdfDoc.getPages();

  for (let i = 0; i < totalPages; i++) {
    const page = allPages[i];
    const { width: pageWidth } = page.getSize();
    const footerText = `${td.tender_id} | Page ${i + 1} of ${totalPages}`;
    const footerWidth = font.widthOfTextAtSize(footerText, 9);

    // Semi-transparent background strip for footer
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageWidth,
      height: 28,
      color: rgb(1, 1, 1),
      opacity: 0.85,
    });

    // Footer line
    page.drawLine({
      start: { x: 30, y: 28 },
      end: { x: pageWidth - 30, y: 28 },
      thickness: 0.4,
      color: rgb(0.75, 0.75, 0.8),
    });

    // Footer text (centered)
    page.drawText(footerText, {
      x: (pageWidth - footerWidth) / 2,
      y: 10,
      size: 9,
      font: font,
      color: rgb(0.35, 0.35, 0.45),
    });
  }

  // ─── 4. SAVE ───
  const pdfBytes = await pdfDoc.save();
  state.packageBlob = new Blob([pdfBytes], { type: "application/pdf" });
}

function downloadPackage() {
  if (!state.packageBlob) return;
  const url = URL.createObjectURL(state.packageBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${state.tender.tender_id}_Package.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ══════════════════════════════════════════
// TOAST NOTIFICATIONS
// ══════════════════════════════════════════

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
  toast.innerHTML = `<span>${icons[type] || "ℹ️"}</span> <span>${message}</span>`;

  container.appendChild(toast);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.classList.add("toast-exit");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ══════════════════════════════════════════
// UTILITY
// ══════════════════════════════════════════

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(
      state.language === "bn" ? "bn-BD" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  } catch {
    return dateStr;
  }
}
