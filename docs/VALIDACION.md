# Validación de ESPOCH Themes 0.4.0

Fecha: 19 de octubre de 2026.

## Comprobaciones completadas

- **6 pruebas de lógica aprobadas** con `node --test tests/content.test.cjs`: arranque anterior a `<html>`, migración del selector antiguo, cambios en vivo, desactivación y limpieza de ajustes, lectura inicial atrasada, restauración de variables CSS originales, validación de valores y coherencia de manifiesto/catálogo.
- **Mozilla web-ext 10.8.0: 0 errores, 0 avisos y 0 advertencias** sobre `dist/firefox`, con Firefox mínimo 142.0.
- Paquetes separados de Firefox y Chromium: manifiesto en la raíz, recursos presentes, sin herramientas de prueba o dependencias dentro del ZIP y con hashes SHA-256.
- Ocho temas recorridos desde el menú en un navegador Chromium de pruebas, comprobando sus colores calculados y el esquema claro/oscuro correspondiente.
- Fuente Georgia, tamaño 24 px y subrayado aplicados simultáneamente a la página de componentes Moodle.
- Preferencias conservadas al recargar el menú. Tema Bosque conservado después de desactivar, recargar y reactivar.
- Interruptor desactivado: atributo de tema retirado y variables de personalización retiradas/restauradas.
- Aviso de contraste comprobado con texto y tarjeta del mismo color: relación 1.0:1, con advertencia visible.
- Inspección de la estructura pública real de `elearning.espoch.edu.ec`: Moodle/Lambda. Prueba visual sobre una copia local de su HTML público y hojas de estilo del sitio, sin ejecutar los scripts propios del aula.
- Revisión visual de una página de componentes con navegación, tarjetas, índice de curso, tablas de calificaciones, estados de entrega, textarea y preguntas con radio buttons.

## Alcance y pendientes

El navegador de pruebas es Chromium y utiliza una simulación de `browser.storage` en las páginas locales. Eso verifica la interfaz y las reglas CSS, pero no equivale a instalar el paquete en Firefox. La validación de Mozilla comprueba el paquete Firefox estáticamente.

No se ha instalado la extensión en el Firefox personal del usuario, no se ha iniciado sesión en el aula ni se han probado los cursos privados o todos los plugins de Moodle. Se necesita una comprobación con la sesión universitaria antes de anunciar compatibilidad total.

No se ha firmado el paquete, publicado en las tiendas ni subido a GitHub. El ZIP de Firefox sigue siendo **sin firmar**; Mozilla debe emitir el XPI firmado para instalación permanente en Firefox normal.

Las capturas corresponden a demostraciones y copia de portada pública, sin datos privados de estudiantes. No deben presentarse como capturas de una sesión académica privada.
