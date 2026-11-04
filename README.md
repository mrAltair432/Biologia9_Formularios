# Evaluaciones de Biología 9 (formularios interactivos)

Sitio estático: `index.html` (menú), `examen.html?e=taller|quiz` (formularios), `docente.html` (panel docente).
Cada envío genera un ticket PDF para el estudiante y una fila en una hoja de Google Sheets.

## Conectar la base de datos (una sola vez, ~3 min)

1. Crea una hoja de cálculo nueva en Google Sheets (ej. "Biología 9 – Resultados").
2. **Extensiones > Apps Script**, pega el contenido de `apps-script/Code.gs` y guarda.
3. **Configuración del proyecto > Propiedades del script > Agregar**: `TEACHER_PASSWORD` = la clave docente que quieras.
4. **Implementar > Nueva implementación > Aplicación web**: ejecutar como *Yo*, acceso *Cualquier usuario*. Autoriza los permisos.
5. Copia la URL que termina en `/exec` y pégala en `js/config.js` (`SCRIPT_URL`).
6. Publica de nuevo el sitio. Los docentes ven los datos en la hoja (pestaña `Respuestas`) o en `docente.html`.

Mientras `SCRIPT_URL` esté vacío el sitio funciona en modo prueba (datos solo en el navegador).

## Notas

- La nota va de 0.0 a 5.0 (aciertos / total × 5). El estudiante solo ve su nota y su ticket, no las respuestas correctas.
- Las claves están en `js/exams.js` (`a` = índice de la correcta). La calificación se hace en el navegador.
- Los envíos fallidos por falta de conexión se guardan y se reintentan.
