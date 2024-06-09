import express from 'express';
import { todoController } from '../controllers/todo-controller.js';

const router = express.Router();

router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.get('/:id', todoController.getTodo);
router.delete('/:id', todoController.deleteTodo);
router.put('/:id', todoController.updateTodo);

export const todoRoutes = router;
