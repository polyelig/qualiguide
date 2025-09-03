// -------------------------------
// template.js
// -------------------------------

// Get today's date (for notice card)
const today = new Date();

// Utility: format a resource <li>
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

// Render resources (merged list: common + conditional + unique)
function renderResources(qualification) {
  const list = document.createElement("ul");
  list.className = "resource-list";

  // Common resources
  if (window.commonResources) {
    window.commonResources.forEach(resource => {
      list.appendChild(createResourceItem(resource));
    });
  }

  // Conditional resources for international qualifications
  if (qualification.type === "international") {
    if (qualification.standardisedTest === "Yes" && window.conditionalResources?.standardisedTest) {
      list.appendChild(createResourceItem(window.conditionalResources.standardisedTest));
    }
    if (qualification.englishRequirement === "Yes" && window.conditionalResources?.englishRequirement) {
      list.appendChild(createResourceItem(window.conditionalResources.englishRequirement));
    }
  }

  // Unique resources
  const unique = (window.uniqueResources && window.uniqueResources[qualification.id]) || [];
  unique.forEach(resource => {
    list.appendChild(createResourceItem(resource));
  });

  return list;
}

// Generate display period text from timeline or periods
function getDisplayPeriod(qualification) {
  if (qualification.displayPeriod) return qualification.displayPeriod;

  if (qualification.timeline) {
    return `${qualification.timeline.start} to ${qualification.timeline.end}`;
  }

  if (qualification.periods && qualification.periods.length > 0) {
    return qualification.periods.map(p => `${p.label}: ${p.rangeText}`).join("<br>");
  }

  return "";
}

// Notice card (open, closed, upcoming)
function renderNoticeCard(qualification) {
  let message = "";
  let cardClass = "";

  // For transfer qualifications, show periods
  if (qualification.periods && qualification.periods.length > 0) {
    message = qualification.periods.map(p => `${p.label} — ${p.rangeText}`).join("<br>");
    cardClass = "notice-upcoming";
    return `
      <div class="notice-box ${cardClass}">
        <h2>Application Notice</h2>
        <p>${message}</p>
      </div>
    `;
  }

  if (!qualification.timeline) return "";

  const startDate = new Date(qualification.timeline.start);
  const endDate = new Date(qualification.timeline.end);
  const displayPeriod = getDisplayPeriod(qualification);

  if (today < startDate) {
    message = `Application has not started yet. Opens on ${displayPeriod}`;
    cardClass = "notice-upcoming";
  } else if (today >= startDate && today <= endDate) {
    message = `Application period is open: ${displayPeriod}`;
    cardClass = "notice-open";
  } else {
    message = `Application period has closed: ${displayPeriod}`;
    cardClass = "notice-closed";
  }

  return `
    <div class="notice-box ${cardClass}">
      <h2>Application Notice</h2>
      <p>${message}</p>
    </div>
  `;
}

// Login instructions
function renderLoginInstructions(qualification) {
  switch (qualification.type) {
    case "transfer":
      return `
        <div class="login-instructions">
          <h3>🖥️ Prospective Transfer Applicants</h3>
          <p>As you have indicated that you are currently studying / have enrolled in / have graduated from a tertiary institution, please log in to the Applicant Portal with your Singpass to proceed with your application as a Transfer candidate.</p>
        </div>
      `;
      
    case "local":
      if (qualification.id === "polytechnic-diploma-singapore") {
        return `
          <div class="login-instructions">
            <h3>🖥️ Singapore Citizen / Permanent Resident / FIN Holders</h3>
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
          <h3>🔎 Singapore Citizen / Singapore Permanent Resident / FIN Holders</h3>
          <p>Please log in to the Applicant Portal with your Singpass and apply under the Singapore Citizens / Singapore Permanent Residents with International Qualifications category to proceed with your application using the ${qualification.name}.</p>
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
// Templates
// -------------------------------
window.templates = {};

window.templates.internationalQualificationTemplate = function(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    <div class="info-card">
      <h2>${qualification.name}</h2>
      ${qualification.timeline || qualification.periods ? `<p><strong>Application Timeline:</strong> ${getDisplayPeriod(qualification)}</p>` : ""}
      ${renderLoginInstructions(qualification)}
      <h3>Resources</h3>
      ${renderResources(qualification).outerHTML}
    </div>
  `;
};

window.templates.localQualificationTemplate = function(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    <div class="info-card">
      <h2>${qualification.name}</h2>
      ${qualification.timeline ? `<p><strong>Application Timeline:</strong> ${getDisplayPeriod(qualification)}</p>` : ""}
      ${qualification.mtlUrl ? `<p><a href="${qualification.mtlUrl}" target="_blank">Mother Tongue Language Requirements</a></p>` : ""}
      ${renderLoginInstructions(qualification)}
      <h3>Resources</h3>
      ${renderResources(qualification).outerHTML}
    </div>
  `;
};

window.templates.transferTemplate = function(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    <div class="info-card">
      <h2>${qualification.name}</h2>
      ${qualification.periods ? `<p><strong>Application Timeline:</strong><br>${getDisplayPeriod(qualification)}</p>` : ""}
      ${renderLoginInstructions(qualification)}
      <h3>Resources</h3>
      ${renderResources(qualification).outerHTML}
    </div>
  `;
};
