const db = require('../config/db');

exports.createNote = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Note content is required' });
    }

    const [result] = await db.execute(
      'INSERT INTO notes (userId, content) VALUES (?, ?)',
      [req.user.id, content]
    );

    res.status(201).json({
      message: 'Note saved successfully',
      noteId: result.insertId
    });
  } catch (err) {
    console.error('Create note error:', err);
    res.status(500).json({ message: 'Failed to create note', error: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const [notes] = await db.execute(
      'SELECT * FROM notes WHERE userId = ? ORDER BY lastEdited DESC',
      [req.user.id]
    );

    res.json(notes);
  } catch (err) {
    console.error('Get notes error:', err);
    res.status(500).json({ message: 'Failed to fetch notes', error: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Note content is required' });
    }

    await db.execute(
      'UPDATE notes SET content = ?, lastEdited = NOW() WHERE id = ? AND userId = ?',
      [content, id, req.user.id]
    );

    res.json({ message: 'Note updated successfully' });
  } catch (err) {
    console.error('Update note error:', err);
    res.status(500).json({ message: 'Failed to update note', error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      'DELETE FROM notes WHERE id = ? AND userId = ?',
      [id, req.user.id]
    );

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ message: 'Failed to delete note', error: err.message });
  }
};

exports.shareNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { emailID } = req.body;

    if (!emailID) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if note exists and belongs to user
    const [notes] = await db.execute(
      'SELECT * FROM notes WHERE id = ? AND userId = ?',
      [id, req.user.id]
    );

    if (notes.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // In a real app, you would send an email or create a shared note record
    // For now, we'll just return success
    res.json({
      message: `Note shared with ${emailID}`,
      noteId: id
    });
  } catch (err) {
    console.error('Share note error:', err);
    res.status(500).json({ message: 'Failed to share note', error: err.message });
  }
};
