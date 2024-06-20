/* global Handlebars */
import { getRelativeDate } from './utils.js';
import TodoController from './controllers/todo-controller.js';

Handlebars.registerHelper('relativeDate', (dateString) => getRelativeDate(dateString));

document.addEventListener('DOMContentLoaded', () => {
    TodoController.init();
});
