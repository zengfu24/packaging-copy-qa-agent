const cases = {
  clear: {
    image: "assets/case-03.svg",
    alt: "清晰英文包装模拟素材",
    inputTitle: "ORBITA LABS® 模拟包装",
    badge: "4 个包装部件",
    status: "✅ 最终版",
    statusClass: "status-pass",
    headline: "全部内容已确认，可以进入设计排版",
    description: "四个包装部件均已处理，关键字段和条码完成复核。",
    copy: `【瓶身正面】\nORBITA LABS®\nBOTANICAL HAND WASH\npH 5.5 · SOAP-FREE\ne 250 mL\n\n【条码】\n6972468135799\n\n待确认内容：0 项`,
    metrics: ["0 项", "0 项", "通过"],
  },
  error: {
    image: "assets/case-02.svg",
    alt: "反光遮挡包装模拟素材",
    inputTitle: "AURELIS® 模拟包装",
    badge: "反光 · 模糊 · 遮挡",
    status: "⚠️ 处理中版",
    statusClass: "status-warn",
    headline: "清晰部分已完成，疑点未闭环",
    description: "Agent 没有补写反光成分表和被遮挡的条码末位，因此禁止最终交付。",
    copy: `【盒子正面】\nAURELIS®\nHYDRATING FACE SERUM\n2% NIACINAMIDE + B5\n\n【待确认内容】\n01 背面功效描述：强反光\n02 背面成分表：多处不可辨认\n03 条码末位：贴纸遮挡\n\n版本：不可最终交付`,
    metrics: ["3 项", "0 项", "阻断"],
  },
  filing: {
    image: "assets/case-03.svg",
    alt: "备案文案核对模拟素材",
    inputTitle: "ORBITA LABS® + 模拟备案文案",
    badge: "包装原文 + 备案版本",
    status: "✅ 核对完成",
    statusClass: "status-pass",
    headline: "发现 8 类差异，两个来源保持独立",
    description: "备案文案只用于比较，没有自动覆盖包装原文。",
    copy: `【差异清单】\n01 ORBITA LABS® / ORBITA LABS\n   → 备案缺少 ®\n02 BOTANICAL / BOTANIC\n   → 产品名称不同\n03 SOAP-FREE / SOAP FREE\n   → 连字符不同\n04 e 250 mL / 250 ml\n   → 标记及单位大小写不同\n\n共识别：8 类差异`,
    metrics: ["0 项", "0 项", "通过"],
  },
};

let selectedCase = "clear";
let runTimer = null;
const tabs = [...document.querySelectorAll(".demo-tab")];
const steps = [...document.querySelectorAll("#demoSteps li")];
const runButton = document.querySelector("#runDemo");

function resetSteps() {
  clearInterval(runTimer);
  steps.forEach((step) => {
    step.className = "";
    step.querySelector("b").textContent = "○";
  });
  document.querySelector("#demoProgressText").textContent = "等待开始";
  document.querySelector("#demoStatus").className = "status-idle";
  document.querySelector("#demoStatus").textContent = "尚未运行";
  document.querySelector("#outputSummary").innerHTML = "<strong>准备就绪</strong><p>点击“开始模拟处理”，查看这个Agent如何判断、复核和决定能否交付。</p>";
  document.querySelector("#demoCopy").textContent = "等待运行……";
  document.querySelector("#outputMetrics").innerHTML = "<span>待确认 <strong>—</strong></span><span>猜测补写 <strong>—</strong></span><span>交付门禁 <strong>—</strong></span>";
  runButton.disabled = false;
  runButton.innerHTML = "开始模拟处理 <span>→</span>";
}

function selectCase(name) {
  selectedCase = name;
  const data = cases[name];
  tabs.forEach((tab) => {
    const active = tab.dataset.case === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.querySelector("#demoImage").src = data.image;
  document.querySelector("#demoImage").alt = data.alt;
  document.querySelector("#demoInputTitle").textContent = data.inputTitle;
  document.querySelector("#demoInputBadge").textContent = data.badge;
  resetSteps();
}

function finishRun(data) {
  document.querySelector("#demoProgressText").textContent = "处理完成";
  const status = document.querySelector("#demoStatus");
  status.className = data.statusClass;
  status.textContent = data.status;
  document.querySelector("#outputSummary").innerHTML = `<strong>${data.headline}</strong><p>${data.description}</p>`;
  document.querySelector("#demoCopy").textContent = data.copy;
  document.querySelector("#outputMetrics").innerHTML = `<span>待确认 <strong>${data.metrics[0]}</strong></span><span>猜测补写 <strong>${data.metrics[1]}</strong></span><span>交付门禁 <strong>${data.metrics[2]}</strong></span>`;
  runButton.disabled = false;
  runButton.innerHTML = "重新运行 <span>↻</span>";
}

function runDemo() {
  resetSteps();
  runButton.disabled = true;
  runButton.textContent = "正在模拟处理…";
  document.querySelector("#demoStatus").className = "status-running";
  document.querySelector("#demoStatus").textContent = "运行中";
  document.querySelector("#demoProgressText").textContent = "0 / 5";
  let index = 0;
  runTimer = setInterval(() => {
    if (index > 0) {
      steps[index - 1].className = "done";
      steps[index - 1].querySelector("b").textContent = "✓";
    }
    if (index < steps.length) {
      steps[index].className = "running";
      steps[index].querySelector("b").textContent = "●";
      document.querySelector("#demoProgressText").textContent = `${index + 1} / 5`;
      index += 1;
    } else {
      clearInterval(runTimer);
      steps[steps.length - 1].className = "done";
      steps[steps.length - 1].querySelector("b").textContent = "✓";
      finishRun(cases[selectedCase]);
    }
  }, 420);
}

tabs.forEach((tab) => tab.addEventListener("click", () => selectCase(tab.dataset.case)));
runButton.addEventListener("click", runDemo);
