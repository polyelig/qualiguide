//main.js

// Remove any query params from the URL (defensive, in case of accidental GET submission)
if (window.location.search) {
  window.history.replaceState({}, document.title, window.location.pathname);
}

let currentStep = 0;
let answers = {};
const quizContainer = document.getElementById("quizContainer");
const quizForm = document.getElementById("quizForm");
const continueBtn = document.getElementById("continueBtn");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");
const pdfContent = document.getElementById("pdfContent");

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
    step.options.forEach((opt) => {
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

// Handle survey progression and display the correct end-of-survey page
quizForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const step = surveyFlow[currentStep];
  let answer;
  if (step.id !== "qualification") {
    answer = quizForm.querySelector('input[name="userAnswer"]:checked')?.value;
  } else {
    answer = quizForm.querySelector('select[name="userAnswer"]')?.value;
  }
  if (!answer) return; // Prevent progression if not answered

  answers[step.id] = answer;

  // Find next step
  const nextId = typeof step.next === "function" ? step.next(answer) : step.next;
  const nextIndex = surveyFlow.findIndex(q => q.id === nextId);

  if (nextIndex !== -1) {
    currentStep = nextIndex;
    renderQuestion();
  } else {
    // End of survey
    showCustomTemplate();
  }
});

function showCustomTemplate() {
  quizContainer.innerHTML = "";
  continueBtn.style.display = "none";
  downloadPdfBtn.style.display = "inline-block";

  // Determine which qualification was selected
  const selectedQualification = answers["qualification"];
  let qualificationEntry;

  // If no qualification selected, it’s a transfer path
  if (!selectedQualification) {
    qualificationEntry = qualificationsData.find(q => q.type === "transfer");
  } else {
    qualificationEntry = qualificationsData.find(q => q.name === selectedQualification);
  }

  let customHtml = "";
  if (qualificationEntry) {
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
  }

  // Render the custom page
  quizContainer.innerHTML = customHtml;
  pdfContent.innerHTML = customHtml; // For PDF generation
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
