<p align="center">
  <img src="assets/banner.svg" alt="NotesChain — notas cifradas y sincronización directa" width="100%">
</p>

<p align="center">
  <strong>Notas personales que viven en tu navegador y se sincronizan entre tus propios dispositivos.</strong><br>
  <sub>Sin cuentas, sin backend que centralice el contenido y con cifrado de extremo a extremo.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-vanilla-f7df1e?style=flat&logo=javascript&logoColor=111827" alt="JavaScript vanilla">
  <img src="https://img.shields.io/badge/Web%20Crypto-AES--GCM%20%2B%20Ed25519-38bdf8?style=flat" alt="Web Crypto">
  <img src="https://img.shields.io/badge/WebRTC-P2P-a78bfa?style=flat" alt="WebRTC P2P">
  <img src="https://img.shields.io/badge/Dependencias-0-22c55e?style=flat" alt="Sin dependencias">
</p>

<p align="center">
  <img src="screenshot.png" alt="Interfaz visual de NotesChain" width="600">
</p>

---

## Qué hace

NotesChain está pensado para conservar notas y archivos bajo tu control: cifra los datos en el dispositivo, guarda una copia local y replica los cambios directamente entre dispositivos emparejados. La interfaz convierte el conjunto de notas en un mapa visual para navegar el contenido y entender qué dispositivos forman parte del cerebro.

## Funcionalidades principales

- **Notas locales cifradas** con AES-GCM y almacenamiento en IndexedDB.
- **Historial verificable de cambios**, firmado con claves Ed25519.
- **Sincronización P2P** entre dispositivos mediante WebRTC; el contenido viaja cifrado.
- **Emparejamiento por código o QR** para autorizar nuevos dispositivos.
- **Modo de transferencia por luz**: enviá notas pequeñas de pantalla a cámara sin Wi-Fi, datos ni Bluetooth.
- **Adjuntos e imágenes** cifrados, fragmentados y verificados por hash antes de usarse.
- **Edición, búsqueda, eliminación y revocación** desde una única interfaz web.

## Cómo funciona

```text
  escribís una nota
          │
          ▼
  se cifra y se firma en tu navegador
          │
          ├── se guarda localmente en IndexedDB
          │
          └── se replica a dispositivos autorizados por WebRTC
```

El contenido no se sube a un servicio central. Un tracker liviano puede ayudar a encontrar pares y negociar la conexión, pero las notas y los adjuntos se envían cifrados entre dispositivos. Para un intercambio puntual, el código QR permite iniciar la transferencia usando únicamente la pantalla y la cámara.

## Flujo de uso

1. Abrí la aplicación en un navegador compatible y creá un espacio de notas.
2. Guardá notas o adjuntá archivos: permanecen cifrados en el almacenamiento del navegador.
3. Emparejá otro dispositivo con el código o QR para replicar el contenido entre ambos.

## Arquitectura

El proyecto es una aplicación web estática y autocontenida:

```text
index.html    interfaz, lógica de aplicación y estilos
assets/       recursos visuales de la documentación
```

El archivo de entrada implementa la interfaz, IndexedDB, Web Crypto, WebRTC y la visualización 3D. No hay `package.json`, proceso de compilación ni backend de almacenamiento incluidos en este repositorio.

| Capa | Tecnología |
|------|------------|
| Interfaz | HTML, CSS y JavaScript vanilla |
| Almacenamiento | IndexedDB del navegador |
| Cifrado e identidad | Web Crypto, AES-GCM y Ed25519 |
| Sincronización | WebRTC P2P + señalización liviana |

## Ejecución local

Serví el directorio `web` con un servidor de archivos estáticos. Por ejemplo, con Python 3:

```bash
cd /Users/anthonirivera/DEV/noteschain/web
python3 -m http.server 8080
```

Abrí [http://localhost:8080](http://localhost:8080). Usar un servidor local, en vez de abrir el archivo directamente, permite que el navegador aplique correctamente las APIs web que utiliza la aplicación.

## Consideraciones

- El contenido se almacena localmente en cada navegador; borrar los datos del sitio elimina esa copia.
- La sincronización depende de que los dispositivos puedan conectarse como pares.
- El tracker solo facilita el encuentro y la negociación; no es el almacén de notas.
- Los adjuntos se cifran antes de persistirse y se verifican al recibirse.
- La transferencia por QR está pensada para notas y cargas pequeñas: el límite práctico depende de la cámara y la velocidad de lectura.
