import { validateImportance } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
    const toggleModeBtn = document.getElementById('toggle-mode-btn');
    toggleModeBtn.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');
    });

    const todosTemplateSource = document.getElementById('todo-template').innerHTML;
    const todosTemplate = Handlebars.compile(todosTemplateSource);

    const todosContainer = document.querySelector('[data-list]');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const saveTodoBtn = document.getElementById('save-todo-btn');
    const todoFormView = document.getElementById('todo-form-view');
    const notesListView = document.getElementById('notes-list-view');
    const todoForm = document.getElementById('todo-form');

    const importanceInput = document.getElementById('todo-importance');
    const importanceError = document.getElementById('importance-error');

    let todos = [];

    addTodoBtn.addEventListener('click', () => {
        todoForm.reset();
        todoFormView.classList.remove('hidden');
        notesListView.classList.add('hidden');
    });

    saveTodoBtn.addEventListener('click', (event) => {
        const importanceValidation = validateImportance(importanceInput.value);
        if (!importanceValidation.isValid) {
            importanceError.textContent = importanceValidation.errorMessage;
            importanceError.classList.remove('hidden');
            event.preventDefault();
            return;
        } else {
            importanceError.classList.add('hidden');
        }

        const todo = {
            id: new Date().getTime().toString(),
            title: document.getElementById('todo-title').value,
            importance: parseInt(importanceInput.value, 10),
            duedate: {
                text: document.getElementById('todo-due-date').value
            },
            finished: document.getElementById('todo-finished').checked,
            description: document.getElementById('todo-description').value
        };

        todos.push(todo);
        renderTodos();
        todoFormView.classList.add('hidden');
        notesListView.classList.remove('hidden');
    });

    function renderTodos() {
        todosContainer.innerHTML = todos.map(task => todosTemplate(task)).join('');
    }

    importanceInput.addEventListener('input', () => {
        const importanceValidation = validateImportance(importanceInput.value);
        if (!importanceValidation.isValid) {
            importanceError.textContent = importanceValidation.errorMessage;
            importanceError.classList.remove('hidden');
        } else {
            importanceError.classList.add('hidden');
        }
    });
});
