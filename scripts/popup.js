const runBtn = document.getElementById("run-btn");
const studentCount = document.getElementById("student-count-input");
const absenteesBox = document.getElementById("absentees-container");

window.addEventListener("click", (e) => e.preventDefault());

window.addEventListener("keydown", (e) => {
  e.key === "Enter" && document.activeElement == runBtn && runBtn.click();
});

const execute = async (_evt) => {
  const names = getAbsenteeValues();
  console.log(getInputMaps(names));
  const numStudents = studentCount.value;
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: takeAttendance,
    args: [numStudents]
  });
  await chrome.runtime.sendMessage("cleanup");
  // window.close();
};

runBtn.addEventListener("click", execute);

const takeAttendance = async (numStudents) => {
  await chrome.runtime.sendMessage("init");
  let i = 0;
  while (i < numStudents) {
    await chrome.runtime.sendMessage("cycle");
    i++;
  }
};

const getAbsenteeValues = () => {
  const absenteeInputs = document.querySelectorAll(".absentee-input");
  let names = [];
  for (let i = 0; i < absenteeInputs.length; i++) {
    names.push(absenteeInputs[i].value);
  }
  return names;
};

const makeElements = () => {
  const box = document.createElement("div");
  const input = document.createElement("input");
  const btn = document.createElement("button");
  box.classList.add("absentee-input-pair");
  input.classList.add("absentee-input");
  btn.classList.add("absentee-btn");
  btn.textContent = "+";
  return [box, input, btn];
};

const handleBtnClick = (btn) => (_e) => {
  const input = btn.previousSibling;
  const text = input.value;

  if (validateInput(text) !== "pass") return;

  input.classList.toggle("locked-in");
  const state = btn.textContent;

  if (state === "+") {
    input.disabled = true;
    btn.textContent = "-";

    const newSet = addInputSet();
    newSet.focus();
  } else {
    btn.removeEventListener("click", handleBtnClick);
    input.remove();
    btn.remove();
  }
};

const createInputSet = () => {
  const [box, input, btn] = makeElements();

  btn.addEventListener("click", handleBtnClick(btn));

  [input, btn].map((el) => box.appendChild(el));

  return box;
};

const addInputSet = () => {
  const inputSet = createInputSet();
  absenteesBox.prepend(inputSet);
  return inputSet.querySelector(`.absentee-input`);
};

const validateInput = (nameStr) => {
  if (typeof nameStr !== "string") return "hack";
  if (nameStr.length < 3) return "short";
  if (!nameStr.includes(" ")) return "incomplete";
  return "pass";
};

window.addEventListener("DOMContentLoaded", addInputSet);

const getCountMap = (arr) =>
  arr.reduce(
    (obj, item) => ({
      ...obj,
      [item]: obj[item] ? obj[item] + 1 : (obj[item] = 1)
    }),
    {}
  );

const getKeys = (map) => Object.keys(map);
const lettArray = (word) => word.split("");

const getInputMaps = (inputsArr) =>
  inputsArr.map((name) => getCountMap(lettArray(name)));

const compareNames = (name1, name2) => {};

const compareLetterCount = (word1, word2) => {
  const word1Map = getCountMap(lettArray(word1));
  const word2Map = getCountMap(lettArray(word2));
  return getKeys(word1Map).every(
    (letter) =>
      word1Map[letter] === word2Map[letter] &&
      getKeys(word1Map).length === getKeys(word2Map).length
  );
};
