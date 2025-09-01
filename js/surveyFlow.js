const surveyFlow = [
  {
    id: "transfer",
    question: "Are you currently studying in a tertiary institution / have enrolled in / graduated from a tertiary institution?",
    options: [
      "Local universities (NUS, NTU, SMU, SIT, SUTD, SUSS, UAS)",
      "Overseas tertiary institutions",
      "I am not a current or former undergraduate"
    ],
    next: (answer) => {
      if(answer === "Local universities (NUS, NTU, SMU, SIT, SUTD, SUSS, UAS)") return "endLocal";
      if(answer === "Overseas tertiary institutions") return "nationality";
      if(answer === "I am not a current or former undergraduate") return "nationality";
    }
  },
  {
    id: "nationality",
    question: "What is your nationality?",
    options: ["Singapore Citizen/ Singapore Permanent Resident", "Foreigner"],
    next: (answer) => {
      if(answer === "Singapore Citizen/ Singapore Permanent Resident") return "endLocal";
      if(answer === "Foreigner") return "qualification";
    }
  },
  {
    id: "qualification",
    question: "What qualification will you be using to apply to the National University of Singapore (NUS)?",
    options: [
      "Singapore-Cambridge GCE A-Level",
      "Polytechnic Diploma from Singapore",
      "NUS High School Diploma",
      "International Baccalaureate (IB) Diploma",
      "Vietnam National High School Graduation Examination"
      // Add more qualifications here
    ],
    next: (answer) => "endQualification"
  }
];
