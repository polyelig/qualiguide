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

// Notice card (open, closed, upcoming)
function renderNoticeCard(qualification) {
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
    <div class="notice-box ${cardClass}">
      <h2>Application Notice</h2>
      <p>${message}</p>
    </div>
  `;
}

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
        // For Singapore-Cambridge A-Level, NUS High, IB
        return `
          <div class="login-instructions">
            <h3>🖥️ Prospective Applicants</h3>
            <p>Please log in to the Applicant Portal with your Singpass to proceed with your application using the ${qualification.name}.</p>
            ${qualification.mtlUrl ? `<p>📌 Please check if you fulfil the Mother Tongue Language (MTL) requirements: <a href="${qualification.mtlUrl}" target="_blank">link</a></p>` : ""}
          </div>
        `;
      }

    case "international":
      // Example for Vietnam National High School (two sets)
      if (qualification.id === "vietnam-national-high-school") {
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
      } else {
        return `
          <div class="login-instructions">
            <h3>🖥️ Prospective Applicants</h3>
            <p>Please log in to the Applicant Portal with your Singpass to proceed with your application using the ${qualification.name}.</p>
          </div>
        `;
      }

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
      ${qualification.timeline ? `<p><strong>Application Timeline:</strong> ${qualification.displayPeriod}</p>` : ""}
      ${renderLoginInstructions(qualification)}
      <h3>Resources</h3>
      ${renderResources(qualification).outerHTML}
    </div>
  `;
};
