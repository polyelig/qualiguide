// main.js

let currentStep = 0;
let answers = {};
const quizContainer = document.getElementById("quizContainer");
const quizForm = document.getElementById("quizForm");
const continueBtn = document.getElementById("continueBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const pdfContent = document.getElementById("pdfContent");

// Helper: Show/hide the correct notice box based on timeline and today's date
function showRelevantNoticeBoxes(start, end, openId, closedId) {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  const openBox = document.getElementById(openId);
  const closedBox = document.getElementById(closedId);
  if (openBox) openBox.style.display = (now >= startDate && now <= endDate) ? "block" : "none";
  if (closedBox) closedBox.style.display = (now > endDate) ? "block" : "none";
}

// Renders the current survey step/question
function renderQuestion() {
  const step = surveyFlow[currentStep];
  quizContainer.innerHTML = "";

  if (!step) return;

  // Question label
  const label = document.createElement("label");
  label.className = "question-label";
  label.textContent = step.question;
  quizContainer.appendChild(label);

  // Render radio group or dropdown
  if (step.id !== "qualification") {
    // Radio group
    const optionsList = document.createElement("div");
    optionsList.className = "options-list";
    step.options.forEach((opt, i) => {
      const optionLabel = document.createElement("label");
      optionLabel.className = "option";
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "userAnswer";
      radio.value = opt;
      radio.required = true;
      optionLabel.appendChild(radio);
      optionLabel.appendChild(document.createTextNode(opt));
      optionsList.appendChild(optionLabel);
    });
    quizContainer.appendChild(optionsList);
  } else {
    // Dropdown
    const select = document.createElement("select");
    select.name = "userAnswer";
    select.required = true;
    select.innerHTML = `<option value="" disabled selected>Select your qualification...</option>`;
    step.options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });
    quizContainer.appendChild(select);
  }
}

// Direct users to the correct custom end-of-survey page
function showSummary() {
  quizContainer.innerHTML = "";
  continueBtn.style.display = "none";
  downloadPdfBtn.style.display = "inline-block";

  // Find selected qualification's data
  const selectedQualification = answers["qualification"];
  const qualificationEntry = qualificationsData.find(q => q.name === selectedQualification);

  // If found, use the correct template based on type
  let customHtml = "";
  if (qualificationEntry) {
    // For local, international, or transfer, use the right template
    if (qualificationEntry.type === "international") {
      customHtml = templates.internationalQualificationTemplate({
        name: qualificationEntry.name,
        timeline: qualificationEntry.timeline,
        openPeriodText: qualificationEntry.openPeriodText,
        closedPeriodText: qualificationEntry.closedPeriodText,
        resources: qualificationEntry.resources
      });
    } else if (qualificationEntry.type === "transfer") {
      customHtml = templates.transferTemplate({
        periods: qualificationEntry.periods,
        timeline: qualificationEntry.timeline,
        resources: qualificationEntry.resources
      });
    } else {
      // local
      customHtml = templates.localQualificationTemplate({
        qualificationName: qualificationEntry.name,
        timeline: qualificationEntry.timeline,
        openPeriodText: qualificationEntry.openPeriodText,
        closedPeriodText: qualificationEntry.closedPeriodText,
        resources: qualificationEntry.resources,
        mtlUrl: qualificationEntry.mtlUrl
      });
    }
  } else {
    // fallback summary
    let summaryHtml = "<h3>Thank you for completing the quiz!</h3><div id='summary'></div>";
    summaryHtml += "<ul>";
    for (const step of surveyFlow) {
      if (answers[step.id]) {
        summaryHtml += `<li><strong>${step.question}</strong><br>${answers[step.id]}</li>`;
      }
    }
    summaryHtml += "</ul>";
    customHtml = summaryHtml;
  }

  // Render the custom page
  quizContainer.innerHTML = customHtml;
  pdfContent.innerHTML = customHtml; // For PDF generation

  // Show/hide notice boxes for period (if present)
  if (qualificationEntry && qualificationEntry.timeline) {
    showRelevantNoticeBoxes(
      qualificationEntry.timeline.start,
      qualificationEntry.timeline.end,
      "noticeOpenInternational", // id for open box
      "noticeClosedInternational" // id for closed box
    );
  }
}

// PDF Download
downloadPdfBtn.addEventListener("click", function() {
  html2pdf().set({
    margin: 0.5,
    filename: 'NUS_Application_Quiz.pdf',
    html2canvas: { scale: 2 }
  }).from(pdfContent).save();
});

// Initial render
renderQuestion();
