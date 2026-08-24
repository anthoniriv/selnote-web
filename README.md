<p align="center">
  <b>🔗 NotesChain</b><br>
  <sub>Notas encadenadas y cifradas en tu navegador — un «cerebro» de notas con búsqueda y enlace secreto.</sub>
</p>

<p align="center">
  <img src="screenshot.png" alt="NotesChain" width="600">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/Sin_dependencias-0-ff5c39?style=flat" alt="Sin dependencias">
</p>

---

## Qué hace

App de notas **local-first** en un solo archivo. Las notas se encadenan una tras otra dentro de un «cerebro» (una colección cifrada), y podés conectar con otro cerebro mediante un **enlace o código secreto**. Todo vive en tu navegador (localStorage + IndexedDB).

## Funcionalidades

- Crear un «cerebro» (colección de notas encadenadas).
- Conectar con otro cerebro usando un **enlace o código secreto**.
- Cifrado de las notas.
- Búsqueda dentro del cerebro.
- Pegar imágenes (⌘V / Ctrl+V) junto con texto.
- Persistencia local con `localStorage` e `IndexedDB`.
- Sin dependencias: un único `index.html`.

## Uso local

No necesita build ni instalación. Abrí `index.html` en el navegador, o servilo:

```bash
npx serve .
```

## Tecnologías

| Capa | Stack |
|------|-------|
| Lógica | JavaScript (vanilla) |
| Almacenamiento | localStorage + IndexedDB |
| Cifrado | Web Crypto (en el navegador) |

---

<p align="center"><sub>Hecho con ❤️ por <a href="https://github.com/anthoniriv">Anthoni Rivera</a></sub></p>
