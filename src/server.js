import {io} from 'socket.io-client'
const server = io('https://chat-server-lris.onrender.com')
export default server