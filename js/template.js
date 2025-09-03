// -------------------------------
// template.js
// -------------------------------

import { commonResources, conditionalResources, uniqueResources } from './resources.js';
import { qualifications } from './qualifications.js';

// Get today's date
const today = new Date();

// Utility to format a resource item
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

// Render resources for a given qualification
function renderResources(qualificationId, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  // Common resources
  commonResources.forEach(resource => {
    container.appendChild(createResourceItem(resource));
  });

  // Conditional resources (from qualifications.js)
  const qual = qualifications.find(q => q.id === qualificationId);
  if (!qual) return;

  if (qual.standardisedTest === "Yes") {
    container.appendChild(createResourceItem(conditionalResources.standardisedTest));
  }
  if (qual.englishRequirement === "Yes") {
    container.appendChild(createResourceItem(conditionalResources.englishRequirement));
  }

  // Unique resources
  const unique = uniqueResources[qualificationId] || [];
  unique.forEach(resource => {
    container.appendChild(createResourceItem(resource));
  });
}

// Render notice card based on timeline
function renderNoticeCard(qualificationId, noticeContainerId) {
  const container = document.getElementById(noticeContainerId);
  container.innerHTML = "";

  const qual = qualifications.find(q => q.id === qualificationId);
  if (!qual || !qual.timeline) return;

  const startDate = new Date(qual.timeline.start);
  const endDate = new Date(qual.timeline.end);

  let message = "";
  let cardClass = "";

  if (today < startDate) {
    message = `Application has not started yet. Opens on ${qual.displayPeriod}`;
    cardClass = "notice-upcoming";
  } else if (today >= startDate && today <= endDate) {
    message = `Application period is open: ${qual.displayPeriod}`;
    cardClass = "notice-open";
  } else {
    message = "Application period is closed";
    cardClass = "notice-closed";
  }

  const noticeCard = document.createElement("div");
  noticeCard.className = `notice-card ${cardClass}`;
  noticeCard.textContent = message;

  container.appendChild(noticeCard);
}

// Render a qualification section
export function renderQualificationSection(qualificationId, containerId, noticeContainerId) {
  renderNoticeCard(qualificationId, noticeContainerId);
  renderResources(qualificationId, containerId);
}

// Example usage (replace IDs with your actual HTML container IDs)
// renderQualificationSection("swiss-matura", "resources-container", "notice-container");
// renderQualificationSection("stpm", "resources-container", "notice-container");
// renderQualificationSection("transfer-sem1", "resources-container", "notice-container");

