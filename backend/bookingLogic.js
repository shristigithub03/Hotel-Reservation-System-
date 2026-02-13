// Create hotel rooms automatically

let hotel = {};        // floor wise rooms
let occupied = new Set();  // occupied rooms

// generate rooms
for (let floor = 1; floor <= 10; floor++) {
  hotel[floor] = [];

  if (floor === 10) {
    for (let r = 1; r <= 7; r++) {
      hotel[floor].push(1000 + r);
    }
  } else {
    for (let r = 1; r <= 10; r++) {
      hotel[floor].push(floor * 100 + r);
    }
  }
}

// function to get available rooms
function getAvailableRooms() {
  let available = {};

  for (let floor in hotel) {
    available[floor] = hotel[floor].filter(r => !occupied.has(r));
  }

  return available;
}

// reset booking
function resetAll() {
  occupied.clear();
}

// random occupancy
function randomOccupy() {
  occupied.clear();

  for (let floor in hotel) {
    hotel[floor].forEach(room => {
      if (Math.random() < 0.3) {   // 30% random occupied
        occupied.add(room);
      }
    });
  }
}

module.exports = {
  hotel,
  occupied,
  getAvailableRooms,
  resetAll,
  randomOccupy
};
// calculate travel time between two rooms
function calculateTravelTime(room1, room2) {
  let floor1 = Math.floor(room1 / 100);
  let floor2 = Math.floor(room2 / 100);

  let vertical = Math.abs(floor1 - floor2) * 2;
  let horizontal = Math.abs((room1 % 100) - (room2 % 100));

  return vertical + horizontal;
}

// find best rooms
function bookRooms(count) {
  if (count > 5) {
    return { error: "Cannot book more than 5 rooms" };
  }

  let available = getAvailableRooms();
  let bestSelection = [];
  let minTime = Infinity;

  // 1️⃣ SAME FLOOR PRIORITY
  for (let floor in available) {
    if (available[floor].length >= count) {
      let rooms = available[floor].slice(0, count);

      let time = calculateTravelTime(rooms[0], rooms[rooms.length - 1]);

      if (time < minTime) {
        minTime = time;
        bestSelection = rooms;
      }
    }
  }

  // 2️⃣ IF NOT FOUND SAME FLOOR → CROSS FLOOR
  if (bestSelection.length === 0) {
    let allAvailable = [];

    for (let floor in available) {
      allAvailable.push(...available[floor]);
    }

    // try combinations
    for (let i = 0; i < allAvailable.length; i++) {
      let temp = [allAvailable[i]];

      for (let j = i + 1; j < allAvailable.length && temp.length < count; j++) {
        temp.push(allAvailable[j]);
      }

      if (temp.length === count) {
        let time = calculateTravelTime(temp[0], temp[temp.length - 1]);

        if (time < minTime) {
          minTime = time;
          bestSelection = temp;
        }
      }
    }
  }

  // mark occupied
  bestSelection.forEach(r => occupied.add(r));

  return {
    bookedRooms: bestSelection,
    totalTravelTime: minTime
  };
}

module.exports.bookRooms = bookRooms;
