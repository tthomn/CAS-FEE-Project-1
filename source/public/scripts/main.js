import { getRelativeDate } from './utils.js';
import TodoController from './controllers/todo-controller.js';

Handlebars.registerHelper('relativeDate', function(dateString) {
    return getRelativeDate(dateString);
});

document.addEventListener('DOMContentLoaded', () => {
    TodoController.init();
});
