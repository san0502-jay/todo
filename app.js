const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const count = document.querySelector('#todo-count');
const clearDoneButton = document.querySelector('#clear-done');
const filterButtons = [...document.querySelectorAll('.filter')];
const template = document.querySelector('#todo-item-template');
const themeToggle = document.querySelector('#theme-toggle');
const moonIcon = document.querySelector('#icon-moon');
const sunIcon = document.querySelector('#icon-sun');
const progressFill = document.querySelector('#progress-fill');
const progressLabel = document.querySelector('#progress-label');
const progressDetail = document.querySelector('#progress-detail');
const progressbar = document.querySelector('#progressbar');

const STORAGE_KEY = 'easy-breezy-todos';
const THEME_KEY = 'easy-breezy-theme';

let filter = 'all';
let todos = loadTodos();
let theme = loadTheme();

function createId() {
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.randomUUID === 'function'
  ) {
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
  return globalThis.matchMedia && globalThis.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(nextTheme) {
  theme = nextTheme;
  document.body.dataset.theme = nextTheme;
  const dark = nextTheme === 'dark';
  moonIcon.hidden = dark;
  sunIcon.hidden = !dark;
  themeToggle.setAttribute(
    'aria-label',
    nextTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
  );
  safeSetStorageItem(THEME_KEY, nextTheme);
}

function loadTodos() {
  try {
    const parsed = JSON.parse(safeGetStorageItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((todo) => ({
        id: typeof todo.id === 'string' && todo.id ? todo.id : createId(),
        text: String(todo.text || '').trim(),
        done: Boolean(todo.done),
      }))
      .filter((todo) => todo.text.length > 0);
  } catch {
    return [];
  }
}

function saveTodos() {
  safeSetStorageItem(STORAGE_KEY, JSON.stringify(todos));
}

function filteredTodos() {
  if (filter === 'active') return todos.filter((todo) => !todo.done);
  if (filter === 'done') return todos.filter((todo) => todo.done);
  return todos;
}

function renderProgress() {
  const total = todos.length;
  const done = todos.filter((todo) => todo.done).length;
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

  progressFill.style.width = `${percentage}%`;
  progressLabel.textContent = `${percentage}% calm progress`;
  progressDetail.textContent = `${done} of ${total} done`;
  progressbar.setAttribute('aria-valuenow', String(percentage));
}

function render() {
  list.innerHTML = '';

  filteredTodos().forEach((todo) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const checkbox = node.querySelector('input');
    const text = node.querySelector('.text');
    const deleteButton = node.querySelector('.delete');

    node.dataset.id = todo.id;
    text.textContent = todo.text;
    checkbox.checked = todo.done;
    node.classList.toggle('done', todo.done);

    checkbox.addEventListener('change', () => {
      toggleTodo(todo.id);
    });

    deleteButton.addEventListener('click', () => {
      removeTodo(todo.id);
    });

    list.append(node);
  });

  const left = todos.filter((todo) => !todo.done).length;
  count.textContent = `${left} task${left === 1 ? '' : 's'} left`;

  filterButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.filter === filter);
  });

  renderProgress();
}

function addTodo(text) {
  todos.unshift({ id: createId(), text, done: false });
  saveTodos();
  render();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : todo,
  );
  saveTodos();
  render();
}

function removeTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  form.reset();
  input.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    render();
  });
});

clearDoneButton.addEventListener('click', () => {
  const hasDone = todos.some((todo) => todo.done);
  if (!hasDone) return;
  todos = todos.filter((todo) => !todo.done);
  saveTodos();
  render();
});

themeToggle.addEventListener('click', () => {
  applyTheme(theme === 'dark' ? 'light' : 'dark');
});

applyTheme(theme);
render();
