import Datastore from 'nedb-promise';
import { Todo } from './todo.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../data/todos.db');

export class TodoStore {
    constructor(db) {
        this.db = db || new Datastore({ filename: dbPath, autoload: true });
    }

    async add(dueDate, title, description, importance, finished) {
        return this.db.insert(new Todo(dueDate, title, description, importance, finished));
    }

    async delete(id) {
        const numRemoved = await this.db.remove({ _id: id }, {});
        return numRemoved;
    }

    async get(id) {
        return this.db.findOne({ _id: id });
    }

    async update(id, todo) {
        await this.db.update({ _id: id }, { $set: todo });
        return this.get(id);
    }

    async all() {
        const todos = await this.db.cfind({}).sort({ dueDate: 1 }).exec();
        return todos;
    }
}

export const todoStore = new TodoStore();