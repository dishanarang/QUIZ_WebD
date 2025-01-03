import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZXZop4nK4xk-VltfoYp-kRhsCHZ4IcYA",
  authDomain: "loginexample-5ae09.firebaseapp.com",
  projectId: "loginexample-5ae09",
  storageBucket: "loginexample-5ae09.appspot.com",
  messagingSenderId: "484592425419",
  appId: "1:484592425419:web:5a1be64b4b778f2e51fe4e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM Elements
const quizTitleInput = document.getElementById("quiz-title");
const quizTimerInput = document.getElementById("quiz-timer");

const physicsQuestionsContainer = document.getElementById("physics-questions-container");
const chemistryQuestionsContainer = document.getElementById("chemistry-questions-container");
const mathQuestionsContainer = document.getElementById("math-questions-container");

const addPhysicsQuestionBtn = document.getElementById("add-physics-question-btn");
const addChemistryQuestionBtn = document.getElementById("add-chemistry-question-btn");
const addMathQuestionBtn = document.getElementById("add-math-question-btn");
const nextToChemistryBtn = document.getElementById("next-to-chemistry-btn");
const nextToMathBtn = document.getElementById("next-to-math-btn");
const submitQuizBtn = document.getElementById("submit-quiz-btn");

const physicsSection = document.getElementById("physics-section");
const chemistrySection = document.getElementById("chemistry-section");
const mathSection = document.getElementById("math-section");

const progressBarFill = document.getElementById("progress-bar-fill");

// Questions Storage
let physicsQuestions = [];
let chemistryQuestions = [];
let mathQuestions = [];

// Function to Add Questions
function addQuestion(container, questionsArray, sectionName) {
  const questionIndex = questionsArray.length + 1;
  const questionForm = document.createElement("div");
  questionForm.classList.add("question-form");
  questionForm.innerHTML = `
    <h3>${sectionName} Question ${questionIndex}</h3>
    <div class="form-group">
        <label for="question-text">Question Text</label>
        <input type="text" class="question-text" placeholder="Enter question text" required>
    </div>
    <div class="form-group">
        <label for="options">Options (comma separated)</label>
        <input type="text" class="question-options" placeholder="Enter options" required>
    </div>
    <div class="form-group">
        <label for="correct-answer">Correct Answer</label>
        <input type="text" class="question-correct-answer" placeholder="Enter correct answer" required>
    </div>
    <div class="form-group">
        <label for="positive-marks">Positive Marks</label>
        <input type="number" class="positive-marks" placeholder="Enter positive marks" required>
    </div>
    <div class="form-group">
        <label for="negative-marks">Negative Marks</label>
        <input type="number" class="negative-marks" placeholder="Enter negative marks" required>
    </div>
  `;
  container.appendChild(questionForm);
  questionsArray.push(questionForm);
}

// Event Listeners for Adding Questions
addPhysicsQuestionBtn.addEventListener("click", () =>
  addQuestion(physicsQuestionsContainer, physicsQuestions, "Physics")
);
addChemistryQuestionBtn.addEventListener("click", () =>
  addQuestion(chemistryQuestionsContainer, chemistryQuestions, "Chemistry")
);
addMathQuestionBtn.addEventListener("click", () =>
  addQuestion(mathQuestionsContainer, mathQuestions, "Mathematics")
);

// Section Navigation
nextToChemistryBtn.addEventListener("click", () => {
  physicsSection.classList.remove("active-section");
  chemistrySection.classList.add("active-section");
  updateProgressBar(33);
});
nextToMathBtn.addEventListener("click", () => {
  chemistrySection.classList.remove("active-section");
  mathSection.classList.add("active-section");
  updateProgressBar(66);
});

// Function to Update Progress Bar
function updateProgressBar(percentage) {
  progressBarFill.style.width = `${percentage}%`;
}

// Helper Function to Check Quiz Title Uniqueness
async function isQuizTitleUnique(title) {
  const quizzesRef = collection(db, "quizzes");
  const q = query(quizzesRef, where("title", "==", title));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty; // Return true if no matching documents found
}

// Submit Quiz
submitQuizBtn.addEventListener("click", async () => {
  const quizTitle = quizTitleInput.value.trim();
  const quizTimer = parseInt(quizTimerInput.value.trim(), 10);

  if (!quizTitle || isNaN(quizTimer) || quizTimer <= 0) {
    alert("Please provide a valid quiz title and timer.");
    return;
  }

  const isUnique = await isQuizTitleUnique(quizTitle);
  if (!isUnique) {
    alert("Quiz title already exists. Please choose a different title.");
    return;
  }

  try {
    const allQuestions = {
      physics: extractQuestions(physicsQuestions),
      chemistry: extractQuestions(chemistryQuestions),
      mathematics: extractQuestions(mathQuestions),
    };

    await addDoc(collection(db, "quizzes"), {
      title: quizTitle,
      timer: quizTimer,
      questions: allQuestions,
      timestamp: serverTimestamp(),
    });

    alert("Quiz created successfully!");
    window.location.href = "register.html";
  } catch (error) {
    console.error("Error submitting quiz:", error);
    alert(`Failed to create quiz: ${error.message}`);
  }
});

// Function to Extract Questions
function extractQuestions(questionsArray) {
  return questionsArray.map((form) => {
    const questionText = form.querySelector(".question-text").value.trim();
    const options = form.querySelector(".question-options").value.split(",").map((opt) => opt.trim());
    const correctAnswer = form.querySelector(".question-correct-answer").value.trim();
    const positiveMarks = parseFloat(form.querySelector(".positive-marks").value.trim());
    const negativeMarks = parseFloat(form.querySelector(".negative-marks").value.trim());

    if (
      !questionText ||
      options.length < 2 ||
      !correctAnswer ||
      isNaN(positiveMarks) ||
      isNaN(negativeMarks)
    ) {
      alert("Please fill out all fields correctly.");
      throw new Error("Incomplete question fields.");
    }

    return { questionText, options, correctAnswer, positiveMarks, negativeMarks };
  });
}
