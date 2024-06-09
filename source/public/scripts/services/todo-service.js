import { httpService } from './http-service.js';

export class TodoService {
    async createTodo({ title, content, importance, dueDate, finished }) {
        return httpService.ajax('POST', '/todos', { title, content, importance, dueDate, finished });
    }

    async getTodos() {
        return httpService.ajax('GET', '/todos');
    }

    async getTodoById(todoId) {
        return httpService.ajax('GET', `/todos/${todoId}`);
    }

    async updateTodo(todoId, todoData) {
        return httpService.ajax('PATCH', `/todos/${todoId}`, todoData);
    }

    async deleteTodoById(todoId) {
        return httpService.ajax('DELETE', `/todos/${todoId}`);
    }

    async fetchAndSortTodos(sortMethod) {
        const todos = await this.getTodos();
        todos.sort(sortMethod);
        return todos;
    }

    sortByDueDate(todos) {
        return todos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    sortByCreationDate(todos) {
        return todos.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));
    }

    sortByImportance(todos) {
        return todos.sort((a, b) => b.importance - a.importance);
    }

    filterFinishedNotes(todos, showFinished) {
        return showFinished ? todos.filter(todo => !todo.finished) : todos;
    }
}

export const todoService = new TodoService();
