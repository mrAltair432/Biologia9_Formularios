// Banco de preguntas. "a" es el índice de la respuesta correcta (0=A, 1=B, 2=C, 3=D).
window.EXAMS = {
  taller: {
    id: "taller",
    title: "Taller de repaso",
    subtitle: "Biología · Grado noveno · Sistema nervioso",
    icon: "🧠",
    minutes: 0,
    sections: [
      { name: "Tema 1. Estructura y función de las neuronas", short: "Tema 1", questions: [
        { q: "¿Cuál es la función principal de las dendritas de una neurona?", o: ["Producir mielina alrededor del axón.", "Recibir señales procedentes de otras células.", "Bombear neurotransmisores hacia la sangre.", "Mantener exclusivamente la concentración de ATP en el núcleo."], a: 1 },
        { q: "Una neurona presenta una alteración que impide la liberación de neurotransmisores desde sus botones sinápticos. ¿Qué proceso se verá afectado directamente?", o: ["La recepción de luz por los fotorreceptores.", "La replicación del ADN en todas las células.", "La comunicación química con la célula postsináptica.", "La formación del potencial de reposo en todas las neuronas vecinas."], a: 2 },
        { q: "¿Cuál es la función principal de la vaina de mielina en un axón?", o: ["Incrementar la velocidad de conducción del impulso nervioso.", "Producir todos los neurotransmisores de la neurona.", "Impedir cualquier movimiento de iones a través de la membrana.", "Sustituir la función de la bomba sodio-potasio."], a: 0 }
      ]},
      { name: "Tema 2. Potencial de reposo y potencial de acción", short: "Tema 2", questions: [
        { q: "Una neurona tiene un potencial de membrana de −70 mV. ¿Cuál interpretación es correcta?", o: ["El interior de la neurona es más positivo que el exterior.", "No existen diferencias en la distribución de iones.", "La membrana ha perdido toda su permeabilidad a los iones.", "El interior de la neurona es eléctricamente más negativo que el exterior."], a: 3 },
        { q: "La bomba sodio-potasio transporta normalmente:", o: ["Tres iones de potasio hacia el exterior y dos de sodio hacia el interior.", "Tres iones de sodio hacia el exterior y dos de potasio hacia el interior.", "Dos iones de sodio hacia el exterior y tres de potasio hacia el interior.", "Cantidades iguales de sodio y potasio en ambas direcciones."], a: 1 },
        { q: "¿Qué fuente de energía utiliza directamente la bomba sodio-potasio?", o: ["La difusión de sodio a través de canales abiertos.", "La energía luminosa capturada por la neurona.", "La hidrólisis de ATP.", "La liberación de neurotransmisores en la sinapsis."], a: 2 },
        { q: "En condiciones de reposo, la membrana de una neurona suele ser más permeable al potasio que al sodio. ¿Qué consecuencia contribuye a producir esta diferencia?", o: ["La salida de K⁺ a través de canales de fuga favorece un interior relativamente negativo.", "La entrada masiva de Na⁺ hace que el interior sea muy positivo.", "Todos los iones dejan de desplazarse a través de la membrana.", "El potasio se convierte químicamente en sodio."], a: 0 },
        { q: "¿Cuál afirmación describe mejor la función de la bomba sodio-potasio en el potencial de reposo?", o: ["Genera por sí sola todas las fases del potencial de acción.", "Abre todos los canales de sodio cuando llega un estímulo.", "Libera neurotransmisores para mantener la diferencia de potencial.", "Mantiene los gradientes de Na⁺ y K⁺ necesarios para la actividad eléctrica neuronal."], a: 3 },
        { q: "Una neurona recibe un estímulo que alcanza el umbral de excitación. ¿Qué evento inicia normalmente la despolarización del potencial de acción?", o: ["La salida rápida de Na⁺ desde el citoplasma.", "La entrada rápida de Na⁺ por canales dependientes de voltaje.", "La entrada de neurotransmisores al núcleo.", "La salida simultánea de todo el ATP celular."], a: 1 },
        { q: "Durante la repolarización de un potencial de acción, ¿qué ocurre principalmente?", o: ["Se abren los canales de sodio y entra más Na⁺ indefinidamente.", "La membrana deja de tener cualquier diferencia de potencial.", "Se inactivan los canales de Na⁺ y aumenta la salida de K⁺ por canales dependientes de voltaje.", "La bomba sodio-potasio transporta todos los iones en una sola dirección."], a: 2 },
        { q: "¿Qué ocurriría si los canales de K⁺ dependientes de voltaje permanecieran abiertos durante más tiempo del habitual después de un potencial de acción?", o: ["Podría prolongarse la hiperpolarización debido a una mayor salida de K⁺.", "La membrana se volvería necesariamente más positiva que durante la despolarización.", "Se impediría cualquier movimiento de potasio.", "Se produciría una entrada masiva de neurotransmisores al axón."], a: 0 },
        { q: "Se aplica un estímulo cuya intensidad aumenta progresivamente, y todos los estímulos superan el umbral. ¿Qué respuesta es más consistente con el principio de todo o nada?", o: ["Cada potencial de acción aumenta necesariamente su amplitud en proporción al estímulo.", "Los estímulos más fuertes siempre producen potenciales de acción más largos.", "Los estímulos débiles generan potenciales de acción incompletos.", "Los potenciales de acción mantienen aproximadamente la misma amplitud, aunque puede aumentar su frecuencia."], a: 3 },
        { q: "Una sustancia bloquea los canales de Na⁺ dependientes de voltaje de una neurona. ¿Cuál sería la consecuencia más probable?", o: ["Aumentaría la velocidad de despolarización.", "Se dificultaría o impediría la generación y propagación del potencial de acción.", "Se duplicaría la velocidad de conducción en todos los axones.", "La bomba sodio-potasio dejaría de necesitar ATP."], a: 1 },
        { q: "¿Qué característica explica la conducción saltatoria en los axones mielinizados?", o: ["El impulso se desplaza exclusivamente por el núcleo de la neurona.", "Los neurotransmisores saltan de un nodo de Ranvier a otro.", "El potencial de acción se regenera principalmente en los nodos de Ranvier.", "La mielina genera ATP y reemplaza los canales iónicos."], a: 2 }
      ]},
      { name: "Tema 3. Sinapsis y neurotransmisores", short: "Tema 3", questions: [
        { q: "Cuando un potencial de acción llega al botón presináptico, ¿qué secuencia describe mejor la transmisión sináptica química?", o: ["Entrada de Ca²⁺, fusión de vesículas con la membrana y liberación de neurotransmisores.", "Salida de ADN, división celular y producción de mielina.", "Entrada de K⁺, destrucción de vesículas y bloqueo de receptores.", "Salida de neurotransmisores desde el núcleo hacia el axón."], a: 0 },
        { q: "¿Cuál de las siguientes afirmaciones sobre los neurotransmisores es correcta?", o: ["Todos son exclusivamente inhibidores.", "Solo participan en la comunicación entre neuronas motoras y músculos.", "Son iones que atraviesan directamente cualquier membrana sin receptores.", "Pueden producir efectos excitadores o inhibidores según el receptor y la célula postsináptica."], a: 3 },
        { q: "¿Cuál es la secuencia más apropiada de un arco reflejo rotuliano?", o: ["Neurona motora → receptor sensorial → neurona sensorial → músculo.", "Receptor muscular → neurona sensorial → médula espinal → neurona motora → músculo.", "Cerebro → glándula endocrina → receptor → médula espinal.", "Músculo → neurotransmisor sanguíneo → fotorreceptor → médula espinal."], a: 1 },
        { q: "¿Qué tipo de receptor detecta principalmente la luz?", o: ["Quimiorreceptor.", "Termorreceptor.", "Fotorreceptor.", "Nociceptor."], a: 2 },
        { q: "Un receptor sensorial transforma un estímulo físico o químico en una señal eléctrica. Este proceso se denomina:", o: ["Transducción sensorial.", "Replicación celular.", "Síntesis de proteínas.", "Conducción saltatoria."], a: 0 }
      ]},
      { name: "Tema 5. Integración y homeostasis", short: "Tema 5", questions: [
        { q: "Una persona toca un objeto muy caliente y retira rápidamente la mano. ¿Cuál afirmación explica mejor esta respuesta?", o: ["La respuesta depende siempre de una decisión consciente previa.", "Las hormonas son las únicas responsables de transmitir la señal en el arco reflejo.", "La contracción muscular ocurre antes de que exista cualquier señal nerviosa.", "Los receptores detectan el estímulo y un circuito nervioso produce una respuesta rápida que ayuda a proteger el organismo."], a: 3 }
      ]}
    ]
  },

  quiz: {
    id: "quiz",
    title: "Taller de cierre · III trimestre",
    subtitle: "Evaluación de Biología · Grado noveno",
    icon: "⚡",
    selfEval: true,
    selfCriteria: [
      { short: "Compromiso", t: "Me esfuerzo por aprender y cumplir con las actividades de la clase." },
      { short: "Responsabilidad", t: "Llevo los materiales y entrego las tareas a tiempo." },
      { short: "Respeto", t: "Escucho a mi docente y compañeros, y valoro sus opiniones." },
      { short: "Participación", t: "Aporto ideas, hago preguntas y participo en las actividades." },
      { short: "Atención", t: "Presto atención a las explicaciones y sigo las instrucciones." },
      { short: "Trabajo en equipo", t: "Coopero con mis compañeros y comparto ideas." },
      { short: "Cuidado del material y del espacio", t: "Uso responsablemente los recursos y sigo las normas de seguridad." },
      { short: "Actitud de mejora", t: "Acepto las recomendaciones y hago mi mejor esfuerzo por mejorar." }
    ],
    sections: [
      { name: "U.C.C.C", short: "U.C.C.C", questions: [
        { q: "¿Qué afirmación se aplica a un axón en reposo?", o: ["No hay diferencia de potencial eléctrico entre las superficies externa e interna de la membrana plasmática.", "La superficie externa de la membrana plasmática es positiva con respecto a la superficie interna.", "La superficie externa de la membrana plasmática es negativa con respecto a la superficie interna.", "La superficie interna de la membrana plasmática tiene una concentración mucho mayor de iones de sodio."], a: 1 },
        { q: "Si la esquizofrenia la provoca una sobreabundancia de los neurotransmisores dopamina y serotonina en las sinapsis de algunas zonas del cerebro, ¿qué acción farmacológica podría funcionar para tratar los síntomas?", o: ["Liberación de colinesterasa en la hendidura sináptica.", "Un aumento de la recaptación de dopamina y de serotonina por parte de las neuronas presinápticas.", "Una mayor permeabilidad de la neurona presináptica al sodio.", "El bloqueo de los receptores de dopamina y de serotonina que hay en las neuronas presinápticas."], a: 1 },
        { q: "En esta neurona motora, ¿qué estructura es necesaria para que pueda haber conducción a saltos?", img: "assets/neurona.png", alt: "Neurona motora con estructuras señaladas A, B, C y D", o: ["Estructura A", "Estructura B", "Estructura C", "Estructura D"], a: 2 },
        { q: "En el gráfico se muestran los cambios en el potencial de membrana en un potencial de acción. ¿Cuál es el valor aproximado del potencial umbral?", img: "assets/grafico-umbral.png", alt: "Gráfico de potencial de membrana contra tiempo", o: ["–88 mV", "–70 mV", "–50 mV", "+45 mV"], a: 2 },
        { q: "¿Cuál es la función principal de las dendritas de una neurona?", o: ["Producir mielina alrededor del axón.", "Recibir señales procedentes de otras células.", "Bombear neurotransmisores hacia la sangre.", "Mantener exclusivamente la concentración de ATP en el núcleo."], a: 1 },
        { q: "¿Qué tipo de receptor detecta principalmente la luz?", o: ["Quimiorreceptor.", "Termorreceptor.", "Fotorreceptor.", "Nociceptor."], a: 2 }
      ]},
      { name: "Explicación de fenómenos", short: "Explicación", questions: [
        { q: "El siguiente diagrama muestra parte de la membrana de una neurona. ¿Qué fase del potencial de acción representa?", img: "assets/membrana.png", alt: "Membrana de una neurona con canal de Na⁺ abierto, bomba Na⁺/K⁺ y canal de K⁺ cerrado", o: ["Despolarización", "Repolarización", "Potencial de reposo", "Hiperpolarización"], a: 0 },
        { q: "¿Qué resulta esencial para que la conducción de los impulsos nerviosos sea a saltos?", o: ["La envoltura de mielina que hay alrededor del axón.", "Alcanzar el potencial umbral en las dendritas.", "El bombeo de iones de potasio al interior de la neurona.", "La liberación de un neurotransmisor en la sinapsis."], a: 0 },
        { q: "El diagrama muestra un gráfico de un potencial de acción. ¿Qué ocurre en X?", img: "assets/potencial-x.png", alt: "Gráfico de un potencial de acción con el punto X en el pico", o: ["Los canales de sodio se cierran.", "Los canales de calcio se abren.", "Se abren los canales de sodio.", "Los canales de potasio se cierran."], a: 0 },
        { q: "¿Qué función específica cumplen los mecanorreceptores ubicados en la piel al interactuar con el sistema nervioso central?", o: ["Detectan los niveles de azúcar en la sangre y regulan la presión arterial.", "Transforman la luz en señales eléctricas para interpretar imágenes.", "Convierten estímulos físicos como presión o vibración en impulsos nerviosos que son interpretados por el cerebro.", "Producen hormonas para responder al estrés y a los estímulos externos."], a: 2 },
        { q: "¿Qué fuente de energía utiliza directamente la bomba sodio-potasio?", o: ["La difusión de sodio a través de canales abiertos.", "La energía luminosa capturada por la neurona.", "La hidrólisis de ATP.", "La liberación de neurotransmisores en la sinapsis."], a: 2 },
        { q: "Una persona toca un objeto muy caliente y retira rápidamente la mano. ¿Cuál afirmación explica mejor esta respuesta?", o: ["La respuesta depende siempre de una decisión consciente previa.", "Las hormonas son las únicas responsables de transmitir la señal en el arco reflejo.", "La contracción muscular ocurre antes de que exista cualquier señal nerviosa.", "Los receptores detectan el estímulo y un circuito nervioso produce una respuesta rápida que ayuda a proteger el organismo."], a: 3 }
      ]},
      { name: "Indagación", short: "Indagación", questions: [
        { q: "En el gráfico se representa la variación del potencial de membrana durante un impulso nervioso. ¿Qué letra indica el momento en que se abren los canales de potasio?", img: "assets/potencial-abcd.png", alt: "Gráfico de potencial de acción con los puntos A, B, C y D", o: ["Punto A", "Punto B", "Punto C", "Punto D"], a: 2 },
        { q: "Cuando se afirma que el control del cuerpo por parte de los hemisferios es cruzado, significa que:", o: ["Cada hemisferio domina las dos mitades del cuerpo.", "El hemisferio derecho domina la mitad izquierda del cuerpo y el izquierdo, la derecha.", "El hemisferio derecho domina la mitad derecha del cuerpo y el izquierdo, la izquierda.", "Solo coordina la parte cerebral del cuerpo."], a: 1 },
        { q: "¿Cuál de las siguientes acciones es un acto voluntario?", o: ["Latido del corazón", "Digestión de alimentos", "Escribir un ensayo", "Respirar durante el sueño"], a: 2 },
        { q: "¿Qué parte del ojo es responsable de enfocar la luz en la retina?", o: ["Córnea", "Iris", "Lente o cristalino", "Pupila"], a: 2 },
        { q: "Cuando un potencial de acción llega al botón presináptico, ¿qué secuencia describe mejor la transmisión sináptica química?", o: ["Entrada de Ca²⁺, fusión de vesículas con la membrana y liberación de neurotransmisores.", "Salida de ADN, división celular y producción de mielina.", "Entrada de K⁺, destrucción de vesículas y bloqueo de receptores.", "Salida de neurotransmisores desde el núcleo hacia el axón."], a: 0 },
        { q: "¿Cuál es la secuencia más apropiada de un arco reflejo rotuliano?", o: ["Neurona motora → receptor sensorial → neurona sensorial → músculo.", "Receptor muscular → neurona sensorial → médula espinal → neurona motora → músculo.", "Cerebro → glándula endocrina → receptor → médula espinal.", "Músculo → neurotransmisor sanguíneo → fotorreceptor → médula espinal."], a: 1 }
      ]}
    ]
  }
};
