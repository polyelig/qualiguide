// -------------------------------
// main.js
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quizContainer");
  const continueBtn = document.getElementById("continueBtn");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");
  const pdfContent = document.getElementById("pdfContent");

  // -------------------------------
  // Helper: Determine Template
  // -------------------------------
  function getTemplate(qualification) {
    switch (qualification.type) {
      case "international":
        return templates.internationalQualificationTemplate;
      case "local":
        return templates.localQualificationTemplate;
      case "transfer":
        return templates.transferTemplate;
      default:
        console.warn("Unknown qualification type:", qualification.type);
        return () => "<p>Unknown Qualification Type</p>";
    }
  }

  // -------------------------------
  // Helper: Ensure displayPeriod is filled
  // -------------------------------
  function getDisplayPeriod(qualification) {
    if (qualification.displayPeriod) return qualification.displayPeriod;

    if (qualification.timeline?.start && qualification.timeline?.end) {
      return `${qualification.timeline.start} to ${qualification.timeline.end}`;
    }

    if (qualification.periods?.length) {
      return qualification.periods.map(p => `${p.label}: ${p.rangeText}`).join("; ");
    }

    return "TBD";
  }

  // -------------------------------
  // Render selected qualification
  // -------------------------------
  function renderQualification(qualification) {
    // Ensure displayPeriod
    qualification.displayPeriod = getDisplayPeriod(qualification);

    const templateFunc = getTemplate(qualification);
    quizContainer.innerHTML = templateFunc(qualification);

    // Optional: attach event listeners if needed
    downloadPdfBtn.style.display = "inline-block"; // show PDF button after rendering
  }

  // -------------------------------
  // Handle Continue button
  // -------------------------------
  continueBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Example: navigate to next quiz page
    // Replace with your surveyFlow logic
    if (window.nextPage) {
      window.nextPage(); // your surveyFlow function
    } else {
      alert("Continue clicked. Implement navigation logic.");
    }
  });

  // -------------------------------
  // Handle Download PDF
  // -------------------------------
  downloadPdfBtn.addEventListener("click", () => {
    const element = quizContainer; // render quiz content as PDF
    const opt = {
      margin:       0.5,
      filename:     "application_info.pdf",
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  });

  // -------------------------------
  // Example: get selected qualification
  // Replace this with actual selection logic from surveyFlow
  // -------------------------------
  const selectedQualificationId = window.selectedQualificationId || "singapore-cambridge-gce-a-level"; // default
  const allQualifications = [...(window.localQualifications || []), ...(window.internationalQualifications || []), window.transferQualification].flat();
  const selectedQualification = allQualifications.find(q => q.id === selectedQualificationId);

  if (!selectedQualification) {
    quizContainer.innerHTML = "<p>No qualification selected.</p>";
    continueBtn.disabled = true;
    downloadPdfBtn.style.display = "none";
    return;
  }

  // Render
  renderQualification(selectedQualification);
});
