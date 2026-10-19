# Publicar e instalar de forma permanente

## Firefox — recomendado para tu navegador

Una carpeta, un ZIP de GitHub o cambiar la extensión del ZIP a `.xpi` **no reemplaza la firma de Mozilla**. Firefox normal exige una extensión firmada para instalarla permanentemente. No necesitas desactivar esa protección.

### Opción A: publicar para todos en Firefox Add-ons

1. Genera los paquetes con `python tools/build.py`, o utiliza `artifacts/espoch-themes-0.4.0-firefox-unsigned.zip` ya preparado.
2. Entra en [el centro de desarrolladores de Mozilla](https://addons.mozilla.org/developers/) con tu cuenta Mozilla.
3. Elige enviar un nuevo complemento y la distribución **On this site / En este sitio**.
4. Sube el ZIP de Firefox. El manifiesto debe estar en la raíz del ZIP, como en el paquete generado.
5. Completa nombre, descripción, licencia MIT y datos de soporte reales. Usa el texto de `docs/FICHA-TIENDAS.md` como base y el documento `PRIVACY.md` como política de privacidad.
6. Declara que esta extensión no recoge ni transmite datos. El manifiesto ya incluye esa declaración. Todo el JavaScript distribuido es legible, sin minificación ni transformaciones; proporciona el código fuente si Mozilla lo solicita.
7. Acepta personalmente los acuerdos de la plataforma y completa la publicación/revisión. El ZIP preparado no significa que Mozilla ya haya firmado o aprobado la extensión.
8. Cuando esté disponible, abre la ficha y pulsa **Añadir a Firefox**. Tus compañeros podrán instalarla desde el mismo enlace y recibir actualizaciones por la tienda.

### Opción B: distribuir desde GitHub, con firma de Mozilla

1. En Mozilla, al enviar el complemento elige **On your own / Por tu cuenta**, para distribución propia.
2. Sube el mismo ZIP de Firefox. Completa el proceso y espera la firma.
3. Descarga el `.xpi` **firmado** de la versión desde tu panel de Mozilla.
4. En Firefox abre `about:addons` → engranaje → **Instalar complemento desde archivo…** → selecciona ese `.xpi` → confirma **Añadir**.
5. Permanecerá instalado al cerrar y abrir Firefox. Puedes poner el `.xpi` firmado en una Release de GitHub para tus compañeros.
6. Con esta configuración, las actualizaciones de distribución propia son manuales. Para automatizarlas se necesita un `update_url` y un manifiesto de actualizaciones alojado en una URL real. No se ha inventado ni configurado un repositorio o URL para ello.

No subas un ZIP sin firmar a una Release presentándolo como instalable permanente en Firefox. Identifícalo como paquete fuente o paquete pendiente de firma.

## Chrome — distribución para tus compañeros

1. Usa `artifacts/espoch-themes-0.4.0-chromium-unsigned.zip`, que elimina las claves exclusivas de Firefox.
2. Abre [el panel de desarrolladores de Chrome Web Store](https://chrome.google.com/webstore/devconsole/). Si ya tienes acceso, utiliza esa cuenta.
3. Crea un elemento nuevo y sube el ZIP de Chromium.
4. Completa la ficha, capturas, propósito único y privacidad. El propósito es personalizar visualmente el aula ESPOCH; justifica `storage` para las preferencias locales y el alcance al dominio del aula para aplicar estilos.
5. Completa personalmente los acuerdos y la publicación/revisión. Instala después desde el enlace de la tienda.

Para desarrollo puedes cargar `dist/chromium` desde `chrome://extensions` → modo de desarrollador → **Cargar descomprimida**. Esa carga persiste al reiniciar mientras la carpeta exista, pero no es una publicación de tienda ni ofrece actualizaciones automáticas a tus compañeros. No borres o muevas la carpeta cargada.

## GitHub — código abierto

La carpeta contiene código fuente, licencia MIT, instrucciones, pruebas y generador de paquetes. No se ha configurado una cuenta, remoto ni repositorio ajeno.

### Desde la web

1. En GitHub, crea un repositorio público llamado `espoch-themes` (o el nombre que prefieras).
2. Sube **los archivos y carpetas del código extraído**, no solo un ZIP guardado como archivo del repositorio. Incluye `manifest.json`, `src`, `css`, `popup`, `icons`, `themes.json`, `tools`, `tests`, `docs`, licencia y los Markdown.
3. No subas credenciales, `.env`, `node_modules` o cachés. `.gitignore` ya excluye esos archivos.
4. Crea una Release `v0.4.0`. Puedes adjuntar el paquete de Chromium y el XPI de Firefox una vez firmado. El ZIP de Firefox sin firmar puede adjuntarse indicando claramente su estado.
5. Pon en el README los enlaces reales de las tiendas cuando existan.

### Con Git

Desde la carpeta del proyecto, después de crear un repositorio vacío en tu cuenta:

```powershell
git init -b main
git add .
git commit -m "Mejora temas y personalizacion del aula ESPOCH"
# Copia aquí la URL real que GitHub te muestra para TU repositorio:
git remote add origin URL_REAL_DEL_REPOSITORIO
git push -u origin main
```

No ejecutes el comando del remoto con el marcador literal. Reemplázalo por la URL de tu repositorio. La publicación requiere acceso real a tu cuenta de GitHub y a las cuentas de las tiendas.

## Antes de invitar a tus compañeros

Prueba con tu sesión los cursos, entregas, cuestionarios, calificaciones, mensajería y editores que utilices. El sitio privado no se ha probado con una cuenta universitaria. Las pruebas locales y la portada pública ayudan a detectar errores, pero no garantizan compatibilidad con todos los plugins o recursos del aula. Si algo se ve mal, el interruptor retira todos los ajustes sin cambiar los datos académicos.

## Documentación oficial

- [Distribución y firma de Mozilla](https://extensionworkshop.com/documentation/publish/)
- [Enviar un complemento a Mozilla](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/)
- [Instalar un XPI firmado desde archivo](https://extensionworkshop.com/documentation/publish/install-self-distributed/)
- [Distribución de extensiones en Chrome](https://developer.chrome.com/docs/extensions/how-to/distribute)

Consultada el 19 de octubre de 2026.
