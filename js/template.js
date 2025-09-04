// -------------------------------
// template.js
// -------------------------------

const today = new Date();

// links inside list items
function createResourceItem(resource) {
  const li = document.createElement("li");
  li.className = "resource-card";

  const a = document.createElement("a");
  a.href = resource.url;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = resource.label;
  a.className = "resource-link";

  li.appendChild(a);

  if (resource.description) {
    const desc = document.createElement("div");
    desc.className = "resource-desc";
    desc.textContent = resource.description;
    li.appendChild(desc);  // sits below the link
  }

  return li;
}


function renderResources(qualification) {
  const list = document.createElement("ul");
  list.className = "resource-list";

  if (window.commonResources) {
    window.commonResources.forEach(r => list.appendChild(createResourceItem(r)));
  }

  if (qualification.standardisedTest === "Yes" && window.conditionalResources?.standardisedTest) {
    list.appendChild(createResourceItem(window.conditionalResources.standardisedTest));
  }
  if (qualification.englishRequirement === "Yes" && window.conditionalResources?.englishRequirement) {
    list.appendChild(createResourceItem(window.conditionalResources.englishRequirement));
  }

  const unique = (window.uniqueResources && window.uniqueResources[qualification.id]) || [];
  unique.forEach(r => list.appendChild(createResourceItem(r)));

  return list;
}

// Better resources card styling (own card, consistent with login)
function renderResourcesCard(qualification) {
  return `
    <div class="info-card resources-card">
      <h3>Application Resources</h3>
      ${renderResources(qualification).outerHTML}
    </div>
  `;
}

// AY label (AY starts in Aug)
function getAcademicYear(fromDate) {
  if (!fromDate || isNaN(fromDate)) return null;
  const m = fromDate.getMonth(); // 0-11
  const y = fromDate.getFullYear();
  const ayStart = (m >= 7) ? y + 1 : y;
  return `AY${ayStart}/${ayStart + 1}`;
}

// Multi-line notice card across all templates
function renderNoticeCard(qualification) {
  // Transfer = no single timeline; show list but same styling
  if (qualification.type === "transfer" && Array.isArray(qualification.periods)) {
    const headerLine1 = `📅 Application Periods for the ${qualification.name} Qualification`;
    const list = qualification.periods.map(p => `<li>${p.label}: ${p.rangeText}</li>`).join("");
    return `
      <div class="notice-card notice-upcoming">
        <h2>${headerLine1}</h2>
        <ul>${list}</ul>
      </div>
    `;
  }

  if (!qualification.timeline) return "";

  const start = new Date(qualification.timeline.start);
  const end   = new Date(qualification.timeline.end);
  const ay    = getAcademicYear(start) ? getAcademicYear(start) + " " : "";

  let statusText, cardClass;
  if (today < start) {
    statusText = "has not started yet.";
    cardClass = "notice-upcoming";
  } else if (today <= end) {
    statusText = "is open.";
    cardClass = "notice-open";
  } else {
    statusText = "has closed.";
    cardClass = "notice-closed";
  }

  // Required multi-line format:
  // line1: 📅 AY2026/2027 Application Period for the
  // line2: [Qualification name] Qualification has not started yet. / is open. / has closed.
  // line3: Opens on 17 December 2025 to 23 March 2026  (or “Open: …” if you prefer)
  const line1 = `📅 ${ay}Application Period for the`;
  const line2 = `${qualification.name} Qualification ${statusText}`;
  const line3Prefix = (today < start) ? "Opens on " : (today <= end ? "Open: " : "Period: ");
  const line3 = `${line3Prefix}${qualification.displayPeriod}`;

  return `
    <div class="notice-card ${cardClass}">
      <h2>${line1}</h2>
      <p>${line2}</p>
      <p>${line3}</p>
    </div>
  `;
}

// Login instructions (unchanged except rel=noopener on links)
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
