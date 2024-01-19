import logo from './logo.svg';
import './App.css';
import {useEffect, useRef, useState, useSyncExternalStore} from 'react'
import server from './server';
import { flushSync } from 'react-dom';
import userEvent from '@testing-library/user-event';


function App() {

  const [chat, setChat] = useState(false)
  const [nickName, setNickName] = useState("") // 로그인시 닉네임 저장
  const [msg, setMsg] = useState([])
  
  const input_ref=useRef("")
  const msg_ref=useRef("")
  const scroll_ref=useRef(0)
  // const nickname_ref=useRef("")

  function handleClick(){
    server.emit('login', input_ref.current.value)
    setChat(true)
  }

  function handleClick(){
    server.emit('login', input_ref.current.value)
    setChat(true)
    setNickName(input_ref.current.value)
  }

  function sendClick(){
    console.log(msg_ref.current.value)
    if(msg_ref.current.value != ""){
      let msgArray = [...msg]
      msgArray.push({level:"me", msg:msg_ref.current.value})
      setMsg(msgArray)
      server.emit('send', {nickName:nickName, msg:msg_ref.current.value }) // 메세지 전송시 닉네임 전송
    }
  }

  //메세지 전송시 엔터클릭
  function sendKeyClick(e){
    if(e.key == 'Enter'){
      sendClick()
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

    //메세지 전송후 인풋박스 클리어 + 나의 작성 메세지만 클리어
    if(msg_ref.current && msg[msg.length -1].level == "me"){ 
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
                  <div className='nickname_style'>{c.nickName}</div> {/* 메세지 보낸 사람 닉네임 표시 */}
                  <div className={c.level == "sys" ? 'chat_box_center' : "chat_box"}>{c.msg}</div>
                </div>
            })
            }
          </div>

        <div>
          <input ref={msg_ref} onKeyPress={sendKeyClick}></input> {/*메세지 엔터클릭*/}
          <button onClick={sendClick}>send</button>
        </div>

      </div>
      }
    </div>
  );
}

export default App;