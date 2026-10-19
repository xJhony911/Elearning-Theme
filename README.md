# ESPOCH Themes

Personaliza el aula virtual de ESPOCH con temas claros y oscuros, tipografía y colores propios. Extensión independiente de la comunidad para **Firefox 142+** y **Chromium 120+**.

Se aplica exclusivamente a **https://elearning.espoch.edu.ec/**, que utiliza Moodle con tema Lambda. No modifica tus actividades, entregas o calificaciones.

## Personalización

- **Ocho estilos:** Midnight, Neon, ESPOCH Rojo, Bosque, Amatista, Papel, Lectura y Lavanda.
- **Seis fuentes locales:** sistema, Arial, Verdana, Georgia, Trebuchet MS y Consolas. El navegador utilizará la alternativa local disponible si alguna no está instalada.
- Tamaño del texto de **12 a 24 px**, interlineado de **1,2 a 2** y redondeado de tarjetas.
- Colores personalizados para fondo, tarjetas, texto y acento, con advertencia de contraste bajo.
- Vista previa, subrayado de enlaces, reducción de animaciones y restablecimiento de ajustes.
- Interruptor para volver al aula original y reactivar después el tema elegido.
- Guardado local y aplicación a las pestañas abiertas del aula. También puedes abrir las preferencias en una pestaña desde la administración de la extensión.

Los estilos cubren componentes de navegación, cursos, tablas, formularios, cuestionarios, mensajes y editores de Moodle. Los recursos externos, PDFs y marcos de otros dominios conservan su apariencia; no se solicita permiso para ellos.

## Instalación permanente en Firefox

**El ZIP de código no es un complemento firmado.** Para Firefox normal, primero envía el paquete Firefox a Mozilla para firma, ya sea con publicación en Firefox Add-ons o para distribución propia. Después instala desde la tienda o desde el archivo `.xpi` firmado mediante `about:addons` → engranaje → **Instalar complemento desde archivo…**.

Consulta **[PUBLICAR.md](PUBLICAR.md)** para el procedimiento completo de Firefox, Chrome Web Store y GitHub. No necesitas desactivar la verificación de firmas.

## Generar los paquetes

Con Python 3, sin instalar dependencias:

```powershell
python tools/build.py
```

Obtendrás:

```text
dist/firefox/      extensión preparada para Firefox
dist/chromium/     extensión preparada para Chrome / Edge / Brave
artifacts/espoch-themes-0.4.0-firefox-unsigned.zip
artifacts/espoch-themes-0.4.0-chromium-unsigned.zip
artifacts/SHA256SUMS.txt
```

El generador copia una lista explícita de archivos de ejecución. Las pruebas, herramientas, documentación y dependencias no se incluyen en los ZIP de las extensiones. Cada ZIP lleva el manifiesto en su raíz; los ZIP tienen marcas de tiempo fijas y hashes SHA-256 para comprobar integridad.

El ID de Firefox se conserva como `espoch-themes@jonathan` para mantener compatibilidad con versiones anteriores. Si alguien hace un fork para publicarlo como complemento diferente, debe asignarle un ID propio.

## Desarrollo y verificación

Para pruebas de lógica basta con Node.js 22 o posterior:

```powershell
node --test tests/*.test.cjs
```

Para validación de Mozilla y ejecución temporal de desarrollo:

```powershell
npm install
npm run build
npm run lint
npm run dev
```

`dev` abre una sesión temporal de desarrollo; no es el método de instalación permanente. Para Chrome, puedes probar `dist/chromium` con **Cargar descomprimida** desde `chrome://extensions`; para distribuirlo de forma sencilla a todos utiliza la tienda.

La demostración local permite revisar el menú y componentes de Moodle sin acceder a cuentas universitarias:

```powershell
python tools/preview-server.py
```

Abre `http://127.0.0.1:8766/preview-popup` y `http://127.0.0.1:8766/preview-moodle` en el mismo navegador. Usa el menú de demostración para cambiar los estilos de la segunda página. La demostración simula las APIs de la extensión: **no instala ni firma una extensión**.

## Crear otro tema

```powershell
node tools/add-theme.mjs ocean "Ocean" "#38bdf8"
```

Se crea un CSS con las variables de Midnight y se registra en `themes.json` y el manifiesto. Ajusta la paleta, vuelve a generar los paquetes y recarga la extensión de desarrollo. Cambiar de tema conserva la tipografía y desactiva los colores personalizados para mostrar la paleta elegida.

## Estructura

```text
manifest.json         manifiesto de origen, compatible con Firefox
themes.json           catálogo de estilos y colores de vista previa
src/settings.js       validación compartida y cálculos de contraste
src/content.js        lectura de preferencias y aplicación de estilos
css/base.css          componentes de Moodle y Lambda
css/themes/           variables de cada paleta
css/accessibility.css tipografía, temas claros, editores e impresión
popup/                menú y vista previa
tests/                pruebas de lógica y simulación de Moodle
tools/                empaquetado, demostración y generador de temas
docs/                 textos de las tiendas y validación
```

## Privacidad y alcance

Solo se solicita `storage`. No hay cuentas propias, seguimiento, analítica, publicidad, código remoto, fuentes externas ni servidores de la extensión. Las preferencias permanecen en el almacenamiento local de la extensión. [Política de privacidad](PRIVACY.md).

Se revisó la estructura de la portada pública real de ESPOCH y se probaron los estilos sobre una copia local de esa portada y componentes representativos de Moodle. **No se ha accedido a una cuenta universitaria ni comprobado cada página privada.** Antes de difundirla, revisa con tu sesión tus cursos, tareas, cuestionarios y calificaciones. [Detalle de validación](docs/VALIDACION.md).

Para informar de un problema visual, indica la sección y el componente afectados y adjunta una captura sin datos personales. El interruptor permite retirar todos los ajustes de inmediato.

## Licencia

MIT. Proyecto independiente: no está afiliado ni respaldado oficialmente por ESPOCH. [Historial de cambios](CHANGELOG.md).
