# Red y despliegue

Selnote cifra el contenido antes de persistirlo o transferirlo. La red sirve para descubrir pares y transportar bytes cifrados; no reemplaza la verificación criptográfica de la aplicación.

## Rutas de conexión

| Componente | Función | Metadatos que puede observar |
|---|---|---|
| Tracker | Coordina señalización WebRTC | Dirección IP, hora de conexión, identificadores de señalización y pares participantes. |
| STUN | Descubre candidatos de conectividad | Dirección IP y puerto observados por el servidor STUN. |
| TURN | Reenvía tráfico cuando no existe ruta directa | Metadatos de conexión y volumen aproximado; transporta bytes cifrados de extremo a extremo. |
| WebRTC directo | Envía datos entre pares | Los pares conocen sus direcciones candidatas y el flujo de tráfico. |

El cifrado de Selnote protege el contenido de notas y adjuntos frente a esos intermediarios, pero no elimina la exposición de metadatos de red.

## GitHub Pages y PWA

Los recursos PWA usan rutas relativas (`./`) para funcionar tanto en un dominio raíz como en el subdirectorio de un proyecto de GitHub Pages. El service worker almacena únicamente el shell de la aplicación y las bibliotecas locales: HTML, manifest, icono y vendor. No intercepta ni guarda de forma genérica solicitudes de red, ni accede al contenido de IndexedDB.

GitHub Pages es un hosting estático. No permite configurar encabezados HTTP por ruta; por eso la CSP se entrega como una etiqueta `meta` en `index.html`. Esta protección se aplica después de que el documento comienza a procesarse y no sustituye una CSP mediante encabezado en un servidor que permita configurarla. Como el HTML todavía contiene el módulo principal y estilos inline, la política usa `unsafe-inline`; esto reduce la protección contra inyección y debe eliminarse al extraer esos recursos a archivos locales. El despliegue debe servirse por HTTPS para que el service worker y las APIs de criptografía funcionen.

## Dependencias locales

Three.js, el generador QR y el lector QR se sirven desde `vendor/`. No existe fallback ejecutable a CDN. Si faltan, la vista 3D cae a la vista simple y las funciones QR informan el error de carga; la aplicación no descarga código de terceros en tiempo de ejecución.
