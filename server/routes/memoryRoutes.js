const express = require('express');
const {
  getMemories,
  getMemory,
  createMemory,
  updateMemory,
  deleteMemory,
  exportMemories
} = require('../controllers/memoryController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/memories - Get all memories with optional search and filter
// Query params: ?query=xyz&filter=tag
router.get('/', getMemories);

// GET /api/memories/search - Search endpoint (alias for the query params above)
router.get('/search', getMemories);

// GET /api/memories/export - Export memories as CSV
router.get('/export', exportMemories);

// GET /api/memories/:id - Get single memory
router.get('/:id', getMemory);

// POST /api/memories - Create new memory
router.post('/', createMemory);

// PUT /api/memories/:id - Update memory
router.put('/:id', updateMemory);

// DELETE /api/memories/:id - Delete memory
router.delete('/:id', deleteMemory);

module.exports = router; 