const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const dueInput = document.querySelector('#todo-due');
const priorityInput = document.querySelector('#todo-priority');
const submitButton = document.querySelector('#submit-button');
const list = document.querySelector('#todo-list');
const count = document.querySelector('#todo-count');
const clearCompletedButton = document.querySelector('#clear-completed');
const filterButtons = [...document.querySelectorAll('.filter')];
const emptyState = document.querySelector('#empty-state');
const template = document.querySelector('#todo-item-template');
const themeToggle = document.querySelector('#theme-toggle');
const moonIcon = document.querySelector('#icon-moon');
const sunIcon = document.querySelector('#icon-sun');
const progressFill = document.querySelector('#progress-fill');
const progressLabel = document.querySelector('#progress-label');
const progressPercent = document.querySelector('#progress-percent');
const progressbar = document.querySelector('#progressbar');

const STORAGE_KEY = 'easy-breezy-todos';
const THEME_KEY = 'easy-breezy-theme';

let filter = 'all';
let editingId = null;
let todos = loadTodos();
let theme = loadTheme();

function createId() {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeGetStorageItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorageItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures (private mode / disabled storage)
  }
}

function loadTheme() {
  const savedTheme = safeGetStorageItem(THEME_KEY);
  if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(nextTheme) {
  theme = nextTheme;
  document.body.dataset.theme = nextTheme;
  const dark = nextTheme === 'dark';
  moonIcon.hidden = dark;
  sunIcon.hidden = !dark;
  themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  safeSetStorageItem(THEME_KEY, nextTheme);
}

function normalizePriority(value) {
  if (value === 'high' || value === 'medium' || value === 'low') return value;
  return 'medium';
}

function loadTodos() {
  try {
    const parsed = JSON.parse(safeGetStorageItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((todo) => ({
        id: typeof todo.id === 'string' && todo.id ? todo.id : createId(),
        text: String(todo.text || '').trim(),
        dueDate: typeof todo.dueDate === 'string' ? todo.dueDate : '',
        priority: normalizePriority(todo.priority),
        completed: Boolean(todo.completed || todo.done),
      }))
      .filter((todo) => todo.text.length > 0);
  } catch {
    return [];
  }
}

function saveTodos() {
  safeSetStorageItem(STORAGE_KEY, JSON.stringify(todos));
}

function getFilteredTodos() {
  if (filter === 'active') return todos.filter((todo) => !todo.completed);
  if (filter === 'completed') return todos.filter((todo) => todo.completed);
  return todos;
}

function formatDueDate(dateString) {
  if (!dateString) return 'No due date';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 'No due date';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderProgress() {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressLabel.textContent = `${completed}/${total} completed`;
  progressPercent.textContent = `${percentage}%`;
  progressFill.style.width = `${percentage}%`;
  progressbar.setAttribute('aria-valuenow', String(percentage));
}

function resetFormState() {
  editingId = null;
  form.reset();
  priorityInput.value = 'medium';
  submitButton.textContent = 'Add';
  input.focus();
}

function startEdit(todo) {
  editingId = todo.id;
  input.value = todo.text;
  dueInput.value = todo.dueDate;
  priorityInput.value = todo.priority;
  submitButton.textContent = 'Save';
  input.focus();
}

function render() {
  list.innerHTML = '';
  const filteredTodos = getFilteredTodos();
  emptyState.hidden = filteredTodos.length > 0;

  filteredTodos.forEach((todo) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const checkbox = node.querySelector('input');
    const text = node.querySelector('.text');
    const due = node.querySelector('.due');
    const priorityBadge = node.querySelector('.priority-badge');
    const editButton = node.querySelector('.edit');
    const deleteButton = node.querySelector('.delete');

    node.dataset.id = todo.id;
    checkbox.checked = todo.completed;
    text.textContent = todo.text;
    due.textContent = formatDueDate(todo.dueDate);
    priorityBadge.textContent = todo.priority;
    priorityBadge.dataset.priority = todo.priority;
    node.classList.toggle('completed', todo.completed);

    checkbox.addEventListener('change', () => toggleTodo(todo.id));
    editButton.addEventListener('click', () => startEdit(todo));
    deleteButton.addEventListener('click', () => removeTodo(todo.id));

    list.append(node);
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  count.textContent = `${activeCount} active task${activeCount === 1 ? '' : 's'}`;

  filterButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.filter === filter);
  });

  renderProgress();
}

function addTodo(text, dueDate, priority) {
  todos.unshift({ id: createId(), text, dueDate, priority, completed: false });
  saveTodos();
  render();
}

function updateTodo(id, text, dueDate, priority) {
  todos = todos.map((todo) => (todo.id === id ? { ...todo, text, dueDate, priority } : todo));
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  saveTodos();
  render();
}

function removeTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  if (editingId === id) resetFormState();
  saveTodos();
  render();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const dueDate = dueInput.value;
  const priority = normalizePriority(priorityInput.value);

  if (editingId) {
    updateTodo(editingId, text, dueDate, priority);
  } else {
    addTodo(text, dueDate, priority);
  }

  resetFormState();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    render();
  });
});

clearCompletedButton.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
});

themeToggle.addEventListener('click', () => {
  applyTheme(theme === 'dark' ? 'light' : 'dark');
});

applyTheme(theme);
render();


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
