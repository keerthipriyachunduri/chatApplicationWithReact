import React, {useState,useEffect} from 'react';
import './chat.css';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../infobar/infobar';
import Input from '../input/input';
import Messages from '../messages/messages';
import TextContainer from '../textContainer/textContainer';


let socket;


const Chat = ({location}) =>{

    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [message,setMessage] = useState('');
    const [messages,setMessages] = useState([]);
    const [users,setUsers] = useState('');

    const url = 'localhost:5000';
    

    useEffect(()=>{
    const {name,room} = queryString.parse(location.search);
    socket = io(url);
    setName(name);
    setRoom(room);
    
    socket.emit('join',{name,room},(error)=>{
        if(error){
            alert(error);
            
        }
    });
    return ()=>{
        socket.emit('disconnect');
        socket.off();
    }
    },[url,location.search]);

    useEffect(() =>{
        socket.on('message',(message)=>{
            setMessages([...messages,message]);


        })

    },[messages])

    useEffect(()=>{

        socket.on('roomData',({users})=>{
            setUsers(users)
            
        })

    },[users],room);

    const sendMessage = (event) =>{
        event.preventDefault();
        if(message){
            socket.emit('sendMessage',message,()=>{
                setMessage('');
            });
        }
    }
    console.log(message,messages);
    return(
        <div className="outerContainer">
            <div className="container">
            <InfoBar room={room}/>
            <Messages messages={messages} name={name}/>
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            
            <TextContainer users={users}/>
        </div>
    )
}
export default Chat;