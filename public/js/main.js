
const chatForm = document.getElementById('chat-form')
const socket = io()
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from url
const {username, room} =Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

//message from server
socket.on('message', message=>{
    console.log(message)
    outputMessage(message)

    //Scroll
})

//Join chat room

socket.emit('joinRoom',{username,room})


//get room and user
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});
//Message submit

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const msg = e.target.elements.msg.value

    //emiting a message to server
    socket.emit('chatMessage',msg)

    // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

//Output message to DOM

function outputMessage(message) {
    const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.userName;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

//add room name to DOM
// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
