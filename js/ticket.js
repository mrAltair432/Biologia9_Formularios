(function () {
  const NAVY = [10, 23, 51], NAVY2 = [18, 40, 90], BLUE = [47, 107, 255], CYAN = [39, 211, 230], GOLD = [226, 179, 63], INK = [22, 33, 62], MUTED = [91, 103, 132];

  function loadLogo() {
    return new Promise((res) => {
      const img = new Image();
      img.onload = () => {
        try {
          const c = document.createElement("canvas");
          c.width = img.naturalWidth; c.height = img.naturalHeight;
          c.getContext("2d").drawImage(img, 0, 0);
          res({ data: c.toDataURL("image/png"), w: c.width, h: c.height });
        } catch (e) { res(null); }
      };
      img.onerror = () => res(null);
      img.src = "assets/logo.png";
    });
  }

  const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "");

  window.makeTicket = async function (rec, g, exam, asData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210, M = 16;
    const logo = await loadLogo();

    // Cabecera
    doc.setFillColor(...NAVY); doc.rect(0, 0, W, 62, "F");
    doc.setFillColor(...NAVY2); doc.triangle(W, 0, W, 62, W - 90, 0, "F");
    doc.setDrawColor(...CYAN); doc.setLineWidth(0.5);
    const net = [[130, 50], [152, 34], [170, 40], [190, 14], [150, 12], [175, 56]];
    for (let i = 0; i < net.length - 1; i++) doc.line(net[i][0], net[i][1], net[i + 1][0], net[i + 1][1]);
    doc.line(net[1][0], net[1][1], net[4][0], net[4][1]);
    doc.setFillColor(...GOLD); net.forEach((p, i) => doc.circle(p[0], p[1], i === 1 ? 2.2 : 1.3, "F"));
    if (logo) { const h = 16, w = (logo.w / logo.h) * h; doc.addImage(logo.data, "PNG", M, 10, w, h); }
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(22);
    doc.text("TICKET DE EVALUACIÓN", M, 42);
    doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(201, 214, 245);
    doc.text(exam.title + "  ·  Biología grado noveno", M, 50);
    doc.setFillColor(...GOLD); doc.rect(0, 62, W, 2.2, "F");

    // Datos del estudiante
    let y = 80;
    const row = (label, value) => {
      doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(...MUTED); doc.text(label.toUpperCase(), M, y);
      doc.setFont("helvetica", "normal"); doc.setFontSize(13); doc.setTextColor(...INK); doc.text(String(value), M, y + 6);
      y += 16;
    };
    row("Estudiante", rec.name); row("Correo", rec.email); row("Curso", rec.course);
    const d = new Date(rec.submittedAt);
    row("Fecha y hora", d.toLocaleString("es-CO", { dateStyle: "long", timeStyle: "short" }));
    const mm = Math.floor(rec.seconds / 60), ss = rec.seconds % 60;
    row("Tiempo empleado", mm + " min " + ss + " s");
    if (rec.selfEval !== "") row("Autoevaluación del estudiante", Number(rec.selfEval).toFixed(1));

    // Nota
    const cx = 160, cy = 100, R = 26;
    doc.setFillColor(240, 244, 255); doc.circle(cx, cy, R + 4, "F");
    doc.setDrawColor(226, 232, 247); doc.setLineWidth(4); doc.circle(cx, cy, R, "S");
    doc.setDrawColor(...GOLD); doc.setLineWidth(4);
    const frac = rec.grade / 5, steps = Math.max(1, Math.round(frac * 60));
    for (let i = 0; i < steps; i++) {
      const a0 = -Math.PI / 2 + (i / 60) * 2 * Math.PI, a1 = -Math.PI / 2 + ((i + 1.4) / 60) * 2 * Math.PI;
      doc.line(cx + R * Math.cos(a0), cy + R * Math.sin(a0), cx + R * Math.cos(a1), cy + R * Math.sin(a1));
    }
    doc.setFont("helvetica", "bold"); doc.setFontSize(34); doc.setTextColor(...NAVY2);
    doc.text(rec.grade.toFixed(1), cx, cy + 5, { align: "center" });
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(...MUTED); doc.text("de 5.0", cx, cy + 12, { align: "center" });
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(...INK);
    doc.text(g.correct + " de " + g.total + " correctas", cx, cy + R + 12, { align: "center" });

    // Resultados por sección
    y = Math.max(y, 150) + 2;
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...NAVY2); doc.text("Resultado por sección", M, y);
    doc.setFillColor(...GOLD); doc.rect(M, y + 2, 22, 1, "F");
    y += 11;
    g.secs.forEach((s) => {
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(...INK);
      doc.text(s.name, M, y, { maxWidth: 80 });
      doc.setFillColor(226, 232, 247); doc.roundedRect(100, y - 3.6, 70, 4.4, 2.2, 2.2, "F");
      if (s.correct) { doc.setFillColor(...BLUE); doc.roundedRect(100, y - 3.6, Math.max(4.4, 70 * s.correct / s.total), 4.4, 2.2, 2.2, "F"); }
      doc.setFont("helvetica", "bold"); doc.text(s.correct + "/" + s.total, 176, y);
      y += 9;
    });

    // Respuestas marcadas
    y += 6;
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...NAVY2); doc.text("Respuestas marcadas", M, y);
    doc.setFillColor(...GOLD); doc.rect(M, y + 2, 22, 1, "F");
    y += 10;
    const per = 10, cell = (W - 2 * M) / per;
    for (let i = 0; i < rec.answers.length; i++) {
      const col = i % per, rw = Math.floor(i / per);
      const x = M + col * cell, yy = y + rw * 14;
      doc.setFillColor(240, 244, 255); doc.roundedRect(x, yy, cell - 2, 12, 2, 2, "F");
      doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(...MUTED); doc.text(String(i + 1), x + (cell - 2) / 2, yy + 4, { align: "center" });
      doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(...NAVY2); doc.text(rec.answers[i], x + (cell - 2) / 2, yy + 9.5, { align: "center" });
    }

    // Pie
    doc.setFillColor(...NAVY); doc.rect(0, 275, W, 22, "F");
    doc.setFillColor(...GOLD); doc.rect(0, 275, W, 1.2, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("courier", "bold"); doc.setFontSize(13); doc.text(rec.id, M, 288);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(201, 214, 245);
    doc.text("Envía este PDF a tu docente como constancia de entrega.", W - M, 286, { align: "right" });
    doc.text("Código único de verificación", W - M, 291, { align: "right" });

    const fname = slug(rec.name) + "_" + slug(rec.course) + "_" + rec.grade.toFixed(1).replace(".", "-") + "_" + exam.id + ".pdf";
    if (asData) return doc.output("datauristring");
    doc.save(fname);
  };
})();
