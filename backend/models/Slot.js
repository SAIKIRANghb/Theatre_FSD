// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// // Define the Slot schema
// const slotSchema = new Schema({
//   movie: { type: Schema.Types.ObjectId, ref: 'Movie', default: null },
//   theatre: { type: Schema.Types.ObjectId, ref: 'Theatre', default: null },
//   time: { type: String, required: true },
//   date: { type: Date, required: true },
//   screen: { type: Schema.Types.ObjectId, ref: 'Screen', default: null },
//   selectedSeats: { type: [String], default: [] }
// });

// // Create the Slot model
// const Slot = mongoose.model('Slot', slotSchema);

// module.exports = Slot;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Slot schema
const slotSchema = new Schema({
  movie: { type: Schema.Types.ObjectId, ref: 'Movie', default: null },
  theatre: { type: Schema.Types.ObjectId, ref: 'Theatre', default: null },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  screen: { type: Schema.Types.ObjectId, ref: 'Screen', default: null },
  selectedSeats: { type: [String], default: [] },
  classPrices: [
    {
      classNo: { type: Number, required: true }, // Corresponds to the classNo in Screen
      className: { type: String, required: true }, // Corresponds to the className in Screen
      price: { type: Number, required: true } // Price for this class
    }
  ]
});

// Create the Slot model
const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;
