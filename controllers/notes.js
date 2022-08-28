const notesRouter = require('express').Router();
const config = require('../utils/config');
const Note = require('../models/note');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

// Create
notesRouter.post('/', async (request, response) => {
  const { content, important } = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, config.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const note = new Note({
    content,
    important: important || false,
    date: new Date(),
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  response.status(201).json(savedNote);
});

// Read All
notesRouter.get('/', async (_request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 });

  response.json(notes);
});

// Read One
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// Update
notesRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { content, important } = request.body;

  const updatedNote = await Note.findByIdAndUpdate(
    id,
    {
      content,
      important,
    },
    { new: true }
  );

  response.json(updatedNote);
});

// Delete
notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = notesRouter;
