// Danh sách con vật + hình ảnh (từ thư mục images)
const animals = [
  { name: "snake", image: "image/snake.png", pronunciation: "snake" },
  { name: "monkey", image: "image/monkey.png", pronunciation: "monkey" },
  { name: "horse", image: "image/horse.png", pronunciation: "horse" },
  { name: "camel", image: "image/camel.png", pronunciation: "camel" },
  { name: "hippo", image: "image/hippo.png", pronunciation: "hippo" },
  { name: "rhino", image: "image/rhino.png", pronunciation: "rhinos" }
];

let index = 0;
let score = 0;

// --- Lấy các phần tử HTML ---
const animalImg = document.getElementById("animalImage");
const animalName = document.getElementById("animalName");
const soundBtn = document.getElementById("soundBtn");
const nextBtn = document.getElementById("nextBtn");
const scoreText = document.getElementById("score");
const testBtn = document.getElementById("testBtn");

const lessonDiv = document.getElementById("lesson");
const quizDiv = document.getElementById("quiz");
const quizQuestion = document.getElementById("quizQuestion");
const answerInput = document.getElementById("answerInput");
const checkBtn = document.getElementById("checkBtn");
const feedback = document.getElementById("feedback");
const quizScore = document.getElementById("quizScore");
const backBtn = document.getElementById("backBtn");

// --- Âm thanh phản hồi ---
const correctSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_676f3a5b96.mp3?filename=correct-2-46134.mp3");
const clapSound = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_1f6e4640c1.mp3?filename=small-applause-6695.mp3");
const wrongSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_b8e1e2b9b1.mp3?filename=wrong-buzzer-45835.mp3");

// Helper: phát âm từ bằng Web Speech API
function speakText(text, lang = "en-US") {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }
}

// Hiển thị con vật hiện tại
function showAnimal() {
  const animal = animals[index];
  animalImg.src = animal.image;
  animalImg.alt = animal.name;
  animalName.textContent = animal.name;
  playSound(true);
}

// Phát âm (auto = true: tự phát khi đổi hình, không tăng điểm)
function playSound(auto = false) {
  const animal = animals[index];
  speakText(animal.pronunciation);
  if (!auto) {
    score++;
    scoreText.textContent = "Score: " + score;
  }

  // Hiệu ứng rung ảnh
  animalImg.classList.add("shake");
  setTimeout(() => animalImg.classList.remove("shake"), 600);
}

// Nút kế tiếp
function nextAnimal() {
  index = (index + 1) % animals.length;
  showAnimal();
}

// Gán sự kiện nút
soundBtn.addEventListener("click", () => playSound(false));
nextBtn.addEventListener("click", nextAnimal);

// --- Phần Quiz ---
let quizIndex = 0;
let quizPoints = 0;

function startQuiz() {
  lessonDiv.style.display = "none";
  quizDiv.style.display = "block";
  quizIndex = 0;
  quizPoints = 0;
  quizScore.textContent = "Quiz Score: 0";
  answerInput.style.display = "inline";
  checkBtn.style.display = "inline";
  showQuizQuestion();
}

function showQuizQuestion() {
  if (quizIndex < animals.length) {
    const word = animals[quizIndex].name;
    // Tạo mẫu trống: sn_ke, ho_se, ca_el...
    let missing = word.replace(/[aeiou]/g, "_");
    quizQuestion.textContent = `Complete the word: ${missing}`;
    answerInput.value = "";
    feedback.textContent = "";
  } else {
    quizQuestion.textContent = `🎉 You finished! Final score: ${quizPoints}/${animals.length}`;
    answerInput.style.display = "none";
    checkBtn.style.display = "none";
  }
}

function checkAnswer() {
  const correct = animals[quizIndex].name.toLowerCase();
  const userAns = answerInput.value.toLowerCase().trim();
  
  if (userAns === correct) {
    feedback.textContent = "✅ Excellent! Great job!";
    correctSound.play();  // âm thanh đúng
    setTimeout(() => clapSound.play(), 700); // âm thanh vỗ tay sau 0.7s
    quizPoints++;
    quizScore.textContent = "Quiz Score: " + quizPoints;
    speakText(animals[quizIndex].pronunciation);
  } else {
    feedback.textContent = `❌ Oops! Try again! The correct word is "${correct}".`;
    wrongSound.play(); // âm thanh sai
    speakText(animals[quizIndex].pronunciation);
  }

  quizIndex++;
  setTimeout(showQuizQuestion, 2500);
}

checkBtn.addEventListener("click", checkAnswer);
testBtn.addEventListener("click", startQuiz);
backBtn.addEventListener("click", () => {
  lessonDiv.style.display = "block";
  quizDiv.style.display = "none";
});

// Bắt đầu
showAnimal();
