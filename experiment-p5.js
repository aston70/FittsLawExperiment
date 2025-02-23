const TOTAL_TRIALS = 10;
const EDGE_MARGIN = 20;
const TARGET_SIZES = [20, 40, 80, 160];
const TARGET_DISTANCES = [100, 200, 300];

let clickable, targetSize, targetPos, startPos, initialTime;
const clicksData = [];
let currentIndex = 0;
let experimentDone = false;
let endUIShown = false;
let downloadJSONButton, restartExperimentButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(18);
  const canvasElement = document.getElementById('defaultCanvas0');
  if (canvasElement) canvasElement.style.zIndex = '0';
  resetAll();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function resetAll() {
  clicksData.length = 0;
  currentIndex = 0;
  experimentDone = false;
  endUIShown = false;
  removeEndUI();
  if (clickable) clickable.remove();
  nextButton();
}

function nextButton() {
  if (experimentDone) return;
  if (currentIndex >= TOTAL_TRIALS) {
    experimentDone = true;
    if (clickable) clickable.remove();
    return;
  }

  targetSize = random(TARGET_SIZES);
  const distance = random(TARGET_DISTANCES);

  const angle = random(TWO_PI);
  const xOffset = cos(angle) * distance;
  const yOffset = sin(angle) * distance;

  targetPos = createVector(width / 2 + xOffset, height / 2 + yOffset);
  targetPos.x = constrain(targetPos.x, EDGE_MARGIN, width - EDGE_MARGIN);
  targetPos.y = constrain(targetPos.y, EDGE_MARGIN, height - EDGE_MARGIN);

  if (clickable) clickable.remove();

  clickable = createButton("Click Me");
  clickable.style("position", "absolute");
  clickable.style("z-index", "9999");
  clickable.style("font-size", `${max(14, targetSize / 4)}px`);
  clickable.position(floor(targetPos.x - targetSize / 2), floor(targetPos.y - targetSize / 2));
  clickable.size(targetSize, targetSize);
  clickable.mousePressed(handleButtonClick);

  startPos = createVector(mouseX, mouseY);
  initialTime = millis();
}

function handleButtonClick() {
  if (experimentDone) return;
  const timeElapsed = millis() - initialTime;
  const cursorDistance = dist(startPos.x, startPos.y, targetPos.x, targetPos.y);

  if (timeElapsed > 100 && timeElapsed < 5000) {
    clicksData.push({
      iteration: currentIndex + 1,
      targetSize,
      cursorDistance,
      timeTaken: timeElapsed
    });
  }

  currentIndex++;
  if (currentIndex < TOTAL_TRIALS) {
    nextButton();
  } else {
    experimentDone = true;
    if (clickable) clickable.remove();
  }
}

function draw() {
  background(230);
  fill(0);
  textSize(20);

  if (experimentDone) {
    text("Experiment Complete!", width / 2, height / 2 - 30);
    text("Use the buttons below to Download JSON or Restart.", width / 2, height / 2);
    if (!endUIShown) createEndUI();
  } else {
    text(`Trial ${currentIndex + 1} / ${TOTAL_TRIALS}`, width / 2, 50);
  }
}

function createEndUI() {
  endUIShown = true;

  downloadJSONButton = createButton("Download JSON");
  downloadJSONButton.style("position", "absolute");
  downloadJSONButton.style("z-index", "9999");
  downloadJSONButton.position(width / 2 - 60, height / 2 + 30);
  downloadJSONButton.mousePressed(exportJSON);

  restartExperimentButton = createButton("Restart");
  restartExperimentButton.style("position", "absolute");
  restartExperimentButton.style("z-index", "9999");
  restartExperimentButton.position(width / 2 - 30, height / 2 + 70);
  restartExperimentButton.mousePressed(() => {
    removeEndUI();
    resetAll();
  });
}

function removeEndUI() {
  if (downloadJSONButton) downloadJSONButton.remove();
  if (restartExperimentButton) restartExperimentButton.remove();
  endUIShown = false;
}

function exportJSON() {
  const jsonData = JSON.stringify(clicksData, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const linkURL = URL.createObjectURL(blob);
  const linkElement = document.createElement('a');
  linkElement.href = linkURL;
  linkElement.download = "FittsData.json";
  linkElement.click();
  URL.revokeObjectURL(linkURL);
}
