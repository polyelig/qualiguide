// -------------------------------
// template.js (updated for new headers & resources card)
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
  a.rel = "noopener"; // security
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

  // Conditional resources
  if (qualification.standardisedTest === "Yes" && window.conditionalResources?.standardisedTest) {
    list.appendChild(createResourceItem(window.conditionalResources.standardisedTest));
  }
  if (qualification.englishRequirement === "Yes" && window.conditionalResources?.englishRequirement) {
    list.appendChild(createResourceItem(window.conditionalResources.englishRequirement));
  }

  // Unique resources
  const unique = (window.uniqueResources && window.uniqueResources[qualification.id]) || [];
  unique.forEach(resource => {
    list.appendChild(createResourceItem(resource));
  });

  return list;
}

// Wrap resources like the login instructions (same card style)
function renderResourcesCard(qualification) {
  return `
    <div class="info-card">
      <h3>Application Resources</h3>
      ${renderResources(qualification).outerHTML}
    </div>
  `;
}

// Notice card (header-only per your format; transfer shows a list)
function renderNoticeCard(qualification) {
  // Helper: compute AY label from a start date (AY starts in Aug)
  const getAcademicYear = (d) => {
    if (!d || isNaN(d)) return null;
    const m = d.getMonth(); // 0-based
    const y = d.getFullYear();
    const ayStart = (m >= 7) ? y + 1 : y; // Aug-Dec -> next calendar year as AY first; Jan-Jul -> current
    return `AY${ayStart}/${ayStart + 1}`;
  };

  // Transfer applicants: show multiple periods list
  if (qualification.type === "transfer" && qualification.periods) {
    const header = `📅 Application Periods for the ${qualification.name} Qualification`;
    const periodsList = qualification.periods
      .map(p => `<li>${p.label}: ${p.rangeText}</li>`)
      .join("");
    return `
      <div class="notice-card notice-info">
        <h2>${header}</h2>
        <ul>${periodsList}</ul>
      </div>
    `;
  }

  // Other qualifications with a timeline
  if (!qualification.timeline) return "";

  const startDate = new Date(qualification.timeline.start);
  const endDate = new Date(qualification.timeline.end);

  let message = "";
  if (today < startDate) {
    message = `not started yet. Opens on ${qualification.displayPeriod}`;
  } else if (today >= startDate && today <= endDate) {
    message = `open: ${qualification.displayPeriod}`;
  } else {
    message = `closed.`;
  }

  const ay = getAcademicYear(startDate);
  const header = `📅 ${ay ? ay + " " : ""}Application Period for the ${qualification.name} Qualification is ${message}`;

  const cardClass =
    today < startDate ? "notice-upcoming" :
    (today <= endDate ? "notice-open" : "notice-closed");

  return `
    <div class="notice-card ${cardClass}">
      <h2>${header}</h2>
    </div>
  `;
}

// Render login instructions
function renderLoginInstructions(qualification) {
  switch (qualification.type) {
    case "transfer":
      return `
        <div class="info-card">
          <h3>🖥️ Prospective Transfer Applicants</h3>
          <p>As you are a transfer applicant, please log in to the Applicant Portal with your Singpass to proceed.</p>
        </div>
      `;
    case "local":
      if (qualification.id === "polytechnic-diploma-singapore") {
        return `
          <div class="info-card">
            <h3>🖥️ Singapore Citizen / PR / FIN Holders</h3>
            <p>Please log in with your Singpass to apply using the Polytechnic Diploma from Singapore.</p>
            <hr>
            <h3>🌏 Foreigners (without FIN)</h3>
            <p>Please log in with your email account to apply using the Polytechnic Diploma from Singapore.</p>
          </div>
        `;
      } else {
        return `
          <div class="info-card">
            <h3>🖥️ Prospective Applicants</h3>
            <p>Please log in with your Singpass to apply using ${qualification.name}.</p>
            ${qualification.mtlUrl ? `<p>📌 Check Mother Tongue Language requirements: <a href="${qualification.mtlUrl}" target="_blank" rel="noopener">link</a></p>` : ""}
          </div>
        `;
      }
    case "international":
      return `
        <div class="info-card">
          <h3>🔎 Singapore Citizen / PR / FIN Holders</h3>
          <p>Log in with Singpass and apply under Singapore Citizens / PR category using ${qualification.name}.</p>
          <p>📌 Check Mother Tongue Language requirements.</p>
          <hr>
          <h3>🌏 Foreigners (without FIN)</h3>
          <p>Log in with your email account and apply under International Student category using ${qualification.name}.</p>
        </div>
      `;
    default:
      return "";
  }
}

// -------------------------------
// Templates for each qualification type
// -------------------------------
window.templates = {};

window.templates.internationalQualificationTemplate = function(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    <div class="info-card">
      <h2>${qualification.name}</h2>
      ${qualification.timeline ? `<p><strong>Application Timeline:</strong> ${qualification.displayPeriod}</p>` : ""}
      ${renderLoginInstructions(qualification)}
    </div>
    ${renderResourcesCard(qualification)}
  `;
};

window.templates.localQualificationTemplate = function(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    <div class="info-card">
      <h2>${qualification.name}</h2>
      ${qualification.timeline ? `<p><strong>Application Timeline:</strong> ${qualification.displayPeriod}</p>` : ""}
      ${qualification.mtlUrl ? `<p><a href="${qualification.mtlUrl}" target="_blank" rel="noopener">Mother Tongue Language Requirements</a></p>` : ""}
      ${renderLoginInstructions(qualification)}
    </div>
    ${renderResourcesCard(qualification)}
  `;
};

window.templates.transferTemplate = function(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    <div class="info-card">
      <h2>${qualification.name}</h2>
      ${qualification.timeline || qualification.periods ? `<p><strong>Application Timeline:</strong> ${qualification.displayPeriod}</p>` : ""}
      ${renderLoginInstructions(qualification)}
    </div>
    ${renderResourcesCard(qualification)}
  `;
};
