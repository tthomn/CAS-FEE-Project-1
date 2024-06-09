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
        this.checkDatabase();
    }

    async checkDatabase() {
        const count = await this.db.count({});
    }

    async add(duedate, title, description, importance, finished) {
        return this.db.insert(new Todo(duedate, title, description, importance, finished));
    }

    async delete(id) {
        const numRemoved = await this.db.remove({ _id: id }, {});
        return numRemoved;
    }

    async get(id) {
        console.log(`Fetching todo with id: ${id}`);
        return this.db.findOne({ _id: id });
    }

    async update(id, todo) {
        console.log(`Updating todo with id: ${id}`, todo);
        const existingTodo = await this.get(id);
        if (!existingTodo) {
            throw new Error(`Todo with id ${id} not found`);
        }
        const updatedTodo = {
            ...existingTodo,
            ...todo
        };
        await this.db.update({ _id: id }, { $set: updatedTodo });
        return this.get(id);
    }

    async all() {
        console.log('Fetching all todos');
        const todos = await this.db.cfind({}).sort({ duedate: +1 }).exec();
        console.log('Fetched todos:', todos);
        return todos;
    }
}

export const todoStore = new TodoStore();
