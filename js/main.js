// main.js

// Remove query params from URL
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

// Utility: logging toggle
const DEBUG = false;
function logDebug(...args) {
  if (DEBUG) console.log(...args);
}

// Utility: find qualification by name
function getQualificationByName(name) {
  return window.qualificationsData.find(q => q.name === name);
}

// Render current question
function renderQuestion() {
  const step = window.surveyFlow[currentStep];
  quizContainer.innerHTML = "";

  if (!step) return;

  const label = document.createElement("label");
  label.className = "question-label";
  label.textContent = step.question;
  quizContainer.appendChild(label);

  if (step.id !== "qualification") {
    const optionsList = document.createElement("div");
    optionsList.className = "options-list";
    step.options.forEach(opt => {
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

// Handle form submission
quizForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const step = window.surveyFlow[currentStep];
  let answer;

  if (step.id !== "qualification") {
    answer = quizForm.querySelector('input[name="userAnswer"]:checked')?.value;
  } else {
    answer = quizForm.querySelector('select[name="userAnswer"]')?.value;
  }
  if (!answer) return;

  answers[step.id] = answer;

  const nextId = typeof step.next === "function" ? step.next(answer) : step.next;
  const nextIndex = window.surveyFlow.findIndex(q => q.id === nextId);

  if (nextIndex !== -1) {
    currentStep = nextIndex;
    renderQuestion();
  } else {
    showFinalPage();
  }
});

// Show final page with notice card + resources
function showFinalPage() {
  quizContainer.innerHTML = "";
  continueBtn.style.display = "none";
  downloadPdfBtn.style.display = "inline-block";

  const selectedQualification = answers["qualification"];
  const qualificationEntry = getQualificationByName(selectedQualification);

  let customHtml = "";

  try {
    if (qualificationEntry) {
      logDebug("Selected qualification:", qualificationEntry);

      // Delegate rendering to templates
      if (qualificationEntry.type === "international") {
        customHtml = window.templates.internationalQualificationTemplate(qualificationEntry);
      } else if (qualificationEntry.type === "transfer") {
        customHtml = window.templates.transferTemplate(qualificationEntry);
      } else {
        customHtml = window.templates.localQualificationTemplate(qualificationEntry);
      }
    } else {
      throw new Error("Qualification not found");
    }
  } catch (err) {
    console.error(err);
    customHtml = `
      <div class="info-card">
        <h3>Sorry for the error!</h3>
        <p>Please check <a href="https://nus.edu.sg/oam/admissions" target="_blank">NUS Admissions Website</a> for more information.</p>
      </div>
    `;
  }

  quizContainer.innerHTML = customHtml;
  pdfContent.innerHTML = customHtml;
}

// PDF download
downloadPdfBtn.addEventListener("click", function () {
  html2pdf().set({
    margin: 0.5,
    filename: "NUS_Application_Quiz.pdf",
    html2canvas: { scale: 2 }
  }).from(pdfContent).save();
});

// Initial render
renderQuestion();
