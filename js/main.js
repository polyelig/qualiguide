// -------------------------------
// main.js (updated)
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quizContainer");
  const quizForm = document.getElementById("quizForm");
  const continueBtn = document.getElementById("continueBtn");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");

  let currentStepId = window.surveyFlow[0].id;  // start at first step
  const answers = {};

  // Flatten survey flow for easy lookup by ID
  const flowMap = {};
  window.surveyFlow.forEach(q => flowMap[q.id] = q);

function renderStep(stepId) {
  const step = flowMap[stepId];
  if (!step) return;

  currentStepId = stepId; // track current step
  quizContainer.innerHTML = "";

  // Question label
  const questionLabel = document.createElement("div");
  questionLabel.className = "question-label";
  questionLabel.textContent = step.question;
  quizContainer.appendChild(questionLabel);

  // No options → auto-advance
  if (!step.options || step.options.length === 0) {
    const nextStepId = step.next();
    if (nextStepId?.startsWith("end_")) {
      renderEndPage(nextStepId.replace("end_", ""));
    } else if (nextStepId) {
      renderStep(nextStepId);
    }
    return;
  }

  // Special case: qualifications dropdown
  if (stepId === "qualification") {
    const select = document.createElement("select");
    select.name = "userAnswer";
    select.className = "dropdown";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "-- Select your qualification --";
    select.appendChild(defaultOption);

    step.options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });

    quizContainer.appendChild(select);

  } else {
    // Radio buttons for all other questions
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options-list";

    step.options.forEach(opt => {
      const optionDiv = document.createElement("div");
      optionDiv.className = "option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "userAnswer";
      input.value = opt;
      input.id = `${stepId}-${opt}`;

      const label = document.createElement("label");
      label.textContent = opt;
      label.setAttribute("for", input.id);

      optionDiv.appendChild(input);
      optionDiv.appendChild(label);
      optionsDiv.appendChild(optionDiv);

      optionDiv.addEventListener("click", () => {
        input.checked = true;
      });
    });

    quizContainer.appendChild(optionsDiv);
  }

  continueBtn.style.display = "block";
  downloadPdfBtn.style.display = "none";
}


  function renderEndPage(qualificationId) {
    const allQuals = window.qualificationsData || [];
    let qualification = allQuals.find(q => q.id === qualificationId);

    if (!qualification && qualificationId === "transfer") {
      qualification = allQuals.find(q => q.type === "transfer");
    }

    if (!qualification) {
      quizContainer.innerHTML = "<p>Qualification not found.</p>";
      return;
    }

    quizContainer.innerHTML = "";

    let html = "";
    switch (qualification.type) {
      case "international":
        html = window.templates.internationalQualificationTemplate(qualification);
        break;
      case "local":
        html = window.templates.localQualificationTemplate(qualification);
        break;
      case "transfer":
        html = window.templates.transferTemplate(qualification);
        break;
      default:
        html = `<div class="info-card"><p>${qualification.name}</p></div>`;
    }

    quizContainer.innerHTML = html;
    downloadPdfBtn.style.display = "inline-block";
    continueBtn.style.display = "none";
  }

  // Handle continue button
  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // ✅ Always get selected input inside quizContainer
    const selectedInput = quizContainer.querySelector('input[name="userAnswer"]:checked');
    if (!selectedInput) return alert("Please select an option.");
    const selected = selectedInput.value;

    answers[currentStepId] = selected;

    const step = flowMap[currentStepId];
    const nextStepId = step.next(selected);

    if (nextStepId?.startsWith("end_")) {
      renderEndPage(nextStepId.replace("end_", ""));
    } else if (nextStepId) {
      renderStep(nextStepId);
    }
  });

  // PDF Download
  downloadPdfBtn.addEventListener("click", () => {
    const element = quizContainer;
    const opt = {
      margin: 0.5,
      filename: "nus_application_quiz.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
  });

  // Start quiz
  renderStep(currentStepId);
});

