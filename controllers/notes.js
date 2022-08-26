const notesRouter = require('express').Router();
const Note = require('../models/note');

// Create
notesRouter.post('/', async (request, response) => {
  const { content, important } = request.body;

  const note = new Note({
    content,
    important: important || false,
    date: new Date(),
  });

  const savedNote = await note.save();
  response.status(201).json(savedNote);
});

// Read All
notesRouter.get('/', async (_request, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

// Read One
notesRouter.get('/:id', async (request, response) => {
  const note = Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// Update
notesRouter.put('/:id', (request, response, next) => {
  const { id } = request.params;
  const { content, important } = request.body;
  const note = { content, important };

  Note.findByIdAndUpdate(id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

// Delete
notesRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  await Note.findByIdAndRemove(id);
  response.status(204).end();
});

module.exports = notesRouter;
