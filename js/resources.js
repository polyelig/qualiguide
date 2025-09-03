// -------------------------------
// resources.js
// -------------------------------

// COMMON RESOURCES for all qualifications
window.commonResources = [
  {
    label: "Important Dates",
    url: "https://nus.edu.sg/oam/admissions/important-dates",
    description: "(application opening and closing dates)"
  },
  {
    label: "Application Guides & Sample Forms",
    url: "https://nus.edu.sg/oam/admissions/application-guides-sample-forms"
  },
  {
    label: "Programme Prerequisites",
    url: "https://nus.edu.sg/oam/admissions/before-you-apply",
    description: "(before you apply)"
  },
  {
    label: "Update of Applicant Information",
    url: "https://nus.edu.sg/oam/admissions/after-you-apply",
    description: "(after you apply)"
  }
];

// CONDITIONAL RESOURCES for international qualifications
window.conditionalResources = {
  standardisedTest: {
    label: "Standardised Test",
    url: "https://nus.edu.sg/oam/docs/default-source/default-document-library/standardised_test.pdf"
  },
  englishRequirement: {
    label: "English Language Requirement",
    url: "https://www.nus.edu.sg/oam/docs/default-source/default-document-library/english-test-scores.pdf"
  }
};

// UNIQUE RESOURCES per qualification
window.uniqueResources = {
  // -------------------------------
  // TRANSFER
  // -------------------------------
  transfer: [
    {
      label: "NUS Transfer Eligibility Chart",
      url: "https://nus.edu.sg/oam/docs/default-source/transfer-applicants/nus-oam-transfer-eligibility-chart.pdf"
    },
    {
      label: "Transfer Application Guides & Forms",
      url: "https://nus.edu.sg/oam/admissions/application-guides-sample-forms"
    }
  ],

  // -------------------------------
  // LOCAL QUALIFICATIONS (SINGAPORE)
  // -------------------------------
  "singapore-cambridge-gce-a-level": [
    {
      label: "Singapore-Cambridge GCE A-Level Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/singapore-cambridge-gce-a-level"
    },
    {
      label: "Indicative Grade Profile (IGP)",
      url: "https://nus.edu.sg/oam/admissions/indicative-grade-profile"
    }
  ],
  "polytechnic-diploma-singapore": [
    {
      label: "Polytechnic Diploma from Singapore Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/polytechnic-diploma-from-singapore"
    },
    {
      label: "Indicative Grade Profile (IGP)",
      url: "https://nus.edu.sg/oam/admissions/indicative-grade-profile"
    }
  ],
  "nus-high-school-diploma": [
    {
      label: "NUS High School Diploma Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/nus-high-school-diploma"
    }
  ],
  "international-baccalaureate-ib-diploma": [
    {
      label: "International Baccalaureate (IB) Diploma Admission Requirements",
      url: "https://www.nus.edu.sg/oam/admissions/international-baccalaureate-(ib)-diploma"
    }
  ],

  // -------------------------------
  // INTERNATIONAL QUALIFICATIONS
  // -------------------------------
  "a-level-all-boards": [
    {
      label: "A-Level Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/international-'a'-level"
    }
  ],
  "american-high-school-diploma": [
    {
      label: "American High School Diploma Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/american-high-school-diploma"
    }
  ],
  "australian-high-school": [
    {
      label: "Australian High School Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/australian-high-school"
    }
  ],
  "brunei-a-level": [
    {
      label: "Brunei A-Level Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/brunei-a-level"
    }
  ],
  "canadian-high-school-diploma": [
    {
      label: "Canadian High School Diploma Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/canadian-high-school-diploma"
    }
  ],
  "cape": [
    {
      label: "Caribbean Advanced Proficiency Examination (CAPE) Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/cape"
    }
  ],
  "danish-studentereksamen": [
    {
      label: "Danish Studentereksamen Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/danish-studentereksamen"
    }
  ],
  "european-baccalaureate": [
    {
      label: "European Baccalaureate Diploma Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/european-baccalaureate-diploma"
    }
  ],
  "french-baccalaureate": [
    {
      label: "French Baccalaureate Diploma Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/french-baccalaureate-diploma"
    }
  ],
  "gao-kao": [
    {
      label: "Gao Kao / PRC National College Entrance Exam Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/gao-kao"
    }
  ],
  "german-abitur": [
    {
      label: "German Abitur Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/german-abitur"
    }
  ],
  "hkdse": [
    {
      label: "Hong Kong Diploma of Secondary Education / Hong Kong A-Level Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/hkdse"
    }
  ],
  "independent-examinations-board": [
    {
      label: "Independent Examinations Board Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/independent-examinations-board"
    }
  ],
  "indian-standard-12-central-isc": [
    {
      label: "Indian Standard 12 (Central & ISC Boards) Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/indian-standard-12-central-isc"
    }
  ],
  "indian-standard-12-state": [
    {
      label: "Indian Standard 12 (State & Other Boards) Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/indian-standard-12-state"
    }
  ],
  "indonesian-ujian-nasional": [
    {
      label: "Indonesian Ujian Nasional / Raport Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/indonesian-ujian-nasional"
    }
  ],
  "italian-diploma-di-esame-di-stato": [
    {
      label: "Italian Diploma di Esame di Stato Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/italian-diploma-di-esame-di-stato"
    }
  ],
  "mauritius-high-school-certificate": [
    {
      label: "Mauritius High School Certificate Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/mauritius-high-school-certificate"
    }
  ],
  "ncea-level-3": [
    {
      label: "New Zealand NCEA Level 3 Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/ncea-level-3"
    }
  ],
  "oman-thanawiya-amma": [
    {
      label: "Oman Thanawiya Amma Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/oman-thanawiya-amma"
    }
  ],
  "stpm": [
    {
      label: "Sijil Tinggi Persekolahan Malaysia (STPM) Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/stpm"
    }
  ],
  "sri-lanka-a-level": [
    {
      label: "Sri Lanka A-Level Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/sri-lanka-a-level"
    }
  ],
  "swiss-matura": [
    {
      label: "Swiss Matura / Swiss Federal Maturity Certificate Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/swiss-matura-swiss-federal-maturity-certificate"
    }
  ],
  "taiwan-senior-high-school": [
    {
      label: "Taiwan Senior High School Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/taiwan-senior-high-school"
    }
  ],
  "thailand-mathayom-6": [
    {
      label: "Thailand Certificate of Secondary Education (Mathayom 6) Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/thailand-mathayom-6"
    }
  ],
  "turkish-high-school": [
    {
      label: "Turkish High School Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/turkish-high-school"
    }
  ],
  "uec": [
    {
      label: "Unified Examination Certificate (UEC) Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/uec"
    }
  ],
  "vietnam-national-high-school": [
    {
      label: "Vietnam National High School Graduation Exam Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/vietnam-national-high-school"
    }
  ],
  "other-high-school": [
    {
      label: "Other High School Qualifications Admission Requirements",
      url: "https://nus.edu.sg/oam/admissions/international-qualifications/international-qualifications/other-high-school-qualifications"
    }
  ]
};
