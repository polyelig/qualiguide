// qualifications.js

// --- Local Qualifications ---
const localQualifications = [
  {
    id: "singapore-cambridge-gce-a-level",
    name: "Singapore-Cambridge GCE A-Level",
    type: "local",
    timeline: { start: "2026-02-25", end: "2026-03-19" },
    openPeriodText: "25 February 2026 to 19 March 2026",
    closedPeriodText: "has closed.",
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/singapore-cambridge-gce-a-level" },
      { label: "Mother Tongue Language (MTL) requirements", url: "https://www.nus.edu.sg/oam/admissions/singapore-citizens-sprs-with-international-qualifications" }
    ],
    mtlUrl: "https://www.nus.edu.sg/oam/admissions/singapore-citizens-sprs-with-international-qualifications"
  },
  {
    id: "polytechnic-diploma-singapore",
    name: "Polytechnic Diploma from Singapore",
    type: "local",
    timeline: { start: "2025-12-17", end: "2026-02-04" },
    openPeriodText: "17 December 2025 to 4 February 2026",
    closedPeriodText: "has closed.",
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/polytechnic-diploma-from-singapore" }
    ]
  },
  {
    id: "nus-high-school-diploma",
    name: "NUS High School Diploma",
    type: "local",
    timeline: { start: "2025-12-17", end: "2026-02-02" },
    openPeriodText: "17 December 2025 to 2 January 2026",
    closedPeriodText: "has closed.",
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/nus-high-school-diploma" }
    ]
  },
  {
    id: "international-baccalaureate-ib-diploma",
    name: "International Baccalaureate (IB) Diploma",
    type: "local",
    timeline: { start: "2025-12-17", end: "2026-03-23" },
    openPeriodText: "17 December 2025 to 23 March 2026",
    closedPeriodText: "has closed.",
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-baccalaureate-(ib)-diploma" }
    ]
  }
];

// --- Transfer Qualification ---
const transferQualification = {
  id: "transfer",
  name: "Transfer",
  type: "transfer",
  periods: [
    { label: "📅 AY2024/2025 Semester 2", rangeText: "29 October 2024 to 12 November 2024" },
    { label: "📅 AY2025/2026 Semester 1", rangeText: "4 February 2025 to 18 February 2025" }
  ],
  timeline: null,
  resources: [
    { label: "Important Dates", url: "https://nus.edu.sg/oam/admissions/important-dates" },
    { label: "Application Guides & Sample Forms", url: "https://nus.edu.sg/oam/admissions/application-guides-sample-forms" },
    { label: "Programme Prerequisites", url: "https://nus.edu.sg/oam/admissions/before-you-apply" },
    { label: "Update of Applicant Information", url: "https://nus.edu.sg/oam/admissions/after-you-apply" },
    { label: "NUS Transfer Eligibility Chart", url: "https://nus.edu.sg/oam/docs/default-source/transfer-applicants/nus-oam-transfer-eligibility-chart.pdf" }
  ]
};

// --- International Qualifications ---
const internationalTimeline = { start: "2025-12-03", end: "2026-02-23" };
const internationalOpenText = "3 December 2025 to 23 February 2026";
const internationalClosedText = "has closed.";

const internationalQualifications = [
  {
    id: "a-level-cambridge-edexcel-ocr",
    name: "A-Level (AQA, Cambridge, Edexcel, London, OCR, Oxford International AQA, WJEC)",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/international-'a'-level" }
    ]
  },
  {
    id: "american-high-school-diploma",
    name: "American High School Diploma",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/american-high-school-diploma" }
    ]
  },
  // ... add the rest of your international qualifications here using the same pattern ...
  {
    id: "vietnam-national-high-school",
    name: "Vietnam National High School Graduation Examination",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/vietnam-national-high-school-graduation-examination" }
    ]
  },
  {
    id: "other-high-school-qualifications",
    name: "Other High School Qualifications",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/other-high-school-qualifications" }
    ]
  }
];

// --- Final Flat Array ---
const qualificationsData = [
  transferQualification,
  ...localQualifications,
  ...internationalQualifications
];

// Attach to window for global use if not using modules
window.qualificationsData = qualificationsData;
