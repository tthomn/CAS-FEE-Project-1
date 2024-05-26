const STORAGE_KEY = 'todos';

class TodoService {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    getTodos(orderBy, filterBy) {
        let todos = [].concat(this.todos);
        return todos;
    }

    addTodo(todo) {
        this.todos.push(todo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
    }

    updateTodo(todo) {
        let index = this.todos.findIndex(function(todo) {
            return todo.id === todo.id;
        });
        if (index !== -1) {
            this.todos[index] = todo;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
        }
    }

    getTodoById(id) {
        return this.todos.find(function(todo) {
            return todo.id === id;
        });
    }
}

export default TodoService;
