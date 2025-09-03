// -------------------------------
// qualifications.js
// -------------------------------

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
    id: "a-level-aqa-cambridge-edexcel-london-ocr-oxford-international-aqa-wjec",
    name: "A-Level (AQA, Cambridge, Edexcel, London, OCR, Oxford International AQA, WJEC)",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    standardisedTest: Yes,
    englishRequirement: Yes,
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
  {
    id: "australian-high-school",
    name: "Australian High School",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/australian-high-school" }
    ]
  },
  {
    id: "brunei-a-level",
    name: "Brunei A-Level",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/brunei-a-level" }
    ]
  },
  {
    id: "canadian-high-school-diploma",
    name: "Canadian High School Diploma",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/canadian-high-school-diploma" }
    ]
  },
  {
    id: "cape",
    name: "Caribbean Advanced Proficiency Examination (CAPE)",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/cape" }
    ]
  },
  {
    id: "danish-studentereksamen",
    name: "Danish Studentereksamen (Upper Secondary Leaving Examination)",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/danish-studentereksamen" }
    ]
  },
  {
    id: "european-baccalaureate",
    name: "European Baccalaureate Diploma",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/european-baccalaureate-diploma" }
    ]
  },
  {
    id: "french-baccalaureate",
    name: "French Baccalaureate Diploma",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/french-baccalaureate-diploma" }
    ]
  },
  {
    id: "gao-kao",
    name: "Gao Kao / PRC National College Entrance Exam",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/gao-kao" }
    ]
  },
  {
    id: "german-abitur",
    name: "German Abitur",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/german-abitur" }
    ]
  },
  {
    id: "hkdse-hong-kong-a-level",
    name: "Hong Kong Diploma of Secondary Education (HKDSE)/ Hong Kong A-Level",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/hkdse" }
    ]
  },
  {
    id: "independent-examinations-board",
    name: "Independent Examinations Board",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/independent-examinations-board" }
    ]
  },
  {
    id: "indian-standard-12-central-isc",
    name: "Indian Standard 12 (Central & ISC Boards)",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/indian-standard-12-central-isc" }
    ]
  },
  {
    id: "indian-standard-12-state-other-boards",
    name: "Indian Standard 12 (State and other Boards)",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/indian-standard-12-state" }
    ]
  },
  {
    id: "indonesian-ujian-nasional",
    name: "Indonesian Ujian Nasional (UN) / Raport",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/indonesian-ujian-nasional" }
    ]
  },
  {
    id: "italian-diploma-di-esame-di-stato",
    name: "Italian Diploma di Esame di Stato",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/italian-diploma-di-esame-di-stato" }
    ]
  },
  {
    id: "mauritius-high-school-certificate",
    name: "Mauritius High School Certificate",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/mauritius-high-school-certificate" }
    ]
  },
  {
    id: "ncea-level-3",
    name: "New Zealand National Certificate of Education Achievement (NCEA) Level 3",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/ncea-level-3" }
    ]
  },
  {
    id: "oman-thanawiya-amma",
    name: "Oman Thanawiya Amma (Secondary School Leaving Certificate)",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/oman-thanawiya-amma" }
    ]
  },
  {
    id: "stpm",
    name: "Sijil Tinggi Persekolahan Malaysia (STPM)",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/stpm" }
    ]
  },
  {
    id: "sri-lanka-a-level",
    name: "Sri Lanka A-Level",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/sri-lanka-a-level" }
    ]
  },
  {
    id: "swiss-matura",
    name: "Swiss Matura/ Swiss Federal Maturity Certificate",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/swiss-matura-swiss-federal-maturity-certificate" }
    ]
  },
  {
    id: "taiwan-senior-high-school",
    name: "Taiwan Senior High School",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/taiwan-senior-high-school" }
    ]
  },
  {
    id: "thailand-mathayom-6",
    name: "Thailand Certificate of Secondary Education (Mathayom 6)",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/thailand-mathayom-6" }
    ]
  },
  {
    id: "turkish-high-school",
    name: "Turkish High School",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/turkish-high-school" }
    ]
  },
  {
    id: "uec",
    name: "Unified Examination Certificate (UEC)",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/uec" }
    ]
  },
  {
    id: "vietnam-national-high-school",
    name: "Vietnam National High School Graduation Examination",
    type: "international",
    timeline: internationalTimeline,
    openPeriodText: internationalOpenText,
    closedPeriodText: internationalClosedText,
    resources: [
      { label: "Admission Requirements", url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/vietnam-national-high-school" }
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

// Attach to window
window.qualificationsData = qualificationsData;

