// -------------------------------
// template.js
// -------------------------------

// Today's date for notice card logic
const today = new Date();

// -------------------------------
// Utility Functions
// -------------------------------

// Format a single resource <li>
function createResourceItem(resource) {
  const li = document.createElement("li");
  li.style.marginBottom = "6px";

  const a = document.createElement("a");
  a.href = resource.url;
  a.target = "_blank";
  a.textContent = resource.label;

  li.appendChild(a);

  if (resource.description) {
    li.append(` ${resource.description}`);
  }

  return li;
}

// Render resources (common + conditional + unique)
function renderResources(qualification) {
  const list = document.createElement("ul");
  list.className = "resource-list";

  // Common resources from resources.js
  if (window.commonResources) {
    window.commonResources.forEach(res => list.appendChild(createResourceItem(res)));
  }

  // Conditional resources
  if (qualification.standardisedTest === "Yes" && window.conditionalResources?.standardisedTest) {
    list.appendChild(createResourceItem(window.conditionalResources.standardisedTest));
  }
  if (qualification.englishRequirement === "Yes" && window.conditionalResources?.englishRequirement) {
    list.appendChild(createResourceItem(window.conditionalResources.englishRequirement));
  }

  // Unique resources from resources.js
  const unique = (window.uniqueResources && window.uniqueResources[qualification.id]) || [];
  unique.forEach(res => list.appendChild(createResourceItem(res)));

  return list;
}

// Render Notice Card (open / closed / upcoming)
function renderNoticeCard(qualification) {
  if (!qualification.timeline) return "";

  const startDate = new Date(qualification.timeline.start);
  const endDate = new Date(qualification.timeline.end);

  let message = "";
  let cardClass = "";

  const displayPeriod = qualification.displayPeriod || 
    (qualification.timeline.start && qualification.timeline.end ? 
      `${qualification.timeline.start} to ${qualification.timeline.end}` : "TBD");

  if (today < startDate) {
    message = `Application has not started yet. Opens on ${displayPeriod}`;
    cardClass = "notice-upcoming";
  } else if (today >= startDate && today <= endDate) {
    message = `Application period is open: ${displayPeriod}`;
    cardClass = "notice-open";
  } else {
    message = "Application period is closed";
    cardClass = "notice-closed";
  }

  return `
    <div class="notice-card ${cardClass}">
      <h2>Application Notice</h2>
      <p>${message}</p>
    </div>
  `;
}

// Render login instructions
function renderLoginInstructions(qualification) {
  switch (qualification.type) {
    case "transfer":
      return `
        <div class="login-instructions">
          <h3>🖥️ Prospective Transfer Applicants</h3>
          <p>As you are studying / have enrolled in / have graduated from a tertiary institution, please log in to the Applicant Portal with your Singpass to proceed with your application as a Transfer candidate.</p>
        </div>
      `;
    case "local":
      if (qualification.id === "polytechnic-diploma-singapore") {
        return `
          <div class="login-instructions">
            <h3>🖥️ Singapore Citizen / PR / FIN Holders</h3>
            <p>Please log in to the Applicant Portal with your Singpass to proceed with your application using the Polytechnic Diploma from Singapore Qualification.</p>
            <hr>
            <h3>🌏 Foreigners (without FIN)</h3>
            <p>Please log in to the Applicant Portal with your email account to proceed with your application using the Polytechnic Diploma from Singapore Qualification.</p>
          </div>
        `;
      } else {
        return `
          <div class="login-instructions">
            <h3>🖥️ Prospective Applicants</h3>
            <p>Please log in to the Applicant Portal with your Singpass to proceed with your application using the ${qualification.name}.</p>
            ${qualification.mtlUrl ? `<p>📌 Please check if you fulfil the Mother Tongue Language (MTL) requirements: <a href="${qualification.mtlUrl}" target="_blank">link</a></p>` : ""}
          </div>
        `;
      }
    case "international":
      return `
        <div class="login-instructions">
          <h3>🔎 Singapore Citizen / PR / FIN Holders</h3>
          <p>Please log in to the Applicant Portal with your Singpass and apply under the Singapore Citizens / PRs with International Qualifications category to proceed with your application using the ${qualification.name}.</p>
          <p>📌 Please check if you fulfil the Mother Tongue Language (MTL) requirements.</p>
          <hr>
          <h3>🌏 Foreigners (without FIN)</h3>
          <p>Please log in to the Applicant Portal with your email account and apply under the International Student with International Qualification category to proceed with your application using the ${qualification.name}.</p>
        </div>
      `;
    default:
      return "";
  }
}

// -------------------------------
// Templates per Qualification Type
// -------------------------------
window.templates = {};

// International
window.templates.internationalQualificationTemplate = function(q) {
  return `
    ${renderNoticeCard(q)}
    <div class="info-card">
      <h2>${q.name}</h2>
      ${q.timeline ? `<p><strong>Application Timeline:</strong> ${q.displayPeriod}</p>` : ""}
      ${renderLoginInstructions(q)}
      <h3>Resources</h3>
      ${renderResources(q).outerHTML}
    </div>
  `;
};

// Local
window.templates.localQualificationTemplate = function(q) {
  return `
    ${renderNoticeCard(q)}
    <div class="info-card">
      <h2>${q.name}</h2>
      ${q.timeline ? `<p><strong>Application Timeline:</strong> ${q.displayPeriod}</p>` : ""}
      ${renderLoginInstructions(q)}
      <h3>Resources</h3>
      ${renderResources(q).outerHTML}
    </div>
  `;
};

// Transfer
window.templates.transferTemplate = function(q) {
  // Transfer can have multiple periods
  const periodsHtml = q.periods?.map(p => `<p><strong>${p.label}:</strong> ${p.rangeText}</p>`).join("") || "";

  return `
    ${renderNoticeCard(q)}
    <div class="info-card">
      <h2>${q.name}</h2>
      ${periodsHtml}
      ${renderLoginInstructions(q)}
      <h3>Resources</h3>
      ${renderResources(q).outerHTML}
    </div>
  `;
};
