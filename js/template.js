// -------------------------------
// template.js
// -------------------------------

// Import resources & qualifications
import { commonResources, conditionalResources, uniqueResources } from './resources.js';
import { qualifications } from './qualifications.js';

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
  commonResources.forEach(resource => {
    list.appendChild(createResourceItem(resource));
  });

  // Conditional resources
  if (qualification.standardisedTest === "Yes") {
    list.appendChild(createResourceItem(conditionalResources.standardisedTest));
  }
  if (qualification.englishRequirement === "Yes") {
    list.appendChild(createResourceItem(conditionalResources.englishRequirement));
  }

  // Unique resources
  const unique = uniqueResources[qualification.id] || [];
  unique.forEach(resource => {
    list.appendChild(createResourceItem(resource));
  });

  return list;
}

// Notice card (open, closed, or upcoming)
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

// -------------------------------
// Templates for each qualification type
// -------------------------------
function internationalQualificationTemplate(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    <div class="info-card">
      <h2>${qualification.name}</h2>
      ${qualification.timeline ? `<p><strong>Application Timeline:</strong> ${qualification.displayPeriod}</p>` : ""}
      <h3>Resources</h3>
      ${renderResources(qualification).outerHTML}
    </div>
  `;
}

function localQualificationTemplate(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    <div class="info-card">
      <h2>${qualification.name}</h2>
      ${qualification.timeline ? `<p><strong>Application Timeline:</strong> ${qualification.displayPeriod}</p>` : ""}
      ${qualification.mtlUrl ? `<p><a href="${qualification.mtlUrl}" target="_blank">Mother Tongue Language Requirements</a></p>` : ""}
      <h3>Resources</h3>
      ${renderResources(qualification).outerHTML}
    </div>
  `;
}

function transferTemplate(qualification) {
  return `
    ${renderNoticeCard(qualification)}
    <div class="info-card">
      <h2>${qualification.name}</h2>
      ${qualification.timeline ? `<p><strong>Application Timeline:</strong> ${qualification.displayPeriod}</p>` : ""}
      <h3>Resources</h3>
      ${renderResources(qualification).outerHTML}
    </div>
  `;
}

// -------------------------------
// Export templates
// -------------------------------
export const templates = {
  internationalQualificationTemplate,
  localQualificationTemplate,
  transferTemplate
};
