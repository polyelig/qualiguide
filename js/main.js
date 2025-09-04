// -------------------------------
// main.js (full, updated)
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quizContainer");
  const quizForm = document.getElementById("quizForm");
  const continueBtn = document.getElementById("continueBtn");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  const pageTitle = document.getElementById("pageTitle"); // retained but not used on end pages

  // Feature-detect :has(); set a class for CSS fallbacks
  try {
    if (!CSS.supports("selector(:has(*))")) {
      document.documentElement.classList.add("no-has");
    }
  } catch {
    document.documentElement.classList.add("no-has");
  }

  // Defensive: surveyFlow must exist
  if (!Array.isArray(window.surveyFlow) || window.surveyFlow.length === 0) {
    console.error("Survey flow not found.");
    quizContainer.innerHTML = "<p>We’re sorry, something went wrong loading the survey. Please refresh.</p>";
    continueBtn.style.display = "none";
    downloadPdfBtn.style.display = "none";
    return;
  }

  let currentStepId = window.surveyFlow[0].id;
  const answers = {};

  // Map for quick access
  const flowMap = {};
  window.surveyFlow.forEach(q => (flowMap[q.id] = q));

  // -------------------------------
  // Scroll modes
  // -------------------------------
  function setQuestionScrollMode() {
    // No scroll on question pages
    quizContainer.classList.remove("final-scroll");
    quizContainer.classList.remove("final-mode");
    quizContainer.style.overflowY = "hidden";
  }

  function setFinalScrollMode() {
    // Scroll contained within the main container on end pages
    quizContainer.classList.add("final-scroll");
    quizContainer.classList.add("final-mode"); // full width of white container
    quizContainer.style.overflowY = "auto";
  }

  // -------------------------------
  // Title inside scroll area (end pages)
  // -------------------------------
  function setPageTitleHTML(qualification) {
    // Insert <wbr> after slashes to allow clean wrapping into two lines
    const titleHtml = String(qualification.name).replace(/\s*\/\s*/g, "/<wbr> ");
    return `
      <div class="page-title-block">
        <div class="page-title">${titleHtml}</div>
        <div class="page-subtitle">Application Overview</div>
      </div>
    `;
  }

  // -------------------------------
  // Rendering
  // -------------------------------
  function renderStep(stepId) {
    const step = flowMap[stepId];
    if (!step) return;

    currentStepId = stepId;

    // Questions: clear out any static title and disable container scroll
    if (pageTitle) pageTitle.innerHTML = ""; // we no longer use this on end pages
    setQuestionScrollMode();

    quizContainer.innerHTML = "";

    const questionLabel = document.createElement("div");
    questionLabel.className = "question-label";
    questionLabel.textContent = step.question;
    quizContainer.appendChild(questionLabel);

    // No options → auto-advance
    if (!step.options || step.options.length === 0) {
      const nextStepId = typeof step.next === "function" ? step.next() : step.next;
      if (nextStepId?.startsWith?.("end_")) {
        renderEndPage(nextStepId.replace("end_", ""));
      } else if (nextStepId) {
        renderStep(nextStepId);
      }
      return;
    }

    // Qualification dropdown (options are {label, value})
    if (stepId === "qualification") {
      const select = document.createElement("select");
      select.name = "userAnswer";
      select.className = "dropdown";

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "-- Select your qualification --";
      select.appendChild(defaultOption);

      step.options.forEach(opt => {
        // expect { label, value }
        const option = document.createElement("option");
        option.value = opt.value;
        option.textContent = opt.label;
        select.appendChild(option);
      });

      quizContainer.appendChild(select);
    } else {
      // Radio buttons for other steps (options are strings)
      const optionsDiv = document.createElement("div");
      optionsDiv.className = "options-list";

      step.options.forEach(opt => {
        const optionDiv = document.createElement("div");
        optionDiv.className = "option";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "userAnswer";
        input.value = opt;
        const safeId = String(opt).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-]/g, "");
        input.id = `${stepId}-${safeId}`;

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

    // Ensure user is at top of the container
    quizContainer.scrollTop = 0;
  }

  function renderEndPage(qualificationId) {
    const allQuals = window.qualificationsData || [];
    let qualification =
      allQuals.find(q => q.id === qualificationId) ||
      (qualificationId === "transfer" ? allQuals.find(q => q.type === "transfer") : null);

    if (!qualification) {
      quizContainer.innerHTML = "<p>Qualification not found.</p>";
      continueBtn.style.display = "none";
      downloadPdfBtn.style.display = "none";
      return;
    }

    // Build the scrolling header inside the container
    const headerHTML = setPageTitleHTML(qualification);

    let contentHTML = "";
    switch (qualification.type) {
      case "international":
        contentHTML = window.templates.internationalQualificationTemplate(qualification);
        break;
      case "local":
        contentHTML = window.templates.localQualificationTemplate(qualification);
        break;
      case "transfer":
        contentHTML = window.templates.transferTemplate(qualification);
        break;
      default:
        contentHTML = `<div class="info-card"><p>${qualification.name}</p></div>`;
    }

    // Push title + content into the same scrollable area
    quizContainer.innerHTML = headerHTML + contentHTML;

    // End-page layout: enable container-only scroll and full width
    setFinalScrollMode();

    downloadPdfBtn.style.display = "inline-block";
    continueBtn.style.display = "none";

    quizContainer.scrollTop = 0;
  }

  // -------------------------------
  // Events
  // -------------------------------
  quizForm.addEventListener("submit", e => {
    e.preventDefault();

    const selectEl = quizContainer.querySelector('select[name="userAnswer"]');
    let selected = null;

    if (selectEl) {
      selected = selectEl.value;
      if (!selected) return alert("Please select an option.");
    } else {
      const selectedInput = quizContainer.querySelector('input[name="userAnswer"]:checked');
      if (!selectedInput) return alert("Please select an option.");
      selected = selectedInput.value;
    }

    answers[currentStepId] = selected;

    const step = flowMap[currentStepId];
    const nextStepId = typeof step.next === "function" ? step.next(selected) : step.next;

    if (nextStepId?.startsWith?.("end_")) {
      renderEndPage(nextStepId.replace("end_", ""));
    } else if (nextStepId) {
      renderStep(nextStepId);
    }
  });

  // PDF Download – capture full content (temporarily disable clipping)
  downloadPdfBtn.addEventListener("click", () => {
    if (typeof html2pdf === "undefined") {
      alert("PDF engine is still loading. Please try again in a moment.");
      return;
    }

    // Temporarily expand container to include all content
    const prevOverflow = quizContainer.style.overflow;
    const prevOverflowY = quizContainer.style.overflowY;
    const prevHeight   = quizContainer.style.height;
    const prevMaxH     = quizContainer.style.maxHeight;

    quizContainer.style.overflow = "visible";
    quizContainer.style.overflowY = "visible";
    quizContainer.style.height = "auto";
    quizContainer.style.maxHeight = "none";

    const opt = {
      margin: 0.5,
      filename: "nus_application_quiz.pdf",
      html2canvas: { scale: 2, useCORS: true, windowWidth: document.documentElement.offsetWidth },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] } // respects .page-break if used
    };

    html2pdf()
      .set(opt)
      .from(quizContainer)
      .save()
      .then(() => {
        // restore scroll clipping for on-screen UX
        quizContainer.style.overflow = prevOverflow;
        quizContainer.style.overflowY = prevOverflowY;
        quizContainer.style.height = prevHeight;
        quizContainer.style.maxHeight = prevMaxH;
        // return to container-only scroll mode after printing
        setFinalScrollMode();
      })
      .catch(() => {
        // restore even if failed
        quizContainer.style.overflow = prevOverflow;
        quizContainer.style.overflowY = prevOverflowY;
        quizContainer.style.height = prevHeight;
        quizContainer.style.maxHeight = prevMaxH;
        setFinalScrollMode();
      });
  });

  // -------------------------------
  // Init
  // -------------------------------
  renderStep(currentStepId);
});
