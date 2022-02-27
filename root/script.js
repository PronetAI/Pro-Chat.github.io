const CLIENT_ID = 'hdDBhnIzCtbO5jIG';
var status = "Active";
const drone = new ScaleDrone(CLIENT_ID, {
  data: {
    name: getRandomName(),
    color: getRandomColor(),},});
let members = [];
drone.on('open', error => {
  if (error) {
    return console.error(error);}
  const room = drone.subscribe('observable-room');
  room.on('open', error => {
    if (error) {
      return console.error(error);}});
  room.on('members', m => {
    members = m;
    updateMembersDOM();});
  room.on('member_join', member => {
    members.push(member);
    updateMembersDOM();});
  room.on('member_leave', ({id}) => {
    const index = members.findIndex(member => member.id === id);
    members.splice(index, 1);
    updateMembersDOM();});
  room.on('data', (text, member) => {
    if (member) {
      addMessageToListDOM(text, member);
    } else {}});});
drone.on('close', event => {});
drone.on('error', error => {
  console.error(error);});
function getRandomName() {
    var person = prompt("Please enter your name", "");
    var status = prompt("Please enter your status(Active/Idle/Away)", "");
    var radios = document.getElementsByName('choice');
    var val= "";
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
          val = radios[i].value; 
          break;
        }
    }
    if (person != null) {
        return (
        person+" : "+status
        );
    }}
const room = drone.subscribe('awesome-historical-room', {
  historyCount: 5
});
room.on('history_message', message => console.log(message));
function getRandomColor() {
  return '#000000';}
const DOM = {
  membersCount: document.querySelector('.members-count'),
  membersList: document.querySelector('.members-list'),
  messages: document.querySelector('.messages'),
  input: document.querySelector('.message-form__input'),
  form: document.querySelector('.message-form'),};
DOM.form.addEventListener('submit', sendMessage);
function sendMessage() {
  const value = DOM.input.value;
  if (value === '') {
    return;}
  DOM.input.value = '';
  drone.publish({
    room: 'observable-room',
    message: value,});}
function createMemberElement(member) {
  const { name, color } = member.clientData;
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(name));
  el.className = 'member';
  el.style.color = color;
  return el;}
function updateMembersDOM() {
  DOM.membersCount.innerText = `${members.length} user(s) in room:`;
  DOM.membersList.innerHTML = '';
  members.forEach(member =>
    DOM.membersList.appendChild(createMemberElement(member)));}
function createMessageElement(text, member) {
  const el = document.createElement('div');
  el.appendChild(createMemberElement(member));
  el.appendChild(document.createTextNode(text));
  el.className = 'message';
  return el;}
function addMessageToListDOM(text, member) {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;}}
