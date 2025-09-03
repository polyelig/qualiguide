if(window.location.search) window.history.replaceState({}, document.title, window.location.pathname);

var currentStep = 0;
var answers = {};
var quizContainer = document.getElementById("quizContainer");
var quizForm = document.getElementById("quizForm");
var continueBtn = document.getElementById("continueBtn");
var downloadPdfBtn = document.getElementById("downloadPdfBtn");
var pdfContent = document.getElementById("pdfContent");

// Utility to find qualification by name
function getQualificationByName(name){ return window.qualificationsData.find(q=>q.name===name); }

// Render current question
function renderQuestion(){
  var step = window.surveyFlow[currentStep];
  if(!step) return;
  quizContainer.innerHTML="";

  var label = document.createElement("label");
  label.className="question-label";
  label.textContent = step.question;
  quizContainer.appendChild(label);

  if(step.id!=="qualification"){
    var optionsList = document.createElement("div");
    optionsList.className="options-list";
    step.options.forEach(opt=>{
      var optionLabel = document.createElement("label");
      optionLabel.className="option";
      var radio = document.createElement("input");
      radio.type="radio";
      radio.name="userAnswer";
      radio.value=opt;
      radio.required=true;
      optionLabel.appendChild(radio);
      optionLabel.appendChild(document.createTextNode(opt));
      optionsList.appendChild(optionLabel);
    });
    quizContainer.appendChild(optionsList);
  } else {
    var select = document.createElement("select");
    select.name="userAnswer";
    select.required=true;
    select.innerHTML='<option value="" disabled selected>Select your qualification...</option>';
    step.options.forEach(opt=>{
      var option = document.createElement("option");
      option.value=opt;
      option.textContent=opt;
      select.appendChild(option);
    });
    quizContainer.appendChild(select);
  }

  downloadPdfBtn.style.display="none";
  continueBtn.style.display="inline-block";
}

// Handle form submission
quizForm.addEventListener("submit",function(e){
  e.preventDefault();
  var step = window.surveyFlow[currentStep];
  var answer;

  if(step.id!=="qualification") answer = quizForm.querySelector('input[name="userAnswer"]:checked')?.value;
  else answer = quizForm.querySelector('select[name="userAnswer"]')?.value;

  if(!answer) return;
  answers[step.id]=answer;

  var nextId = typeof step.next==="function"? step.next(answer):step.next;
  var nextIndex = window.surveyFlow.findIndex(q=>q.id===nextId);

  if(nextIndex!==-1){ currentStep=nextIndex; renderQuestion();}
  else showFinalPage(answer);
});

function showFinalPage(selected) {
  quizContainer.innerHTML = "";
  continueBtn.style.display = "none";
  downloadPdfBtn.style.display = "inline-block";

  const qualName = selected || answers["qualification"];
  const qualEntry = getQualificationByName(qualName);

  // -------------------------------
  // TIMELINE LOGIC
  // -------------------------------
  let timelineHTML = "";

  if (qualEntry.type === "transfer" && qualEntry.periods) {
    // Transfer: multiple periods
    timelineHTML = qualEntry.periods.map(p => `
      <div class="period-card open">
        ${p.label}: ${p.rangeText}
      </div>
    `).join("");
  } else if (qualEntry.timeline) {
    // Local or international: single timeline
    const start = qualEntry.timeline.start;
    const end = qualEntry.timeline.end;
    if (start && end) {
      timelineHTML = `
        <div class="period-card open">
          Application Timeline: ${start} to ${end}
        </div>
      `;
    } else {
      timelineHTML = `
        <div class="period-card closed">
          Application has not started yet.
        </div>
      `;
    }
  } else {
    timelineHTML = `
      <div class="period-card closed">
        Application has not started yet.
      </div>
    `;
  }

  // -------------------------------
  // RESOURCES LOGIC
  // -------------------------------
  let resourcesList = qualEntry.resources ? [...qualEntry.resources] : [];

  if (qualEntry.type === "international") {
    if (qualEntry.standardisedTest === "Yes") {
      resourcesList.push(window.conditionalResources.standardisedTest);
    }
    if (qualEntry.englishRequirement === "Yes") {
      resourcesList.push(window.conditionalResources.englishRequirement);
    }
  }

  const resourcesHTML = resourcesList.length > 0 ? `
    <div class="info-card">
      <h2>Resources & Guides</h2>
      <ul class="resource-list">
        ${resourcesList.map(r => `<li><a href="${r.url}" target="_blank">${r.label}</a>${r.description ? " " + r.description : ""}</li>`).join("")}
      </ul>
    </div>
  ` : "";

  // -------------------------------
  // FINAL PAGE HTML
  // -------------------------------
  const finalHTML = `
    <div class="info-card">
      <h2>Qualification</h2>
      <p>${qualEntry.fullName || qualEntry.name}</p>
    </div>
    <hr class="section-divider">
    ${timelineHTML}
    <hr class="section-divider">
    ${resourcesHTML}
  `;

  quizContainer.innerHTML = finalHTML;
  pdfContent.innerHTML = finalHTML;
}


// PDF download
downloadPdfBtn.addEventListener("click", function(){
  html2pdf().set({margin:0.5,filename:"NUS_Application_Quiz.pdf",html2canvas:{scale:2}}).from(pdfContent).save();
});

// Initial render
renderQuestion();

