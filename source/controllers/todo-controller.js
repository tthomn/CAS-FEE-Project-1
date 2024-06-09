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
        const { duedate, title, description, importance, finished } = req.body;
        const newTodo = await todoStore.add(duedate, title, description, importance, finished);
        res.json(newTodo);
    }

    async deleteTodo(req, res) {
        const numRemoved = await todoStore.delete(req.params.id);
        if (numRemoved === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Todo successfully deleted', _id: req.params.id });
    }

    async updateTodo(req, res) {
        const updatedTodo = await todoStore.update(req.params.id, req.body);
        res.json(updatedTodo);
    }
}

export const todoController = new TodoController();








