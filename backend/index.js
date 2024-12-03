const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5001;

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://saikiransuguru:7eYEmWV5Nmzrn24m@cluster0.sbi4o.mongodb.net/TheatreDB?retryWrites=true&w=majority&appName=Cluster0",{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const theatreController = require('./controllers/theatreController');
const screenController = require('./controllers/screenController');
const movieController = require('./controllers/movieController');
const slotController = require('./controllers/slotController');
const userController = require('./controllers/userController');

const Booking = require('./models/Booking');
const Screen = require('./models/Screen');
const Slot = require('./models/Slot');
app.use(bodyParser.json());
app.use(express.json());
// Enable CORS for all routes
app.use(cors());
// Theatre routes
app.post('/theatres', theatreController.createTheatre);
app.get('/theatres', theatreController.getTheatres);
app.get('/theatres/:id', theatreController.getTheatre);
app.put('/theatres/:id', theatreController.updateTheatre);
app.delete('/theatres/:id', theatreController.deleteTheatre);
app.get('/theatres/name/:name', theatreController.getTheatreByName);

// Screen routes
app.post('/screens', screenController.createScreen);
app.get('/screens', screenController.getScreens);
app.get('/screensQuery', screenController.getScreensByQuery);

app.get('/screensbyNo', screenController.getScreenByNo);
app.get('/screens/:id', screenController.getScreenById);

app.put('/screens/:id', screenController.updateScreen);
app.delete('/screens/:id', screenController.deleteScreen);

// Movie routes
app.post('/movies', movieController.createMovie);
app.get('/movies', movieController.getMovies); //replace by getMovieByTheatre
app.get('/moviesQuery', movieController.getMoviesByQuery); 
app.get('/movies/:id', movieController.getMovie);
app.put('/movies/:id', movieController.updateMovie);
app.delete('/movies/:id', movieController.deleteMovie);

app.get('/moviesByTS',movieController.getMoviesByTS);
app.get('/moviesByTheatre', movieController.getMoviesByTheatre);
app.get('/movies/name/:name', movieController.getMovieByName);

// Slot routes
app.post('/slots', slotController.createSlot);
app.get('/slotsQuery', slotController.getSlotsbyQuery);
app.get('/slots',slotController.getSlots);
app.get('/slots/:id', slotController.getSlot);
app.put('/slots/:id', slotController.updateSlot);
app.delete('/slots/:id', slotController.deleteSlot);

//User routes

app.post('/user', userController.createUser);
app.get('/user', userController.getUsers);
app.get('/user/:id', userController.getUserById);
app.put('/user/:id', userController.updateUser);
app.delete('/:id', userController.deleteUser);


app.post('/book', async (req, res) => {
  try {
    const { movieId, theatreId, screenId, timeSlot, date, selectedSeats, selectedSeatCodeMap, totalPrice, userId,screenNo ,theatrename} = req.body;
    console.log(req.body)
    const slot = await Slot.findOne({ movie: movieId, theatre: theatreId, screen: screenId, date, time: timeSlot });
    // console.log(slot)
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    const isAvailable = selectedSeats.every(seat => !slot.selectedSeats.includes(seat));
    if (!isAvailable) {
      return res.status(400).json({ error: 'Some seats are already booked' });
    }

    slot.selectedSeats.push(...selectedSeats);
    const slots= await slot.save();
    

    const booking = new Booking({
      user: userId,
      movie: movieId,
      theatre: theatreId,
      screen: screenId,
      date,
      timeSlot: timeSlot,
      selectedSeats,
      selectedSeatCodeMap: selectedSeatCodeMap,
      totalPrice,
      screenNo,
      theatrename:theatrename
    });

    const bookings = await booking.save();

    res.status(200).json({ message: 'Booking successful', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Booking failed' });
  }
});

module.exports = app;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
