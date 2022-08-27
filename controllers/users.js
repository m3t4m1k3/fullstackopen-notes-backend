const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

// Create
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  // Check that username does not already exist
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique',
    });
  }

  // Could also check that:
  // - username is min length
  // - username is permitted chars only
  // - password is strong enough

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

// Read All
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1,
  });

  response.json(users);
});

module.exports = usersRouter;
