const question=document.getElementById("question");
const choices=Array.from(document.getElementsByClassName("choice-text"));

let currentQuestion={};
let acceptingAnswers=false;
let score=0;
let questionCounter=0;
let availableQuestions=[];
let questions=[
    {
        question: "what is the unit of electric field?",
        choice1: "volt",
        choice2: "newton per coulomb",
        choice3: "ampere",
        choice4: "coulomb per meter",
        answer: 2
    },
    {
        question: "which element has highest electronegativity?",
        choice1: "Fluroine",
        choice2: "Oxygen",
        choice3: "Chlorine",
        choice4: "Nitrogen",
        answer: 2
    },
    {
        question: "which of the following doesn't require a medium of propagation?",
        choice1: "sound waves",
        choice2: "water waves",
        choice3: "light waves",
        choice4: "seismic waves",
        answer: 3
    }

];
//constants
const CORRECT_BONUS=10;
const MAX_QUESTIONS=3;
startGame=() => {
    questionCounter=0;
    score=0;
    availableQuestions=[...questions];
    
    getNewQuestion();
};
getNewQuestion=()=>{
    if(availableQuestions.length ===0 || questionCounter>=MAX_QUESTIONS){
        //go to end page
        return window.location.assign('/end.html');
    }
    questionCounter++;
    const questionIndex=Math.floor(Math.random()* availableQuestions.length);
    currentQuestion=availableQuestions[questionIndex];
    question.innerText=currentQuestion.question;

    choices.forEach(choice => {
        const number=choice.dataset["number"];
        choice.innerText = currentQuestion["choice"+number];
    });
    availableQuestions.splice(questionIndex,1);
    acceptingAnswers=true;
};
choices.forEach(choice=>{
    choice.addEventListener("click",e=>{
        if(!acceptingAnswers) return;
        acceptingAnswers=false;
        const selectedChoice=e.target;
        const selectedAnswer=selectedChoice.dataset['number'];

        const classToApply='ncorrect';
        if(selectedAnswer==currentQuestion.answer){
            classToApply='correct';
        }

        
        getNewQuestion();
    });
});
startGame();