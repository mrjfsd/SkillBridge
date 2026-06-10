// PATH: resume-builder/server/routes/roadmapRoutes.js
import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { generateRoadmap } from '../controllers/roadmapController.js';

const router = express.Router();

// POST /api/roadmap
router.post('/', protect, generateRoadmap);

export default router;
