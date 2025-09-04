// -------------------------------
// template.js (updated)
// -------------------------------

const today = new Date();

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
    const header = `📅 Application Periods for the ${qualification.name} Qualification`;
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
  const line2 = `${qualification.name} Qualification ${statusText}`;
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
   Login instructions (separate, compact card)
--------------------------------*/
function renderLoginInstructionsCard(qualification) {
  // No qualification name or timeline here; just the instructions
  if (qualification.type === "local" && qualification.id === "polytechnic-diploma-singapore") {
    return `
      <div class="info-card info-card--compact">
        <h3>🖥️ Login Instructions</h3>
        <p><strong>Singapore Citizen/ PR/ FIN Holders:</strong><br>
          Log in with Singpass to apply using the Polytechnic Diploma from Singapore qualification.</p>
        <hr>
        <p><strong>🌏 Foreigners (without FIN):</strong><br>
        Log in with your email account to apply using the Polytechnic Diploma from Singapore qualification.</p>
      </div>
    `;
  }

  if (qualification.type === "local") {
    return `
      <div class="info-card info-card--compact">
        <h3>🖥️ Login Instructions</h3>
        <p>Log in with your <strong>Singpass</strong> to apply using the ${qualification.name} qualification.</p>
        ${qualification.mtlUrl ? `<p>📌 Please check if you meet the Mother Tongue Language requirements: <a href="${qualification.mtlUrl}" target="_blank" rel="noopener noreferrer" class="resource-link">link</a></p>` : ""}
      </div>
    `;
  }

  if (qualification.type === "international") {
    return `
      <div class="info-card info-card--compact">
        <h3>🖥️ Login Instructions</h3>
        <p><strong>🔎 Singapore Citizen/ PR/ FIN Holders:</strong><br> 
         Log in with <strong>Singpass</strong> and apply under <em>Singapore Citizens/ PR</em> category using the ${qualification.name} qualification.</p>
        <p>📌 Please check if you meet the Mother Tongue Language requirements.</p>
        <hr>
        <p><strong>🌏 Foreigners (without FIN):</strong><br> 
         Log in with your <strong>email account</strong> and apply under <em>International Student</em> category using the ${qualification.name} qualification.</p>
      </div>
    `;
  }

  // transfer
  return `
    <div class="info-card info-card--compact">
      <h3>🖥️ Login Instructions</h3>
      <p>As you are a transfer applicant, please log in to the Applicant Portal with your <strong>Singpass</strong> to proceed.</p>
    </div>
  `;
}

/* -------------------------------
   Templates
--------------------------------*/
window.templates = {};

window.templates.internationalQualificationTemplate = function(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    ${renderLoginInstructionsCard(qualification)}
    ${renderResourcesCard(qualification)}
  `;
};

window.templates.localQualificationTemplate = function(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    ${renderLoginInstructionsCard(qualification)}
    ${renderResourcesCard(qualification)}
  `;
};

window.templates.transferTemplate = function(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    ${renderLoginInstructionsCard(qualification)}
    ${renderResourcesCard(qualification)}
  `;
};
