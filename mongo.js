const mongoose = require('mongoose');

// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  );
  // eslint-disable-next-line no-undef
  process.exit(1);
}

// eslint-disable-next-line no-undef
const password = process.argv[2];

const url = `mongodb+srv://fullstackopen2022:${password}@cluster0.0lsbdjb.mongodb.net/noteApp?retryWrites=true&w=majority`;

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

mongoose.connect(url).then(() => {
  console.log('connected');

  //   const note = new Note({
  //     content: "HTML is Easy",
  //     date: new Date(),
  //     important: true,
  //   });

  //   return note.save();
  // })
  // .then(() => {
  //   console.log("note saved!");
  //   return mongoose.connection.close();
  // })
  Note.find({})
    .then((result) => {
      result.forEach((note) => {
        console.log(note);
      });
      mongoose.connection.close();
    })
    .catch((err) => console.log(err));
});
