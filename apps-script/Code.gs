/**
 * Base de datos de evaluaciones de Biología 9 (Google Sheets + Apps Script).
 * Instrucciones en README.md. Pegar este archivo en el editor de Apps Script
 * de una hoja de cálculo nueva.
 */
const SHEET = "Respuestas";
const HEADERS = ["Fecha", "ID ticket", "Actividad", "Nombre", "Correo", "Curso", "Autoevaluación", "Correctas", "Total", "Nota", "Secciones", "Respuestas", "Segundos"];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#12285a").setFontColor("#ffffff");
  }
  return sh;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

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
        submittedAt: r[0] instanceof Date ? r[0].toISOString() : String(r[0]), id: r[1], exam: r[2], name: r[3], email: r[4], course: r[5],
        selfEval: r[6], correct: r[7], total: r[8], grade: r[9], sections: r[10], answers: r[11], seconds: r[12]
      };
    });
    return json_({ ok: true, rows: rows });
  }

  if (!data.id || !data.exam || !data.name || !data.email) return json_({ ok: false, error: "missing_fields" });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = getSheet_();
    const ids = sh.getLastRow() > 1 ? sh.getRange(2, 2, sh.getLastRow() - 1, 1).getValues().flat() : [];
    if (ids.indexOf(data.id) === -1) {
      sh.appendRow([
        new Date(data.submittedAt || Date.now()), data.id, data.exam, String(data.name).slice(0, 120), String(data.email).slice(0, 120),
        String(data.course).slice(0, 20), data.selfEval, Number(data.correct), Number(data.total), Number(data.grade),
        String(data.sections || ""), String(data.answers || ""), Number(data.seconds || 0)
      ]);
    }
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

function doGet() {
  return json_({ ok: true, service: "bio9-evaluaciones" });
}
