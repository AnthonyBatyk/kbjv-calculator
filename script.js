let total = {
  kcal: 0,
  protein: 0,
  fat: 0,
  carb: 0
};

const log = [];

/* ================= STORAGE ================= */

function saveData() {
  localStorage.setItem("kbjv-total", JSON.stringify(total));
  localStorage.setItem("kbjv-log", JSON.stringify(log));
}

function loadData() {
  try {
    const savedTotal = localStorage.getItem("kbjv-total");
    const savedLog = localStorage.getItem("kbjv-log");

    if (savedTotal) {
      const parsedTotal = JSON.parse(savedTotal);

      total.kcal = parsedTotal.kcal || 0;
      total.protein = parsedTotal.protein || 0;
      total.fat = parsedTotal.fat || 0;
      total.carb = parsedTotal.carb || 0;
    }

    if (savedLog) {
      const parsedLog = JSON.parse(savedLog);

      log.length = 0;
      log.push(...parsedLog);
    }
  } catch (e) {
    console.error("Storage error:", e);
    localStorage.clear();
  }
}

/* ================= PARSER ================= */

function parseLine(line) {
  const kcal = line.match(/(\d+(?:\.\d+)?)\s*ккал/);
  const protein = line.match(/(\d+(?:\.\d+)?)\s*біл/);
  const fat = line.match(/(\d+(?:\.\d+)?)\s*жир/);
  const carb = line.match(/(\d+(?:\.\d+)?)\s*вугл/);

  return {
    kcal: kcal ? Number(kcal[1]) : 0,
    protein: protein ? Number(protein[1]) : 0,
    fat: fat ? Number(fat[1]) : 0,
    carb: carb ? Number(carb[1]) : 0
  };
}

/* ================= RENDER ================= */

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

/* ================= ADD ================= */

document.getElementById("add").onclick = () => {
  const btn = document.getElementById("add");
  const text = document.getElementById("input").value.trim();

  if (!text) return;

  const lines = text.split("\n");

  for (const line of lines) {
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
  }

  document.getElementById("input").value = "";

  render();
  saveData();

  const original = btn.textContent;
  btn.textContent = "Додано ✓";
  btn.classList.add("success");

  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove("success");
  }, 1200);
};

/* ================= REMOVE ================= */

document.getElementById("log").addEventListener("click", (e) => {
  const btn = e.target.closest(".remove");
  if (!btn) return;

  const index = Number(btn.dataset.index);
  const item = log[index];

  total.kcal -= item.kcal;
  total.protein -= item.protein;
  total.fat -= item.fat;
  total.carb -= item.carb;

  log.splice(index, 1);

  render();
  saveData();
});

/* ================= RESET ================= */

document.getElementById("reset").onclick = () => {
  const btn = document.getElementById("reset");

  total = { kcal: 0, protein: 0, fat: 0, carb: 0 };
  log.length = 0;

  render();
  saveData();

  const original = btn.textContent;
  btn.textContent = "Очищено ✕";
  btn.classList.add("error");

  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove("error");
  }, 1200);
};

/* ================= COPY ================= */

document.getElementById("copy-total").onclick = () => {
  const btn = document.getElementById("copy-total");

  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const text =
    `Денний підсумок за ${day}.${month}.${year} - ` +
    `${total.kcal.toFixed(0)} ккал / ` +
    `${total.protein.toFixed(1)} білка / ` +
    `${total.fat.toFixed(1)} жирів / ` +
    `${total.carb.toFixed(1)} вуглеводів`;

  navigator.clipboard.writeText(text);

  const original = btn.textContent;
  btn.textContent = "Скопійовано ✓";
  btn.classList.add("success");

  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove("success");
  }, 1200);
};

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  render();
});
