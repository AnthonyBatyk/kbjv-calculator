let total = {
  kcal: 0,
  protein: 0,
  fat: 0,
  carb: 0
};

const log = [];

function parseLine(line) {
  const kcal = line.match(/(\d+)\s*ккал/);
  const protein = line.match(/([\d.]+)\s*біл/);
  const fat = line.match(/([\d.]+)\s*жир/);
  const carb = line.match(/([\d.]+)\s*вугл/);

  return {
    kcal: kcal ? +kcal[1] : 0,
    protein: protein ? +protein[1] : 0,
    fat: fat ? +fat[1] : 0,
    carb: carb ? +carb[1] : 0
  };
}

function render() {
  document.getElementById("kcal").textContent = total.kcal.toFixed(0);
  document.getElementById("protein").textContent = total.protein.toFixed(1);
  document.getElementById("fat").textContent = total.fat.toFixed(1);
  document.getElementById("carb").textContent = total.carb.toFixed(1);

  document.getElementById("log").innerHTML = log.map((item, index) => `
    <div class="log-item">
      <span>${item.text}</span>
      <button data-index="${index}" class="remove">Відняти</button>
    </div>
  `).join("");
}

/* ДОДАВАННЯ */
document.getElementById("add").onclick = () => {
  const text = document.getElementById("input").value.trim();
  if (!text) return;

  const lines = text.split("\n");

  lines.forEach(line => {
    const p = parseLine(line);

    total.kcal += p.kcal;
    total.protein += p.protein;
    total.fat += p.fat;
    total.carb += p.carb;

    log.push({
      text: line,
      kcal: p.kcal,
      protein: p.protein,
      fat: p.fat,
      carb: p.carb
    });
  });

  document.getElementById("input").value = "";
  render();
};

/* ВІДНЯТТЯ (лог + сума) */
document.getElementById("log").addEventListener("click", (e) => {
  const btn = e.target.closest(".remove");
  if (!btn) return;

  const index = +btn.dataset.index;
  const item = log[index];

  total.kcal -= item.kcal;
  total.protein -= item.protein;
  total.fat -= item.fat;
  total.carb -= item.carb;

  log.splice(index, 1);

  render();
});

/* RESET */
document.getElementById("reset").onclick = () => {
  total = { kcal: 0, protein: 0, fat: 0, carb: 0 };
  log.length = 0;
  render();
};

render();
