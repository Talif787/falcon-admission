// backend/src/routes/chatRoutes.ts
import express from 'express';
import { ChatController } from '../controllers/chatController';

const router = express.Router();
const chatController = new ChatController();

// Initialize chat session
router.get('/:sessionId/init', chatController.initializeChat);

// Send message and get response
router.post('/:sessionId/message', chatController.sendMessage);

// Get chat history
router.get('/:sessionId/history', chatController.getChatHistory);

export default router;