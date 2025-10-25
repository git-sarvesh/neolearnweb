const express = require('express');
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  shareNote
} = require('../controllers/notesController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createNote);
router.get('/', auth, getNotes);
router.put('/:id', auth, updateNote);
router.delete('/:id', auth, deleteNote);
router.post('/share/:id', auth, shareNote);

module.exports = router;

