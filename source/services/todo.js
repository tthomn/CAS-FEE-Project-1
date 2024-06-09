export class Todo {
    constructor(dueDate, title, description, importance, finished) {
        this.dueDate = dueDate ? new Date(dueDate).toISOString().slice(0, 10) : null;
        this.title = title;
        this.description = description;
        this.importance = importance;
        this.finished = finished;
        this.createdDate = new Date().toISOString();
    }
}

export default Todo;


