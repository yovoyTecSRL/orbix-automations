// Orbix Night Tasks – Fase 1 Core
// 100% client-side, accesible, persistente

const STORAGE_KEY = 'orbix.tasks';
const FILTERS_KEY = 'orbix.filters';
let state = {
  tasks: [],
  filters: {
    categoria: '',
    estado: '',
    search: ''
  }
};

function seedTasks() {
  fetch('tasks.sample.json')
    .then(r => r.json())
    .then(data => {
      state.tasks = data;
      saveLocal();
      render();
    });
}

function loadLocal() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      state.tasks = JSON.parse(saved);
    } catch {
      state.tasks = [];
    }
  } else {
    seedTasks();
  }
  const filters = localStorage.getItem(FILTERS_KEY);
  if (filters) {
    try {
      state.filters = JSON.parse(filters);
    } catch {}
  }
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  localStorage.setItem(FILTERS_KEY, JSON.stringify(state.filters));
}

function computeMetrics(tasks) {
  const metrics = {done:0, pending:0, in_progress:0, blocked:0, total:tasks.length, percent:0};
  for (const t of tasks) {
    metrics[t.estado] = (metrics[t.estado]||0)+1;
  }
  metrics.percent = metrics.total ? Math.round((metrics.done/metrics.total)*100) : 0;
  return metrics;
}

function sanitize(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function render() {
  // Filtros y búsqueda
  let filtered = state.tasks.filter(t =>
    (!state.filters.categoria || t.categoria === state.filters.categoria) &&
    (!state.filters.estado || t.estado === state.filters.estado) &&
    (!state.filters.search || t.titulo.toLowerCase().includes(state.filters.search.toLowerCase()))
  );
  // Métricas
  const m = computeMetrics(filtered);
  document.getElementById('count-done').textContent = m.done;
  document.getElementById('count-pending').textContent = m.pending;
  document.getElementById('count-total').textContent = m.total;
  // Barra de progreso
  const pb = document.getElementById('progressbar');
  const pbInner = document.getElementById('progressbar-inner');
  pb.setAttribute('aria-valuenow', m.percent);
  pbInner.style.width = m.percent+'%';
  // Filtros dinámicos
  const cats = [...new Set(state.tasks.map(t=>t.categoria))];
  const catSel = document.getElementById('filter-category');
  catSel.innerHTML = '<option value="">Todas</option>' + cats.map(c=>`<option value="${sanitize(c)}">${sanitize(c)}</option>`).join('');
  catSel.value = state.filters.categoria;
  document.getElementById('filter-status').value = state.filters.estado;
  document.getElementById('search').value = state.filters.search;
  // Render tareas
  const ul = document.getElementById('task-list');
  ul.innerHTML = '';
  for (const t of filtered) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.tabIndex = 0;
    li.innerHTML = `
      <div class="task-title">${sanitize(t.titulo)}</div>
      <div class="task-meta">
        <span>${sanitize(t.categoria)}</span>
        <span>${sanitize(t.estado)}</span>
        <span>${sanitize(t.impacto)}</span>
        <span>${sanitize(t.owner)}</span>
        <span>${sanitize(t.fecha)}</span>
      </div>
      <div class="task-notes">${sanitize(t.notas)}</div>
      <div class="task-actions">
        <button aria-label="Cambiar estado" data-id="${t.id}">${estadoIcono(t.estado)}</button>
      </div>
    `;
    ul.appendChild(li);
  }
}

function estadoIcono(estado) {
  switch(estado) {
    case 'pending': return '⏳';
    case 'in_progress': return '🔄';
    case 'done': return '✔️';
    case 'blocked': return '⛔';
    default: return '❓';
  }
}

function nextEstado(estado) {
  switch(estado) {
    case 'pending': return 'in_progress';
    case 'in_progress': return 'done';
    case 'done': return 'blocked';
    case 'blocked': return 'pending';
    default: return 'pending';
  }
}

function bindEvents() {
  document.getElementById('filter-category').addEventListener('change', e => {
    state.filters.categoria = e.target.value;
    saveLocal();
    render();
  });
  document.getElementById('filter-status').addEventListener('change', e => {
    state.filters.estado = e.target.value;
    saveLocal();
    render();
  });
  document.getElementById('search').addEventListener('input', e => {
    state.filters.search = e.target.value;
    saveLocal();
    render();
  });
  document.getElementById('task-list').addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
      const id = Number(e.target.dataset.id);
      const t = state.tasks.find(t=>t.id===id);
      if (t) {
        t.estado = nextEstado(t.estado);
        saveLocal();
        render();
      }
    }
  });
  // Atajos de teclado
  document.addEventListener('keydown', e => {
    if (e.key === 'f') document.getElementById('filter-category').focus();
    if (e.key === 's') document.getElementById('search').focus();
  });
}

function updateTimestamp() {
  const el = document.getElementById('timestamp');
  if (el) {
    el.textContent = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadLocal();
  render();
  bindEvents();
  updateTimestamp();
  setInterval(updateTimestamp, 60000);
});
