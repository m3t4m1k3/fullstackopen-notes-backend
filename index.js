const express = require('express');
const cors = require('cors');

require('dotenv').config();

const Note = require('./models/note');

const app = express();

// Middleware
app.use(express.static('build'));
app.use(express.json());
app.use(cors());

// Root
app.get('/', (_request, response) => {
  response.send('<h1>Notes App</h1>');
});

// Create
app.post('/api/notes', (request, response, next) => {
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
app.get('/api/notes', (_request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// Read One
app.get('/api/notes/:id', (request, response, next) => {
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
app.put('api/notes/:id', (request, response, next) => {
  const { content, important } = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

// Delete
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then((deletedNote) => {
      if (deletedNote) {
        response.status(204).end();
      } else {
        response.status(404).send({ error: 'id not found on server' });
      }
    })
    .catch((error) => next(error));
});

const errorHandler = (error, _request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler); // Must be last loaded middleware

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
