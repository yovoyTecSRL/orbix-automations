# Orbix Night Tasks – Fase 1

## ¿Cómo abrir?
Abre `index.html` en tu navegador. Todo funciona 100% client-side.

## Importar/Exportar JSON
- (Próxima Fase) Usa los botones para importar/exportar tareas en formato JSON.

## Atajos de teclado
- `f`: Foco en filtros
- `s`: Foco en búsqueda
- `e`: Exportar JSON
- `i`: Importar JSON
- `.theme-matrix`: Activa modo Matrix (texto verde, glow)

## Modo Matrix
Agrega la clase `.theme-matrix` al `<body>` para activar el modo Matrix visual.

## Accesibilidad
- Navegación por teclado completa
- Foco visible
- Contraste AA
- Barra de progreso con `role="progressbar"` y `aria-valuenow`

## Persistencia
- Cambios en tareas se guardan automáticamente en `localStorage` (`orbix.tasks`)

## Estructura
- `/orbix_tareas/index.html`
- `/orbix_tareas/styles.css`
- `/orbix_tareas/app.js`
- `/orbix_tareas/tasks.sample.json`
- `/orbix_tareas/README.md`
