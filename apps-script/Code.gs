/**
 * Base de datos de evaluaciones de Biología 9 (Google Sheets + Apps Script).
 * Instrucciones en README.md. Pegar este archivo en el editor de Apps Script
 * de una hoja de cálculo nueva.
 */
const SHEET = "Respuestas";
const TEACHER_EMAIL = "jhongonzalez@colegiocambridge.edu.co";
const TZ = "America/Bogota";
const HEADERS = ["Fecha de entrega", "Hora de inicio", "ID ticket", "Actividad", "Nombre", "Correo", "Curso", "Autoevaluación", "Correctas", "Total", "Nota", "Secciones", "Respuestas", "Segundos"];
const SELF_SHEET = "Autoevaluaciones";
const SELF_HEADERS = ["Fecha de entrega", "ID ticket", "Nombre", "Correo", "Curso", "Actividad", "1 Compromiso", "2 Responsabilidad", "3 Respeto", "4 Participación", "5 Atención", "6 Trabajo en equipo", "7 Cuidado del material", "8 Actitud de mejora", "Nota autoevaluación"];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#12285a").setFontColor("#ffffff");
    sh.getRange("A:B").setNumberFormat("yyyy-mm-dd hh:mm:ss");
  }
  return sh;
}

function getSelfSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SELF_SHEET);
  if (!sh) {
    sh = ss.insertSheet(SELF_SHEET);
    sh.appendRow(SELF_HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, SELF_HEADERS.length).setFontWeight("bold").setBackground("#12285a").setFontColor("#ffffff");
    sh.getRange("A:A").setNumberFormat("yyyy-mm-dd hh:mm:ss");
  }
  return sh;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function iso_(v) { return v instanceof Date ? v.toISOString() : String(v); }

// Recibe envíos de estudiantes y consultas de docentes (acción "list").
function doPost(e) {
  let data;
  try { data = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: "bad_request" }); }

  if (data.action === "list") {
    const pw = PropertiesService.getScriptProperties().getProperty("TEACHER_PASSWORD");
    if (!pw || data.password !== pw) return json_({ ok: false, error: "unauthorized" });
    const values = getSheet_().getDataRange().getValues();
    const rows = values.slice(1).map(function (r) {
      return {
        submittedAt: iso_(r[0]), startedAt: iso_(r[1]), id: r[2], exam: r[3], name: r[4], email: r[5], course: r[6],
        selfEval: r[7], correct: r[8], total: r[9], grade: r[10], sections: r[11], answers: r[12], seconds: r[13]
      };
    });
    return json_({ ok: true, rows: rows });
  }

  if (!data.id || !data.exam || !data.name || !data.email) return json_({ ok: false, error: "missing_fields" });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  let isNew = false;
  try {
    const sh = getSheet_();
    const ids = sh.getLastRow() > 1 ? sh.getRange(2, 3, sh.getLastRow() - 1, 1).getValues().flat() : [];
    if (ids.indexOf(data.id) === -1) {
      isNew = true;
      sh.appendRow([
        new Date(data.submittedAt || Date.now()), new Date(data.startedAt || data.submittedAt || Date.now()), data.id, data.exam,
        String(data.name).slice(0, 120), String(data.email).slice(0, 120), String(data.course).slice(0, 20), data.selfEval,
        Number(data.correct), Number(data.total), Number(data.grade), String(data.sections || ""), String(data.answers || ""), Number(data.seconds || 0)
      ]);
      if (data.selfItems) {
        const items = String(data.selfItems).split(",").map(Number);
        getSelfSheet_().appendRow([
          new Date(data.submittedAt || Date.now()), data.id, String(data.name).slice(0, 120), String(data.email).slice(0, 120),
          String(data.course).slice(0, 20), data.exam
        ].concat(items, [Number(data.selfEval)]));
      }
    }
  } finally {
    lock.releaseLock();
  }
  if (isNew) notify_(data);
  return json_({ ok: true });
}

// Avisa al docente por correo con el ticket PDF adjunto.
function notify_(d) {
  try {
    const when = Utilities.formatDate(new Date(d.submittedAt || Date.now()), TZ, "yyyy-MM-dd HH:mm:ss");
    const opts = {
      to: TEACHER_EMAIL,
      replyTo: String(d.email),
      subject: "[Biología 9] " + d.examTitle + " · " + d.name + " (" + d.course + ") · " + Number(d.grade).toFixed(1),
      htmlBody: "<p><b>" + esc_(d.name) + "</b> (" + esc_(d.email) + ") · Curso " + esc_(d.course) + "</p>" +
        "<p>Actividad: " + esc_(d.examTitle) + "<br>Entregado: " + when + "<br>Nota: <b>" + Number(d.grade).toFixed(1) + "</b> (" + d.correct + "/" + d.total + ")" + (d.selfItems ? "<br>Autoevaluación: <b>" + Number(d.selfEval).toFixed(1) + "</b> / 5.0" : "") + "<br>ID: " + esc_(d.id) + "</p>"
    };
    if (d.pdfBase64) {
      opts.attachments = [Utilities.newBlob(Utilities.base64Decode(d.pdfBase64), "application/pdf", d.id + ".pdf")];
    }
    MailApp.sendEmail(opts);
  } catch (err) { console.error(err); }
}

function esc_(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

function doGet() {
  return json_({ ok: true, service: "bio9-evaluaciones" });
}
