// -------------------------------
// main.js
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

    currentStepId = stepId; // 🔑 keep track of current step
    quizContainer.innerHTML = "";

    const questionLabel = document.createElement("div");
    questionLabel.className = "question-label";
    questionLabel.textContent = step.question;
    quizContainer.appendChild(questionLabel);

    if (!step.options || step.options.length === 0) {
      const nextStepId = step.next();
      if (nextStepId?.startsWith("end_")) {
        renderEndPage(nextStepId.replace("end_", ""));
      } else if (nextStepId) {
        renderStep(nextStepId);
      }
      return;
    }

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options-list";

    step.options.forEach(opt => {
      const optionDiv = document.createElement("div");
      optionDiv.className = "option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "userAnswer";
      input.value = opt;

      const label = document.createElement("label");
      label.textContent = opt;

      optionDiv.appendChild(input);
      optionDiv.appendChild(label);
      optionsDiv.appendChild(optionDiv);

      optionDiv.addEventListener("click", () => {
        input.checked = true;
      });
    });

    quizContainer.appendChild(optionsDiv);

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
    const selected = quizForm.userAnswer?.value;
    if (!selected) return alert("Please select an option.");

    const step = flowMap[currentStepId];
    answers[currentStepId] = selected;

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
