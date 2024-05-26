import { validateImportance } from '../utils.js';
import TodoService from '../model/todo-service.js';

const todoService = new TodoService();

const TodoController = {
    init() {
        console.log('Initializing TodoController...');

        this.toggleModeBtn = document.getElementById('toggle-mode-btn');
        this.toggleModeBtn.addEventListener('click', this.toggleMode.bind(this));

        const todosTemplateSource = document.getElementById('todo-template').innerHTML;
        this.todosTemplate = Handlebars.compile(todosTemplateSource);

        this.todosContainer = document.querySelector('[data-list]');
        this.addTodoBtn = document.getElementById('add-todo-btn');
        this.saveTodoBtn = document.getElementById('save-todo-btn');
        this.updateTodoBtn = document.getElementById('update-overview-btn');
        this.todoFormView = document.getElementById('todo-form-view');
        this.notesListView = document.getElementById('notes-list-view');
        this.todoForm = document.getElementById('todo-form');
        this.filterCompletedBtn = document.querySelector('.sort-btn:nth-child(5)');

        this.importanceInput = document.getElementById('todo-importance');
        this.importanceError = document.getElementById('importance-error');
        this.dueDateInput = document.getElementById('todo-due-date');

        this.todos = todoService.getTodos();
        this.currentTodoId = null;
        this.showCompleted = true;
        console.log('Todos loaded:', this.todos);

        this.addTodoBtn.addEventListener('click', () => {
            console.log('Add Todo button clicked');
            this.todoForm.reset();
            this.saveTodoBtn.style.display = 'block';
            this.updateTodoBtn.style.display = 'none';
            this.todoFormView.classList.remove('hidden');
            this.notesListView.classList.add('hidden');
        });

        this.saveTodoBtn.addEventListener('click', (event) => {
            console.log('Save Todo button clicked');
            this.handleTodoSaveOrUpdate(event, 'save');
        });

        this.updateTodoBtn.addEventListener('click', (event) => {
            console.log('Update Todo button clicked');
            this.handleTodoSaveOrUpdate(event, 'update');
        });

        this.importanceInput.addEventListener('input', () => {
            const importanceValidation = validateImportance(this.importanceInput.value);
            if (!importanceValidation.isValid) {
                console.log('Importance input validation failed:', importanceValidation.errorMessage);
                this.importanceError.textContent = importanceValidation.errorMessage;
                this.importanceError.classList.remove('hidden');
            } else {
                this.importanceError.classList.add('hidden');
            }
        });

        this.todosContainer.addEventListener('click', (event) => {
            if (event.target.matches('[data-list-btn-edit]')) {
                console.log('Edit Todo button clicked');
                const todoId = event.target.id;
                const todo = this.todos.find(t => t.id === todoId);
                if (todo) {
                    this.currentTodoId = todoId;
                    document.getElementById('todo-title').value = todo.title;
                    document.getElementById('todo-importance').value = todo.importance;
                    document.getElementById('todo-due-date').value = todo.duedate.text;
                    document.getElementById('todo-finished').checked = todo.finished;
                    document.getElementById('todo-description').value = todo.description;
                    this.saveTodoBtn.style.display = 'none';
                    this.updateTodoBtn.style.display = 'block';
                    this.todoFormView.classList.remove('hidden');
                    this.notesListView.classList.add('hidden');
                }
            }
        });

        this.filterCompletedBtn.addEventListener('click', () => {
            this.showCompleted = !this.showCompleted;
            this.renderTodos();
        });

        this.renderTodos();
    },

    toggleMode() {
        console.log('Toggle mode button clicked');
        document.body.classList.toggle('dark-theme');
    },

    handleTodoSaveOrUpdate(event, action) {
        const importanceValidation = validateImportance(this.importanceInput.value);
        if (!importanceValidation.isValid) {
            console.log('Importance validation failed:', importanceValidation.errorMessage);
            this.importanceError.textContent = importanceValidation.errorMessage;
            this.importanceError.classList.remove('hidden');
            event.preventDefault();
            return;
        } else {
            this.importanceError.classList.add('hidden');
        }

        const todo = {
            id: action === 'save' ? new Date().getTime().toString() : this.currentTodoId,
            title: document.getElementById('todo-title').value,
            importance: parseInt(this.importanceInput.value, 10),
            duedate: {
                text: this.dueDateInput.value || null
            },
            daysLeft: this.calculateDaysLeft(this.dueDateInput.value),
            finished: document.getElementById('todo-finished').checked,
            description: document.getElementById('todo-description').value
        };

        if (action === 'save') {
            console.log('Adding todo:', todo);
            todoService.addTodo(todo);
            this.todos.push(todo);
        } else {
            console.log('Updating todo:', todo);
            todoService.updateTodo(todo);
            const index = this.todos.findIndex(t => t.id === this.currentTodoId);
            if (index !== -1) {
                this.todos[index] = todo;
            }
        }
        this.renderTodos();
        this.todoFormView.classList.add('hidden');
        this.notesListView.classList.remove('hidden');
    },

    renderTodos() {
        console.log('Rendering todos:', this.todos);
        const filteredTodos = this.todos.filter(todo => this.showCompleted || !todo.finished);
        this.todosContainer.innerHTML = filteredTodos.map(todo => this.todosTemplate(todo)).join('');
    },

    calculateDaysLeft(dueDate) {
        if (!dueDate) {
            return "Someday";
        }
        const due = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const timeDiff = due - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysLeft;
    }
};

export default TodoController;
