const express = require("express");
const { bookRooms } = require("./bookingLogic");

const cors = require("cors");

const {
  hotel,
  occupied,
  getAvailableRooms,
  resetAll,
  randomOccupy
} = require("./bookingLogic");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// check server
app.get("/", (req, res) => {
  res.send("Hotel Reservation Server Running");
});

// get available rooms
app.get("/rooms", (req, res) => {
  res.json({
    hotel,
    occupied: Array.from(occupied),
    available: getAvailableRooms()
  });
});

// reset
app.post("/reset", (req, res) => {
  resetAll();
  res.json({ message: "All bookings reset" });
});

// random occupancy
app.post("/random", (req, res) => {
  randomOccupy();
  res.json({
    message: "Random occupancy generated",
    occupied: Array.from(occupied)
  });
});
// booking API
app.post("/book", (req, res) => {
  const { count } = req.body;

  let result = bookRooms(count);
  res.json(result);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
