# Guía de contribución

Gracias por contribuir a NotesChain.

## Flujo de ramas

1. Creá una rama `feature/*` desde `develop`.
2. Abrí un pull request de `feature/*` hacia `develop`.
3. Una vez validado el conjunto de cambios en `develop`, abrí el pull request de `develop` hacia `main` para publicar una versión.

No se integran cambios directamente a `main`.

## Antes de enviar cambios

- Abrí un issue para cambios amplios o que impliquen decisiones de producto, seguridad o arquitectura.
- Mantené cada pull request enfocado y explicá el problema que resuelve.
- No incluyas secretos, claves, datos personales ni contenido de usuarios.
- Ejecutá obligatoriamente las mismas verificaciones locales de la CI:

```bash
npm run check
npm test
```

## Pull requests

Describí el cambio, cómo lo verificaste y cualquier limitación conocida. Los checks deben pasar antes de integrar el pull request.

Los cambios que afecten cifrado, claves, validación criptográfica, sincronización P2P, señalización o persistencia requieren revisión explícita antes de integrarse.
