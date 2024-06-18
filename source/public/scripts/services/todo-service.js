import { httpService } from './http-service.js';
import { compareDueDates } from '../utils.js';

export class TodoService {
    constructor() {
        this.sortOrderMethod = null;
        this.sortDirectionAsc = true;
        this.isFilterShowFinishedActive = true;
    }

    async createTodo(title, description, importance, dueDate, finished, createdDate) {
        return httpService.ajax('POST', '/todos', { title, description, importance, dueDate, finished, createdDate });
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

    setSortByDueDate() {
        this.sortOrderMethod = 'sortByDueDate';
    }

    setSortByCreationDate() {
        this.sortOrderMethod = 'sortByCreationDate';
    }

    setSortByImportance() {
        this.sortOrderMethod = 'sortByImportance';
    }

    setSortByName() {
        this.sortOrderMethod = 'sortByName';
    }

    async applySortOrder(todos) {
        todos = this.filterFinishedNotes(todos);
        if (this.sortOrderMethod) {
            todos = this[this.sortOrderMethod](todos);
        }
        return todos;
    }

    sortByDueDate(todos) {
        todos.sort((a, b) => compareDueDates(a, b, this.sortDirectionAsc));
        return todos;
    }

    sortByCreationDate(todos) {
        todos.sort((a, b) => this.sortDirectionAsc ? new Date(a.createdDate) - new Date(b.createdDate) : new Date(b.createdDate) - new Date(a.createdDate));
        return todos;
    }

    sortByImportance(todos) {
        todos.sort((a, b) => this.sortDirectionAsc ? b.importance - a.importance : a.importance - b.importance);
        return todos;
    }

    sortByName(todos) {
        todos.sort((a, b) => {
            if (a.title.toLowerCase() < b.title.toLowerCase()) return this.sortDirectionAsc ? 1 : -1;
            if (a.title.toLowerCase() > b.title.toLowerCase()) return this.sortDirectionAsc ? -1 : 1;
            return 0;
        });
        return this.filterFinishedNotes(todos);
    }

    filterFinishedNotes(todos) {
        return this.isFilterShowFinishedActive ? todos : todos.filter(todo => !todo.finished);
    }

    toggleFilterShowFinished() {
        this.isFilterShowFinishedActive = !this.isFilterShowFinishedActive;
    }

    setSortDirectionAsc(asc) {
        this.sortDirectionAsc = asc;
    }
}

export const todoService = new TodoService();

export default TodoService;

