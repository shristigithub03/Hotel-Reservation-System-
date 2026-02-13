const API="https://hotel-reservation-system-uk05.onrender.com";
let lastBooked=[];

/* ---------------- AUTH SYSTEM ---------------- */

// check if already logged in
window.onload = function(){
  let user = localStorage.getItem("hotelUser");
  if(user){
    document.getElementById("loginPage").style.display="none";
    document.getElementById("signupPage").style.display="none";
    document.getElementById("dashboard").style.display="block";
    loadRooms();
  }
};

// show signup page
function showSignup(){
  document.getElementById("loginPage").style.display="none";
  document.getElementById("signupPage").style.display="flex";
}

// show login page
function showLogin(){
  document.getElementById("signupPage").style.display="none";
  document.getElementById("loginPage").style.display="flex";
}

// signup
function signup(){
  let user=document.getElementById("signupUser").value;
  let pass=document.getElementById("signupPass").value;

  if(!user || !pass){
    alert("Enter username & password");
    return;
  }

  localStorage.setItem("hotelUser",user);
  localStorage.setItem("hotelPass",pass);

  alert("Signup successful! Please login");
  showLogin();
}

// login
function login(){
  let user=document.getElementById("loginUser").value;
  let pass=document.getElementById("loginPass").value;

  let savedUser=localStorage.getItem("hotelUser");
  let savedPass=localStorage.getItem("hotelPass");

  if(user===savedUser && pass===savedPass){
    document.getElementById("loginPage").style.display="none";
    document.getElementById("signupPage").style.display="none";
    document.getElementById("dashboard").style.display="block";
    loadRooms();
  }else{
    alert("Invalid login");
  }
}

/* ---------------- LOADER ---------------- */

function showLoader(){
  document.getElementById("loader").classList.remove("hidden");
}
function hideLoader(){
  document.getElementById("loader").classList.add("hidden");
}

/* ---------------- TOAST ---------------- */

function showToast(msg,color="#00c853"){
  let t=document.getElementById("toast");
  t.innerText=msg;
  t.style.background=color;
  t.classList.remove("hidden");
  setTimeout(()=>t.classList.add("hidden"),2500);
}

/* ---------------- HISTORY ---------------- */

function addHistory(rooms){
  let li=document.createElement("li");
  li.innerText="Booked: "+rooms.join(", ");
  document.getElementById("historyList").prepend(li);
}

/* ---------------- LOAD ROOMS ---------------- */

async function loadRooms(){
  let res=await fetch(`${API}/rooms`);
  let data=await res.json();

  drawHotel(data.hotel,data.occupied);
  document.getElementById("occupiedCount").innerHTML=
    "Occupied: "+data.occupied.length;
}

/* ---------------- DRAW HOTEL ---------------- */

function drawHotel(hotel,occupied){
  const container=document.getElementById("hotel");
  container.innerHTML="";

  for(let floor=10;floor>=1;floor--){
    let floorDiv=document.createElement("div");
    floorDiv.className="floor";

    let label=document.createElement("div");
    label.innerHTML=`<b>Floor ${floor}</b>`;
    label.style.color="white";
    floorDiv.appendChild(label);

    hotel[floor].forEach(room=>{
      let div=document.createElement("div");
      div.className="room";
      div.innerText=room;

      if(occupied.includes(room)) div.classList.add("occupied");
      if(lastBooked.includes(room)) div.classList.add("booked");

      floorDiv.appendChild(div);
    });

    container.appendChild(floorDiv);
  }
}

/* ---------------- BOOK ROOMS ---------------- */

async function bookRooms(){
  let count=document.getElementById("roomCount").value;
  if(!count) return showToast("Enter number of rooms","red");

  showLoader();

  let res=await fetch(`${API}/book`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({count:Number(count)})
  });

  let data=await res.json();
  hideLoader();

  if(data.error){
    showToast(data.error,"red");
    return;
  }

  lastBooked=data.bookedRooms;

  document.getElementById("result").innerHTML=
  `Booked Rooms: ${data.bookedRooms}<br>
   Travel Time: ${data.totalTravelTime} min`;

  showToast("Rooms booked successfully ✅");
  addHistory(data.bookedRooms);
  loadRooms();
}

/* ---------------- RANDOM ---------------- */

async function randomOccupancy(){
  showLoader();
  await fetch(`${API}/random`,{method:"POST"});
  hideLoader();
  showToast("Random occupancy generated 🎲","#ff9800");
  loadRooms();
}

/* ---------------- RESET ---------------- */

async function reset(){
  showLoader();
  await fetch(`${API}/reset`,{method:"POST"});
  hideLoader();
  lastBooked=[];
  showToast("Hotel reset done ♻","#ff3d00");
  document.getElementById("historyList").innerHTML="";
  loadRooms();
}