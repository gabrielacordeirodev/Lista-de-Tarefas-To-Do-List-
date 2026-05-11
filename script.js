let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all';

// Adiciona tarefa ao pressionar Enter
document.getElementById('taskInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) {
    input.focus();
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 400);
    return;
  }

  const task = {
    id: Date.now(),
    text,
    done: false,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(task);
  saveTasks();
  input.value = '';
  input.focus();
  render();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  if (item) {
    item.classList.add('removing');
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      render();
    }, 200);
  }
}

function clearDone() {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  render();
}

function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

function getFiltered() {
  if (currentFilter === 'pending') return tasks.filter(t => !t.done);
  if (currentFilter === 'done')    return tasks.filter(t => t.done);
  return tasks;
}

function render() {
  const list      = document.getElementById('taskList');
  const empty     = document.getElementById('emptyState');
  const footer    = document.getElementById('footer');
  const counter   = document.getElementById('counter');
  const filtered  = getFiltered();
  const doneCount = tasks.filter(t => t.done).length;
  const total     = tasks.length;

  // Contador
  counter.textContent = total === 0
    ? '0 tarefas'
    : `${total - doneCount} pendente${total - doneCount !== 1 ? 's' : ''} · ${doneCount} concluída${doneCount !== 1 ? 's' : ''}`;

  // Lista
  list.innerHTML = '';

  if (filtered.length === 0) {
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item${task.done ? ' done' : ''}`;
      li.setAttribute('data-id', task.id);

      li.innerHTML = `
        <button class="checkbox" onclick="toggleTask(${task.id})" title="Marcar como ${task.done ? 'pendente' : 'concluída'}">
          <span class="check-icon">✓</span>
        </button>
        <span class="task-text">${escapeHtml(task.text)}</span>
        <button class="delete-btn" onclick="deleteTask(${task.id})" title="Deletar">✕</button>
      `;

      list.appendChild(li);
    });
  }

  // Botão limpar concluídas
  footer.style.display = doneCount > 0 ? 'block' : 'none';
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Inicializa
render();
