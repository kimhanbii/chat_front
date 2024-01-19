import {io} from 'socket.io-client'
const server = io('http://localhost:3001')
// const server = io('https://chat-server-lris.onrender.com')
export default server