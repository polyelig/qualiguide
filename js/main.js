// -------------------------------
// main.js
// -------------------------------

// Remove query params from URL
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

// Show final page
function showFinalPage(selected){
  quizContainer.innerHTML="";
  continueBtn.style.display="none";
  downloadPdfBtn.style.display="inline-block";

  var qualName = selected || answers["qualification"];
  if(qualName==="Local universities (NUS, NTU, SMU, SIT, SUTD, SUSS, UAS)" || qualName==="Singapore Citizen/ Singapore Permanent Resident") qualName="Transfer";
  var qualEntry = getQualificationByName(qualName);

  var customHtml="";
  try{
    if(!qualEntry) throw new Error("Qualification not found");

    if(qualEntry.type==="international") customHtml = window.templates.internationalQualificationTemplate(qualEntry);
    else if(qualEntry.type==="transfer") customHtml = window.templates.transferTemplate(qualEntry);
    else customHtml = window.templates.localQualificationTemplate(qualEntry);
  } catch(err){
    console.error(err);
    customHtml = '<div class="info-card"><h3>Sorry for the error!</h3><p>Please check <a href="https://nus.edu.sg/oam/admissions" target="_blank">NUS Admissions Website</a> for more info.</p></div>';
  }

  quizContainer.innerHTML=customHtml;
  pdfContent.innerHTML=customHtml;
}

// PDF download
downloadPdfBtn.addEventListener("click", function(){
  html2pdf().set({margin:0.5,filename:"NUS_Application_Quiz.pdf",html2canvas:{scale:2}}).from(pdfContent).save();
});

// Initial render
renderQuestion();

