import logo from './logo.svg';
import './App.css';
import {useEffect, useRef, useState} from 'react'
import server from './server';


function App() {

  const [chat, setChat] = useState(false)
  const [msg, setMsg] = useState([])
  
  const input_ref=useRef("")
  const msg_ref=useRef("")
  const scroll_ref=useRef(0)

  function handleClick(){
    server.emit('login', input_ref.current.value)
    setChat(true)
  }

  function sendClick(){
    console.log(msg_ref.current.value)
    if(msg_ref.current.value != ""){
      let msgArray = [...msg]
      msgArray.push({level:"me", msg:msg_ref.current.value})
      setMsg(msgArray)
      server.emit('send', msg_ref.current.value)
    }
  }
  
  useEffect(()=>{
    if(scroll_ref.current){ 
      scroll_ref.current.scrollTop = scroll_ref.current.scrollHeight
    }
    server.on('msg', (data)=>{
      let msgArray = [...msg]
      msgArray.push(data)
      setMsg(msgArray)
    })
    if(msg_ref.current){ 
      msg_ref.current.value = ""
    }
  },[msg])


  return (
  
    <div className='app'>

      {
      !chat ? 
      
        <div className="id">
          ID 입력<div><input ref={input_ref}></input></div>
          <button onClick={handleClick}>Login</button>
        </div> 
      : 
        <div className="ct">

          <div ref={scroll_ref} className='m'>
            {msg.map(c=>{
              return <div className='chat_boxox'
                style={{
                  justifyContent: c.level == "sys" ? "center" : c.level == "" ? "start" : "end" }}>
                  <div className={c.level == "sys" ? 'chat_box_center' : "chat_box"}>{c.msg}</div>
                </div>
            })
            }
          </div>

        <div>
          <input ref={msg_ref}></input>
          <button onClick={sendClick}>send</button>
        </div>

      </div>
      }
    </div>
  );
}

export default App;