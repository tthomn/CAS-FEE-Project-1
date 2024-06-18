import { todoService } from '../services/todo-service.js';
import { getRelativeDate } from '../utils.js';

const TodoController = {
    async init() {
        this.cacheDomElements();
        this.registerHandlebarsHelpers();
        this.setupEventListeners();
        await this.loadTodos();
        this.renderTodos();
    },

    cacheDomElements() {
        this.todosTemplate = Handlebars.compile(document.getElementById('todo-template').innerHTML);
        this.toggleModeBtn = document.getElementById('toggle-mode-btn');
        this.todosContainer = document.querySelector('[data-list]');
        this.addTodoBtn = document.getElementById('add-todo-btn');
        this.saveTodoBtn = document.getElementById('save-todo-btn');
        this.updateTodoBtn = document.getElementById('update-todo-btn');
        this.todoFormView = document.getElementById('todo-form-view');
        this.notesListView = document.getElementById('notes-list-view');
        this.todoForm = document.getElementById('todo-form');
        this.importanceInput = document.getElementById('todo-importance');
        this.dueDateInput = document.getElementById('todo-due-date');
        this.titleInput = document.getElementById('todo-title');
        this.descriptionInput = document.getElementById('todo-description');
        this.finishedCheckbox = document.getElementById('todo-finished');
        this.cancelTodoBtn = document.getElementById('cancel-todo-btn');
        this.filterCompletedBtn = document.querySelector('.sort-btn[data-filter="completed"]');
        this.sortByDueDateBtn = document.querySelector('.sort-btn[data-sort="dueDate"]');
        this.sortByNameBtn = document.querySelector('.sort-btn[data-sort="name"]');
        this.sortByCreationDateBtn = document.querySelector('.sort-btn[data-sort="creationDate"]');
        this.sortByImportanceBtn = document.querySelector('.sort-btn[data-sort="importance"]');
    },

    registerHandlebarsHelpers() {
        Handlebars.registerHelper('renderImportance', function (text, count) {
            let result = '';
            for (let i = 0; i < count; i++) {
                result += text;
            }
            return new Handlebars.SafeString(result);
        });

        Handlebars.registerHelper('relativeDate', function (dateString) {
            return getRelativeDate(dateString);
        });
    },

    setupEventListeners() {
        this.toggleModeBtn.addEventListener('click', this.toggleMode.bind(this));
        this.addTodoBtn.addEventListener('click', this.showAddTodoForm.bind(this));
        this.saveTodoBtn.addEventListener('click', (event) => this.handleTodoSaveOrUpdate(event, 'save'));
        this.updateTodoBtn.addEventListener('click', (event) => this.handleTodoSaveOrUpdate(event, 'update'));
        this.todosContainer.addEventListener('click', this.handleEditButtonClick.bind(this));
        this.cancelTodoBtn.addEventListener('click', this.handleCancelTodo.bind(this));
        this.filterCompletedBtn.addEventListener('click', this.handleFilterCompleted.bind(this));
        this.sortByDueDateBtn.addEventListener('click', this.handleSortByDueDate.bind(this));
        this.sortByNameBtn.addEventListener('click', this.handleSortByName.bind(this));
        this.sortByCreationDateBtn.addEventListener('click', this.handleSortByCreationDate.bind(this));
        this.sortByImportanceBtn.addEventListener('click', this.handleSortByImportance.bind(this));
        this.addTodoBtn.addEventListener('click', this.showAddTodoForm.bind(this));
    },

    async loadTodos() {
        try {
            this.todos = await todoService.getTodos();
            console.log('Fetched todos:', this.todos);
        } catch (error) {
            console.error('Failed to load todos:', error);
            this.todos = [];
        }
    },

    toggleMode() {
        document.body.classList.toggle('dark-theme');
    },

    handleSortByDueDate() {
        todoService.setSortByDueDate();
        this.toggleSortDirection();
        this.renderTodos();
        this.updateSortButtons(this.sortByDueDateBtn);
    },

    handleSortByName() {
        todoService.setSortByName();
        this.toggleSortDirection();
        this.renderTodos();
        this.updateSortButtons(this.sortByNameBtn);
    },

    handleSortByCreationDate() {
        todoService.setSortByCreationDate();
        this.toggleSortDirection();
        this.renderTodos();
        this.updateSortButtons(this.sortByCreationDateBtn);
    },

    handleSortByImportance() {
        todoService.setSortByImportance();
        this.toggleSortDirection();
        this.renderTodos();
        this.updateSortButtons(this.sortByImportanceBtn);
    },

    toggleSortDirection() {
        todoService.setSortDirectionAsc(!todoService.sortDirectionAsc);
    },

    updateSortButtons(activeButton) {
        const sortButtons = document.querySelectorAll('.sort-btn');
        sortButtons.forEach(button => button.classList.remove('active'));
        activeButton.classList.add('active');

        const sortDirectionArrow = todoService.sortDirectionAsc ? '↓' : '↑';

        const buttonTextMap = {
            sortByDueDateBtn: 'By Due Date',
            sortByNameBtn: 'Name',
            sortByImportanceBtn: 'Importance',
            sortByCreationDateBtn: 'By Creation Date'
        };

        for (const button in buttonTextMap) {
            if (this[button] === activeButton) {
                this[button].innerHTML = `${buttonTextMap[button]} ${sortDirectionArrow}`;
            } else {
                this[button].innerHTML = buttonTextMap[button];
            }
        }

        this.updateFilterButton();
    },

    updateFilterButton() {
        if (todoService.isFilterShowFinishedActive) {
            this.filterCompletedBtn.classList.remove('active');
        } else {
            this.filterCompletedBtn.classList.add('active');
        }
    },

    async renderTodos() {
        console.log('Rendering todos:', this.todos);
        let todosToRender = this.todos;

        todosToRender = await todoService.applySortOrder(todosToRender);

        if (!todoService.isFilterShowFinishedActive) {
            todosToRender = todosToRender.filter(todo => !todo.finished);
        }

        const todosHtml = this.todosTemplate({todos: todosToRender});
        this.todosContainer.innerHTML = todosHtml;
    },

    showAddTodoForm() {
        this.todoForm.reset();
        this.saveTodoBtn.style.display = 'block';
        this.updateTodoBtn.style.display = 'none';
        this.todoFormView.classList.remove('hidden');
        this.notesListView.classList.add('hidden');
        this.currentTodoId = null;
    },

    handleCancelTodo() {
        this.todoForm.reset();
        this.todoFormView.classList.add('hidden');
        this.notesListView.classList.remove('hidden');
        this.currentTodoId = null;
    },

    async handleFilterCompleted() {
        todoService.toggleFilterShowFinished();
        await this.loadTodos();
        this.renderTodos();
        this.updateFilterButton();
    },

    handleEditButtonClick(event) {
        if (event.target.matches('[data-list-btn-edit]')) {
            const todoId = event.target.getAttribute('data-id');
            this.populateTodoForm(todoId);
        }
    },

    async populateTodoForm(todoId) {
        try {
            const todo = await todoService.getTodoById(todoId);
            if (todo) {
                console.log('Fetched todo for editing:', todo);
                this.currentTodoId = todo._id;
                this.titleInput.value = todo.title || '';
                this.importanceInput.value = todo.importance || 1;
                this.dueDateInput.value = todo.dueDate ? todo.dueDate.split('T')[0] : '';
                this.finishedCheckbox.checked = todo.finished || false;
                this.descriptionInput.value = todo.description || '';

                this.saveTodoBtn.style.display = 'none';
                this.updateTodoBtn.style.display = 'block';
                this.todoFormView.classList.remove('hidden');
                this.notesListView.classList.add('hidden');
            } else {
                console.error('Todo not found for editing:', todoId);
            }
        } catch (error) {
            console.error('Failed to fetch todo for editing:', error);
        }
    },

    async handleTodoSaveOrUpdate(event, action) {
        event.preventDefault();

        if (!this.todoForm.checkValidity()) {
            this.todoForm.reportValidity();
            return;
        }

        const existingTodo = this.todos.find(t => t._id === this.currentTodoId);

        const todo = {
            title: this.titleInput.value,
            importance: parseInt(this.importanceInput.value, 10),
            dueDate: this.dueDateInput.value || null,
            finished: document.getElementById('todo-finished').checked,
            description: this.descriptionInput.value,
            createdDate: action === 'save' ? new Date().toISOString() : existingTodo ? existingTodo.createdDate : new Date().toISOString()
        };

        try {
            if (action === 'save') {
                const newTodo = await todoService.createTodo(todo.title, todo.description, todo.importance, todo.dueDate, todo.finished);
                this.todos.push(newTodo);
            } else {
                console.log('Updating todo with ID:', this.currentTodoId, 'with data:', todo);
                await todoService.updateTodo(this.currentTodoId, todo);

                const index = this.todos.findIndex(t => t._id === this.currentTodoId);
                if (index !== -1) {
                    this.todos[index] = {...this.todos[index], ...todo};
                }
            }
            await this.loadTodos();
            this.renderTodos();
            this.todoFormView.classList.add('hidden');
            this.notesListView.classList.remove('hidden');
            this.currentTodoId = null;
        } catch (error) {
            console.error('Failed to save/update todo:', error);
        }
    }
};

    export default TodoController;