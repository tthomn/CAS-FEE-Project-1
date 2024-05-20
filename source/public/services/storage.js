import Datastore from 'nedb-promise';

class Storage {
    constructor() {
        this.db = new Datastore({ filename: './data/todos.db', autoload: true });
    }

    async getAll() {
        const todos = await this.db.find({});
        return todos;
    }

    async getById(id) {
        const todo = await this.db.findOne({ _id: id });
        return todo;
    }

    async save(todo) {
        if (todo._id) {
            await this.db.update({ _id: todo._id }, todo);
            return todo;
        } else {
            const newTodo = await this.db.insert(todo);
            return newTodo;
        }
    }

    async delete(id) {
        const numDeleted = await this.db.remove({ _id: id });
        return numDeleted;
    }
}

export const todoStorage = new Storage();
