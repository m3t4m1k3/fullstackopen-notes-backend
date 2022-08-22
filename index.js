const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const Note = require("./models/note");
const { request, response } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

app.get("/", (_request, response) => {
  response.send("<h1>Notes App</h1>");
});

app.get("/api/notes", (_request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
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

const generatedId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;

  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const { content, important } = request.body;

  if (!content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content,
    important: important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then((_response) => {
      // Return 204 status for deleting both
      // objects that are present and missing
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  const { content, important } = request.body;
  const note = { content, important };

  Note.findByIdAndUpdate(id, note, { new: true })
    // 'new' param returns the updated not instead of the original
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler); // Must be last loaded middleware

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
