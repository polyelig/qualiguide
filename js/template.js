// -------------------------------
// template.js (audience-aware login + links, fixed "Qualification" for other-high-school)
// -------------------------------

const today = new Date();

// External links used in login instructions
const APPLICANT_PORTAL_URL = "https://myaces.nus.edu.sg/applicantPortal/app/login";
const SINGPASS_URL = "https://portal.singpass.gov.sg/home/ui/support";

/* -------------------------------
   Name/wording helpers
--------------------------------*/
function isOtherHighSchool(q) {
  return q?.id === "other-high-school";
}
function displayQualName(q) {
  return String(q?.name || "");
}
// For headers like "... for the [Name] Qualification"
function titleWithQualifier(q) {
  const name = displayQualName(q);
  return isOtherHighSchool(q) ? name : `${name} Qualification`;
}
// For sentences like "using the [Name] qualification."
function nounQualifier(q) {
  return isOtherHighSchool(q) ? "" : " qualification";
}

/* -------------------------------
   Resource helpers
--------------------------------*/
function createResourceItem(resource) {
  const li = document.createElement("li");
  li.className = "resource-card";

  const a = document.createElement("a");
  a.href = resource.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = resource.label;
  a.className = "resource-link";
  li.appendChild(a);

  if (resource.description) {
    const desc = document.createElement("div");
    desc.className = "resource-desc";
    desc.textContent = resource.description;
    li.appendChild(desc);
  }

  return li;
}

function renderResources(qualification) {
  const list = document.createElement("ul");
  list.className = "resource-list";

  // Common
  if (Array.isArray(window.commonResources)) {
    window.commonResources.forEach(r => list.appendChild(createResourceItem(r)));
  }

  // Conditional
  if (qualification.standardisedTest === "Yes" && window.conditionalResources?.standardisedTest) {
    list.appendChild(createResourceItem(window.conditionalResources.standardisedTest));
  }
  if (qualification.englishRequirement === "Yes" && window.conditionalResources?.englishRequirement) {
    list.appendChild(createResourceItem(window.conditionalResources.englishRequirement));
  }

  // Unique per-qualification
  const unique = (window.uniqueResources && window.uniqueResources[qualification.id]) || [];
  unique.forEach(r => list.appendChild(createResourceItem(r)));

  return list;
}

function renderResourcesCard(qualification) {
  return `
    <div class="info-card info-card--compact">
      <h3>📚 Application Resources</h3>
      ${renderResources(qualification).outerHTML}
    </div>
  `;
}

/* -------------------------------
   Notice helpers
--------------------------------*/
function getAcademicYear(fromDate) {
  if (!(fromDate instanceof Date) || isNaN(fromDate)) return null;
  const m = fromDate.getMonth(); // 0-11
  const y = fromDate.getFullYear();
  const ayStart = (m >= 7) ? y + 1 : y; // Aug–Dec -> next year start
  return `AY${ayStart}/${ayStart + 1}`;
}

// Multi-line notice across all templates
function renderNoticeCard(qualification) {
  // Transfer: multiple periods, same notice style
  if (qualification.type === "transfer" && Array.isArray(qualification.periods)) {
    const header = `📅 Application Periods for the ${titleWithQualifier(qualification)}`;
    const list = qualification.periods.map(p => `<li>${p.label}: ${p.rangeText}</li>`).join("");
    return `
      <div class="notice-card notice-upcoming">
        <h2>${header}</h2>
        <ul>${list}</ul>
      </div>
    `;
  }

  if (!qualification.timeline) return "";

  const start = new Date(qualification.timeline.start);
  const end   = new Date(qualification.timeline.end);
  const ayStr = getAcademicYear(start);

  let statusText, cardClass, line3Prefix;
  if (today < start) {
    statusText = "has not started yet.";
    cardClass = "notice-upcoming";     // light red (via CSS)
    line3Prefix = "Opens on ";
  } else if (today <= end) {
    statusText = "is open.";
    cardClass = "notice-open";         // green (via CSS)
    line3Prefix = "Open: ";
  } else {
    statusText = "has closed.";
    cardClass = "notice-closed";       // light red (via CSS)
    line3Prefix = "Period: ";
  }

  const line1 = `📅 ${ayStr ? ayStr + " " : ""}Application Period for the`;
  const line2 = `${titleWithQualifier(qualification)} ${statusText}`;
  const line3 = `${line3Prefix}${qualification.displayPeriod}`;

  return `
    <div class="notice-card ${cardClass}">
      <h2>${line1}</h2>
      <p>${line2}</p>
      <p>${line3}</p>
    </div>
  `;
}

/* -------------------------------
   Login helpers (audience-aware)
--------------------------------*/

// Determine the correct MTL link per your rule:
// - Local quals: use qualification.mtlUrl if present; otherwise try the first resource (admission page) if available.
// - International quals: use the fixed page.
function getMtlLink(qualification) {
  if (qualification.type === "local") {
    return qualification.mtlUrl || (qualification.resources?.[0]?.url) || null;
  }
  return "https://nus.edu.sg/oam/admissions/singapore-citizens-sprs-with-international-qualifications";
}

// SG/PR card (used across types; text tailored below where needed)
function sgprLoginCard(qualification) {
  const qName = displayQualName(qualification);
  const noun  = nounQualifier(qualification);
  const mtlHref = getMtlLink(qualification);
  const mtlLine = mtlHref
    ? `📌 Please check to see if you meet the <a href="${mtlHref}" target="_blank" rel="noopener noreferrer" class="resource-link">Mother Tongue Language requirements</a>.`
    : `📌 Please check to see if you meet the Mother Tongue Language requirements.`;

  // Special local poly text
  if (qualification.type === "local" && qualification.id === "polytechnic-diploma-singapore") {
    return `
      <div class="login-card info-card info-card--compact">
        <h4>🔎 Singapore Citizen / PR / FIN Holders</h4>
        <p>Please log in to the <a href="${APPLICANT_PORTAL_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Applicant Portal</a> with your <a href="${SINGPASS_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Singpass</a> to apply using the <strong>Polytechnic Diploma from Singapore</strong>${noun}.</p>
      </div>
    `;
  }

  // International
  if (qualification.type === "international") {
    return `
      <div class="login-card info-card info-card--compact">
        <h4>🔎 Singapore Citizen / PR / FIN Holders</h4>
        <p>Please log in to the <a href="${APPLICANT_PORTAL_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Applicant Portal</a> with your <a href="${SINGPASS_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Singpass</a> to apply as a <em>Singapore Citizen/ Permanent Resident/ FIN holder with International Qualifications</em> using the <strong>${qName}</strong>${noun}.</p>
        <p>${mtlLine}</p>
      </div>
    `;
  }

  // Local (non-poly)
  if (qualification.type === "local") {
    return `
      <div class="login-card info-card info-card--compact">
        <h4>🔎 Singapore Citizen / PR / FIN Holders</h4>
        <p>Please log in to the <a href="${APPLICANT_PORTAL_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Applicant Portal</a> with your <a href="${SINGPASS_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Singpass</a> to apply using the <strong>${qName}</strong>${noun}.</p>
        ${mtlHref ? `<p>${mtlLine}</p>` : ""}
      </div>
    `;
  }

  // Transfer (SG/PR)
  if (qualification.type === "transfer") {
    return `
      <div class="login-card info-card info-card--compact">
        <h4>🔎 Singapore Citizen / PR / FIN Holders</h4>
        <p>As you have indicated that you are currently studying/ have enrolled in/ have graduated from a tertiary institution, please log in to the <a href="${APPLICANT_PORTAL_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Applicant Portal</a> with your <a href="${SINGPASS_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Singpass</a> to proceed with your application as a Transfer candidate.</p>
      </div>
    `;
  }

  // Fallback
  return `
    <div class="login-card info-card info-card--compact">
      <h4>🔎 Singapore Citizen / PR / FIN Holders</h4>
      <p>Please log in to the <a href="${APPLICANT_PORTAL_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Applicant Portal</a> with your <a href="${SINGPASS_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Singpass</a>.</p>
    </div>
  `;
}

// Foreigner card (used across types; text tailored where needed)
function foreignersLoginCard(qualification) {
  const qName = displayQualName(qualification);
  const noun  = nounQualifier(qualification);

  // Transfer
  if (qualification.type === "transfer") {
    return `
      <div class="login-card info-card info-card--compact">
        <h4>🌏 Foreigners (without FIN)</h4>
        <p>Please log in to the <a href="${APPLICANT_PORTAL_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Applicant Portal</a> with your email address to proceed with your application as a Transfer candidate.</p>
      </div>
    `;
  }

  // Local poly
  if (qualification.type === "local" && qualification.id === "polytechnic-diploma-singapore") {
    return `
      <div class="login-card info-card info-card--compact">
        <h4>🌏 Foreigners (without FIN)</h4>
        <p>Please log in to the <a href="${APPLICANT_PORTAL_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Applicant Portal</a> with your <strong>email account</strong> to apply using the <strong>Polytechnic Diploma from Singapore</strong>${noun}.</p>
      </div>
    `;
  }

  // All other local & international quals
  return `
    <div class="login-card info-card info-card--compact">
      <h4>🌏 Foreigners (without FIN)</h4>
      <p>Please log in to the <a href="${APPLICANT_PORTAL_URL}" target="_blank" rel="noopener noreferrer" class="resource-link">Applicant Portal</a> with your <strong>email account</strong> to apply as an <em>International Student with International Qualifications</em> using the <strong>${qName}</strong>${noun}.</p>
    </div>
  `;
}

// Audience-aware section (render one card based on audience)
// audience: "sgpr" | "foreigner" | null (unknown)
function renderLoginInstructionsSection(qualification, { audience } = {}) {
  // Exception: Singapore-Cambridge GCE A-Level → always SG/PR card only
  if (qualification.id === "singapore-cambridge-gce-a-level") {
    return `
      <div class="info-card info-card--compact">
        <h3>🖥️ Login Instructions</h3>
        ${sgprLoginCard(qualification)}
      </div>
    `;
  }

  let cardHtml;
  if (audience === "sgpr") {
    cardHtml = sgprLoginCard(qualification);
  } else if (audience === "foreigner") {
    cardHtml = foreignersLoginCard(qualification);
  } else {
    // Fallback if audience isn't known — show both
    cardHtml = `
      <div class="login-grid">
        ${sgprLoginCard(qualification)}
        ${foreignersLoginCard(qualification)}
      </div>
    `;
  }

  return `
    <div class="info-card info-card--compact">
      <h3>🖥️ Login Instructions</h3>
      ${cardHtml}
    </div>
  `;
}

/* -------------------------------
   Templates
--------------------------------*/
window.templates = {};

// NOTE: main.js should call these with a second arg { audience }
window.templates.internationalQualificationTemplate = function(qualification, { audience } = {}) {
  return `
    ${renderNoticeCard(qualification)}
    ${renderLoginInstructionsSection(qualification, { audience })}
    ${renderResourcesCard(qualification)}
  `;
};

window.templates.localQualificationTemplate = function(qualification, { audience } = {}) {
  return `
    ${renderNoticeCard(qualification)}
    ${renderLoginInstructionsSection(qualification, { audience })}
    ${renderResourcesCard(qualification)}
  `;
};

window.templates.transferTemplate = function(qualification, { audience } = {}) {
  return `
    ${renderNoticeCard(qualification)}
    ${renderLoginInstructionsSection(qualification, { audience })}
    ${renderResourcesCard(qualification)}
  `;
};
