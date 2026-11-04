(function () {
  const cfg = window.APP_CONFIG;
  const params = new URLSearchParams(location.search);
  const exam = window.EXAMS[params.get("e")] || window.EXAMS.taller;
  const LET = ["A", "B", "C", "D"];
  const KEY = "bio9:" + exam.id;
  const $ = (id) => document.getElementById(id);

  // Lista plana de preguntas con numeración continua y sección
  const flat = [];
  exam.sections.forEach((s, si) => s.questions.forEach((q) => flat.push({ ...q, si, n: flat.length + 1 })));

  let state = { name: "", email: "", course: "", self: {}, answers: {}, start: Date.now() };
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  const save = () => localStorage.setItem(KEY, JSON.stringify(state));

  document.title = exam.title + " · Biología 9";
  $("title").textContent = exam.title;
  $("subtitle").textContent = exam.subtitle + " · " + flat.length + " preguntas" + (exam.selfCriteria ? " + autoevaluación" : "");
  const crit = exam.selfCriteria || [];

  // Render
  const qWrap = $("questions");
  let lastSec = -1;
  flat.forEach((q) => {
    if (q.si !== lastSec) {
      lastSec = q.si;
      const h = document.createElement("div");
      h.className = "sec-title";
      h.textContent = exam.sections[q.si].name;
      qWrap.appendChild(h);
    }
    const c = document.createElement("section");
    c.className = "card q";
    c.id = "q" + q.n;
    c.innerHTML =
      '<div class="qt"><span class="num">' + q.n + "</span><span>" + q.q + "</span></div>" +
      (q.img ? '<figure><img src="' + q.img + '" alt="' + (q.alt || "Figura de la pregunta") + '"></figure>' : "") +
      '<div class="opts">' +
      q.o.map((t, i) =>
        '<label class="opt"><input type="radio" name="q' + q.n + '" value="' + i + '"><span class="l">' + LET[i] + "</span><span>" + t + "</span></label>"
      ).join("") + "</div>";
    qWrap.appendChild(c);
  });

  function paintSelections() {
    flat.forEach((q) => {
      const card = $("q" + q.n);
      card.querySelectorAll(".opt").forEach((o, i) => {
        const on = state.answers[q.n] === i;
        o.classList.toggle("sel", on);
        o.querySelector("input").checked = on;
      });
    });
    const done = Object.keys(state.answers).length;
    $("progTxt").textContent = done + " / " + flat.length;
    $("progBar").style.width = (done / flat.length) * 100 + "%";
  }

  qWrap.addEventListener("change", (e) => {
    const m = /^q(\d+)$/.exec(e.target.name || "");
    if (!m) return;
    state.answers[+m[1]] = +e.target.value;
    $("q" + m[1]).classList.remove("missing");
    save(); paintSelections();
  });

  if (crit.length) {
    $("selfPart").innerHTML =
      '<div class="sec-title">Autoevaluación</div>' +
      '<section class="card" id="selfCard"><p class="sub">Valora tu desempeño en clase de <b>1</b> (muy bajo) a <b>5</b> (excelente). Tu nota será el promedio de los 8 criterios.</p>' +
      '<figure class="rubric"><img src="assets/rubrica-autoevaluacion.png" alt="Rúbrica de criterios de aprendizaje en el aula"></figure>' +
      crit.map((c, i) =>
        '<div class="crit" id="s' + (i + 1) + '"><div class="ct"><span class="num sm">' + (i + 1) + "</span><span><b>" + c.short + ":</b> " + c.t + '</span></div><div class="rate">' +
        [1, 2, 3, 4, 5].map((v) => '<label class="rb"><input type="radio" name="s' + (i + 1) + '" value="' + v + '"><span>' + v + "</span></label>").join("") +
        "</div></div>").join("") +
      '<div class="selfavg">Tu autoevaluación: <b id="selfAvg">–</b> / 5.0</div></section>';
  }
  const selfAvg = () => {
    const v = crit.map((c, i) => state.self[i + 1]);
    return v.every((x) => x) ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null;
  };
  function paintSelf() {
    crit.forEach((c, i) => document.querySelectorAll('#s' + (i + 1) + " .rb").forEach((l, k) => l.classList.toggle("sel", state.self[i + 1] === k + 1)));
    const a = selfAvg();
    if ($("selfAvg")) $("selfAvg").textContent = a === null ? "–" : a.toFixed(1);
  }
  $("selfPart").addEventListener("change", (e) => {
    const m = /^s(\d+)$/.exec(e.target.name || "");
    if (!m) return;
    state.self[+m[1]] = +e.target.value;
    $("s" + m[1]).classList.remove("missing");
    save(); paintSelf();
  });

  ["name", "email", "course"].forEach((id) => {
    $(id).value = state[id] || "";
    $(id).addEventListener("input", () => { state[id] = $(id).value; $(id).classList.remove("invalid"); save(); });
  });
  paintSelections(); paintSelf();

  // Barra de progreso fija y cronómetro: solo después de registrar los datos
  const prog = $("progress");
  let timerId = null;
  const tick = () => {
    const s = Math.floor((Date.now() - state.start) / 1000);
    $("timer").textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  };
  function enterQuiz() {
    $("idCard").classList.add("hidden");
    $("who").innerHTML = "<strong>" + esc(state.name) + "</strong> · Curso " + esc(state.course) + " · " + esc(state.email);
    $("quizPart").classList.remove("hidden");
    prog.classList.remove("hidden");
    tick(); timerId = setInterval(tick, 1000);
    window.scrollTo({ top: 0 });
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function validateId() {
    let first = null, ok = true;
    const bad = (el) => { el.classList.add("invalid"); ok = false; first = first || el; };
    if (state.name.trim().split(/\s+/).filter(Boolean).length < 2) bad($("name"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) bad($("email"));
    if (!state.course.trim()) bad($("course"));
    $("idCard").classList.toggle("show-err", !ok);
    if (first) first.focus();
    return ok;
  }

  $("startBtn").addEventListener("click", () => {
    if (!validateId()) return;
    state.started = true; state.start = Date.now(); save();
    enterQuiz();
  });
  if (state.started) enterQuiz();

  // Evaluación
  function grade() {
    const secs = exam.sections.map((s) => ({ name: s.name, short: s.short, correct: 0, total: 0 }));
    let correct = 0;
    flat.forEach((q) => {
      secs[q.si].total++;
      if (state.answers[q.n] === q.a) { secs[q.si].correct++; correct++; }
    });
    return { correct, total: flat.length, grade: Math.round((correct / flat.length) * 50) / 10, secs };
  }

  function makeId() {
    const r = Math.random().toString(36).slice(2, 6).toUpperCase();
    return (exam.id === "quiz" ? "QZ" : "TR") + "-" + Date.now().toString(36).toUpperCase().slice(-5) + r;
  }

  function validate() {
    const missing = flat.filter((q) => state.answers[q.n] === undefined);
    flat.forEach((q) => $("q" + q.n).classList.toggle("missing", state.answers[q.n] === undefined));
    const missSelf = crit.map((c, i) => i + 1).filter((n) => !state.self[n]);
    crit.forEach((c, i) => $("s" + (i + 1)).classList.toggle("missing", !state.self[i + 1]));
    const parts = [];
    if (missing.length) parts.push(missing.length + (missing.length === 1 ? " pregunta" : " preguntas"));
    if (missSelf.length) parts.push(missSelf.length + (missSelf.length === 1 ? " criterio de la autoevaluación" : " criterios de la autoevaluación"));
    $("missingNote").textContent = parts.length ? "Te falta responder " + parts.join(" y ") + "." : "";
    const firstMiss = missing.length ? $("q" + missing[0].n) : missSelf.length ? $("s" + missSelf[0]) : null;
    if (firstMiss) firstMiss.scrollIntoView({ behavior: "smooth", block: "center" });
    return !firstMiss;
  }

  // Envío a Google Sheets (Apps Script). Si falla, queda en cola y se reintenta.
  const QUEUE = "bio9:queue";
  const queue = () => { try { return JSON.parse(localStorage.getItem(QUEUE) || "[]"); } catch (e) { return []; } };
  async function send(rec) {
    if (!cfg.SCRIPT_URL) return "local";
    try {
      await fetch(cfg.SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(rec) });
      return "ok";
    } catch (e) { return "fail"; }
  }
  async function flushQueue() {
    const q = queue(), rest = [];
    for (const r of q) { if ((await send(r)) === "fail") rest.push(r); }
    localStorage.setItem(QUEUE, JSON.stringify(rest));
  }
  flushQueue();

  $("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const btn = $("submitBtn");
    btn.disabled = true; btn.textContent = "Enviando…";
    clearInterval(timerId);
    const g = grade();
    const startedAt = new Date(state.start).toISOString();
    const rec = {
      id: makeId(), exam: exam.id, examTitle: exam.title,
      name: state.name.trim().replace(/\s+/g, " "), email: state.email.trim().toLowerCase(), course: state.course.trim(),
      selfEval: crit.length ? selfAvg() : "",
      selfItems: crit.length ? crit.map((c, i) => state.self[i + 1]).join(",") : "",
      correct: g.correct, total: g.total, grade: g.grade,
      sections: g.secs.map((s) => s.short + ":" + s.correct + "/" + s.total).join(" | "),
      answers: flat.map((q) => LET[state.answers[q.n]]).join(""),
      seconds: Math.floor((Date.now() - state.start) / 1000),
      startedAt, submittedAt: new Date().toISOString()
    };
    let pdf = "";
    try { pdf = (await window.makeTicket(rec, g, exam, true)).split(",")[1]; } catch (err) {}
    const status = await send(Object.assign({}, rec, { pdfBase64: pdf }));
    if (status === "fail") localStorage.setItem(QUEUE, JSON.stringify(queue().concat(rec)));
    if (status === "local") localStorage.setItem("bio9:local", JSON.stringify(JSON.parse(localStorage.getItem("bio9:local") || "[]").concat(rec)));
    localStorage.removeItem(KEY);
    showResult(rec, g, status);
  });

  function showResult(rec, g, status) {
    $("form").classList.add("hidden");
    $("progress").classList.add("hidden");
    const r = $("result");
    const msgs = { ok: ["ok", "✔ Tus respuestas fueron enviadas a tu docente."], local: ["warn", "Modo de prueba: las respuestas solo se guardaron en este dispositivo."], fail: ["warn", "No hubo conexión. Tu envío quedó guardado y se reintentará al abrir esta página con internet. Descarga tu ticket igualmente."] };
    r.innerHTML =
      "<h2>¡Listo, " + rec.name.split(" ")[0] + "!</h2>" +
      '<div class="grade" style="--pct:' + (rec.grade / 5) * 100 + '%"><b>' + rec.grade.toFixed(1) + "</b><small>de 5.0</small></div>" +
      "<p><strong>" + g.correct + " de " + g.total + "</strong> respuestas correctas</p>" +
      (rec.selfEval !== "" ? "<p>Autoevaluación: <strong>" + Number(rec.selfEval).toFixed(1) + " / 5.0</strong></p>" : "") +
      '<p><span class="ticket-id">' + rec.id + "</span></p>" +
      '<div class="status ' + msgs[status][0] + '">' + msgs[status][1] + "</div>" +
      '<div class="breakdown">' + g.secs.map((s) =>
        "<div><span>" + s.short + '</span><span class="b"><i style="width:' + (s.correct / s.total) * 100 + '%"></i></span><b>' + s.correct + "/" + s.total + "</b></div>").join("") + "</div>" +
      '<div class="actions"><button class="btn gold" id="dl">⬇ Descargar ticket PDF</button><a class="btn ghost" href="index.html">Volver al inicio</a></div>' +
      '<p class="note">Envía el PDF a tu docente como evidencia de tu entrega.</p>';
    r.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    const download = () => window.makeTicket(rec, g, exam);
    $("dl").addEventListener("click", download);
    download();
  }
})();
