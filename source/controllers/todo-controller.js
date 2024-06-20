import { todoStore } from "../services/todoStore.js";

export class TodoController {
    async getTodos(req, res) {
        const todos = await todoStore.all();
        res.json(todos);
    }

    async getTodo(req, res) {
        const todo = await todoStore.get(req.params.id);
        res.json(todo);
    }

    async createTodo(req, res) {
        const { dueDate, title, description, importance, finished } = req.body;
        const newTodo = await todoStore.add(dueDate, title, description, importance, finished);
        res.json(newTodo);
    }

    async deleteTodo(req, res) {
        const numRemoved = await todoStore.delete(req.params.id);
        if (numRemoved === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
       return res.json({ message: 'Todo successfully deleted', _id: req.params.id });
    }

    async updateTodo(req, res) {
        const existingTodo = await todoStore.get(req.params.id);
        if (!existingTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        const updatedTodo = {
            ...existingTodo,
            ...req.body,
            createdDate: existingTodo.createdDate
        };

        const result = await todoStore.update(req.params.id, updatedTodo);
        return res.json(result);
    }
}

export const todoController = new TodoController();
