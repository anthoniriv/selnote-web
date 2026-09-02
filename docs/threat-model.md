# Modelo de amenazas

## Objetivo

NotesChain busca mantener notas y adjuntos cifrados en el navegador y replicarlos entre dispositivos autorizados. No promete ocultar toda la actividad de red ni recuperar información borrada del almacenamiento del usuario.

## Activos protegidos

- Contenido de notas y adjuntos.
- Llave de cifrado del espacio de notas.
- Claves de firma e identidad de dispositivos.
- Integridad e historial de los bloques sincronizados.

## Límites de confianza

| Actor | Confianza | Controles principales |
|---|---|---|
| Navegador local | Necesario para usar la aplicación | Web Crypto, IndexedDB y permisos del navegador. |
| Dispositivo autorizado | Puede leer y proponer cambios según sus permisos | Firmas y validación de cadena. |
| Tracker/STUN/TURN | No confiable para contenido | Cifrado de extremo a extremo; exposición residual de metadatos. |
| GitHub Pages | No confiable para secretos de usuario | Solo publica archivos estáticos; no debe contener claves ni datos de notas. |
| Par P2P no confiable | Puede enviar entradas malformadas | Límites antes de `JSON.parse`, `Array` y `Uint8Array`; validación criptográfica posterior. |

## Amenazas y mitigaciones

- **Lectura de contenido en tránsito:** las notas y adjuntos se cifran antes de enviarse.
- **Bloques falsificados o alterados:** la aplicación verifica hashes y firmas antes de adoptar cambios.
- **Agotamiento de memoria por P2P:** los mensajes de texto, inicio de blobs y fragmentos tienen límites explícitos antes de parsear o reservar arreglos.
- **Código remoto mutable:** las bibliotecas de la interfaz se sirven localmente, sin fallback ejecutable a CDN.
- **Persistencia de datos sensibles en caché:** el service worker limita su caché al shell estático y no cachea de forma genérica solicitudes ni IndexedDB.

## Riesgos que permanecen

- Un dispositivo desbloqueado, comprometido o autorizado puede leer el contenido que su usuario puede leer.
- Los intermediarios de red pueden observar metadatos como IP, momento, pares y volumen aproximado.
- La disponibilidad depende de los dispositivos, la conectividad y los servicios de señalización.
- Una CSP en `meta` es menos fuerte que una CSP por encabezado; GitHub Pages no permite configurarla por ruta.
