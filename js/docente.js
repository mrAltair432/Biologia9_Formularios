(function () {
  const $ = (id) => document.getElementById(id);
  const cfg = window.APP_CONFIG;
  const LET = ["A", "B", "C", "D"];
  let all = [], sortKey = "submittedAt", sortDir = -1;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const examName = (id) => (window.EXAMS[id] ? window.EXAMS[id].title : id);

  async function load() {
    $("loginErr").textContent = "";
    if (!cfg.SCRIPT_URL) { $("loginErr").textContent = "Falta configurar SCRIPT_URL en js/config.js (ver README)."; return; }
    $("loadBtn").disabled = true;
    try {
      const r = await fetch(cfg.SCRIPT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "list", password: $("pw").value }) });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error === "unauthorized" ? "Clave incorrecta." : "Error del servidor.");
      start(d.rows);
    } catch (e) { $("loginErr").textContent = e.message || "No se pudo conectar."; }
    $("loadBtn").disabled = false;
  }

  function start(rows) {
    all = rows.map((r) => ({ ...r, grade: Number(r.grade), correct: Number(r.correct), total: Number(r.total), seconds: Number(r.seconds) }));
    const courses = [...new Set(all.map((r) => String(r.course)))].sort();
    $("fCourse").innerHTML = '<option value="">Todos</option>' + courses.map((c) => "<option>" + esc(c) + "</option>").join("");
    $("login").classList.add("hidden"); $("panel").classList.remove("hidden");
    render();
  }

  const filtered = () => {
    const e = $("fExam").value, c = $("fCourse").value, t = $("fText").value.trim().toLowerCase();
    return all.filter((r) => (!e || r.exam === e) && (!c || String(r.course) === c) && (!t || (r.name + " " + r.email).toLowerCase().includes(t)));
  };

  function render() {
    const rows = filtered().sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1) * sortDir);
    const avg = rows.length ? rows.reduce((s, r) => s + r.grade, 0) / rows.length : 0;
    const pass = rows.filter((r) => r.grade >= 3).length;
    $("stats").innerHTML =
      [["Envíos", rows.length], ["Promedio", avg.toFixed(2)], ["Aprueban (≥3.0)", rows.length ? Math.round((pass / rows.length) * 100) + "%" : "–"], ["Nota máxima", rows.length ? Math.max(...rows.map((r) => r.grade)).toFixed(1) : "–"]]
        .map((s) => "<div class='stat'><b>" + s[1] + "</b><span>" + s[0] + "</span></div>").join("");

    const cols = [["submittedAt", "Fecha"], ["id", "ID"], ["exam", "Actividad"], ["name", "Nombre"], ["email", "Correo"], ["course", "Curso"], ["grade", "Nota"], ["correct", "Aciertos"], ["seconds", "Tiempo"]];
    $("tbl").innerHTML = "<thead><tr>" + cols.map((c) => "<th data-k='" + c[0] + "'>" + c[1] + (sortKey === c[0] ? (sortDir > 0 ? " ▲" : " ▼") : "") + "</th>").join("") + "</tr></thead><tbody>" +
      rows.map((r) => {
        const cls = r.grade >= 4 ? "hi" : r.grade >= 3 ? "mid" : "lo";
        return "<tr><td>" + esc(new Date(r.submittedAt).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" })) + "</td><td>" + esc(r.id) + "</td><td>" + esc(examName(r.exam)) + "</td><td>" + esc(r.name) + "</td><td>" + esc(r.email) + "</td><td>" + esc(r.course) + "</td><td><span class='pill " + cls + "'>" + r.grade.toFixed(1) + "</span></td><td>" + r.correct + "/" + r.total + "</td><td>" + Math.floor(r.seconds / 60) + "m " + (r.seconds % 60) + "s</td></tr>";
      }).join("") + "</tbody>";
    $("tbl").querySelectorAll("th").forEach((th) => th.addEventListener("click", () => { const k = th.dataset.k; sortDir = sortKey === k ? -sortDir : 1; sortKey = k; render(); }));

    // Análisis por pregunta (por actividad)
    let html = "";
    Object.values(window.EXAMS).forEach((ex) => {
      const sub = rows.filter((r) => r.exam === ex.id && r.answers);
      if (!sub.length) return;
      html += "<h3>" + esc(ex.title) + " · " + sub.length + " envíos</h3>";
      let n = 0;
      ex.sections.forEach((s) => s.questions.forEach((q) => {
        const i = n++;
        const ok = sub.filter((r) => r.answers[i] === LET[q.a]).length, pct = Math.round((ok / sub.length) * 100);
        const color = pct >= 70 ? "#14a36b" : pct >= 40 ? "#e0a21b" : "#e04a5a";
        html += "<div class='ia-bar' style='margin:6px 0'><span style='width:150px;font-size:.85rem'>P" + (i + 1) + " · " + esc(s.short) + "</span><span class='b'><i style='width:" + pct + "%;background:" + color + "'></i></span><b style='width:44px;text-align:right'>" + pct + "%</b></div>";
      }));
    });
    $("items").innerHTML = html || "<p class='sub'>Aún no hay datos.</p>";
  }

  function csv() {
    const rows = filtered();
    const head = ["Fecha", "ID", "Actividad", "Nombre", "Correo", "Curso", "Autoevaluación", "Correctas", "Total", "Nota", "Secciones", "Respuestas", "Segundos"];
    const cell = (v) => { let s = String(v == null ? "" : v); if (/^[=+\-@]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
    const lines = [head.map(cell).join(",")].concat(rows.map((r) => [r.submittedAt, r.id, examName(r.exam), r.name, r.email, r.course, r.selfEval, r.correct, r.total, r.grade, r.sections, r.answers, r.seconds].map(cell).join(",")));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" }));
    a.download = "resultados_biologia9.csv"; a.click();
  }

  $("loadBtn").addEventListener("click", load);
  $("pw").addEventListener("keydown", (e) => { if (e.key === "Enter") load(); });
  $("localBtn").addEventListener("click", () => { try { start(JSON.parse(localStorage.getItem("bio9:local") || "[]")); } catch (e) { start([]); } });
  ["fExam", "fCourse", "fText"].forEach((id) => $(id).addEventListener("input", render));
  $("csvBtn").addEventListener("click", csv);
})();
