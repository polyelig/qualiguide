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

// Notice card (open, closed, upcoming, or Transfer periods)
function renderNoticeCard(qualification) {
  // Transfer applicants: show multiple periods
  if (qualification.type === "transfer" && qualification.periods) {
    const periodsList = qualification.periods
      .map(p => `<li>${p.label}: ${p.rangeText}</li>`)
      .join("");
    return `
      <div class="notice-card notice-info">
        <h2>Application Periods</h2>
        <ul>${periodsList}</ul>
      </div>
    `;
  }

  // Other qualifications with a timeline
  if (!qualification.timeline) return "";

  const startDate = new Date(qualification.timeline.start);
  const endDate = new Date(qualification.timeline.end);

  let message = "";
  let cardClass = "";

  if (today < startDate) {
    message = `Application has not started yet. Opens on ${qualification.displayPeriod}`;
    cardClass = "notice-upcoming";
  } else if (today >= startDate && today <= endDate) {
    message = `Application period is open: ${qualification.displayPeriod}`;
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
            ${qualification.mtlUrl ? `<p>📌 Check Mother Tongue Language requirements: <a href="${qualification.mtlUrl}" target="_blank">link</a></p>` : ""}
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
      ${qualification.timeline ? `<p><strong>Application Timeline:</strong> ${qualification.displayPeriod}</p>` : ""}
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
      ${qualification.timeline || qualification.periods ? `<p><strong>Application Timeline:</strong> ${qualification.displayPeriod}</p>` : ""}
      ${renderLoginInstructions(qualification)}
      <h3>Resources</h3>
      ${renderResources(qualification).outerHTML}
    </div>
  `;
};
