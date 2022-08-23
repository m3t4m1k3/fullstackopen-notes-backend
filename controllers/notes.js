const notesRouter = require('express').Router();
const Note = require('../models/note');

// Create
notesRouter.post('/', (request, response, next) => {
  const { content, important } = request.body;

  const note = new Note({
    content,
    important: important || false,
    date: new Date(),
  });

  note.save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

// Read All
notesRouter.get('/', (_request, response) => {
  Note.find({})
    .then((notes) => {
      response.json(notes);
    });
});

// Read One
notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
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
notesRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params;

  Note.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
