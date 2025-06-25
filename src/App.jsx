import React, { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:5050"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName,setRoomName]=useState("");
  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };
  const roomhandle=(e)=>{
    e.preventDefault();
    socket.emit("room",roomName);
    setRoomName("");
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connnected", socket.id);
      setSocketID(socket.id);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });
    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((message) => [...message, data]);
    });
    // socket.emit("room,message", { room, message });
    // socket.on("room,message", (data) => {
    //   console.log("broadcast received", data);
    // });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h6" component="div" gutterBottom>
        welcome to Socket.io
      </Typography>

      <Typography>{socketId}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="message "
          varient="outlined"
        ></TextField>
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="room "
          varient="outlined"
        ></TextField>
        <Button variant="contained" type="submit" color="primary">
          Send
        </Button>
      </form>


      <form onClick={roomhandle}>
        <h5>Enter Room name</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="message "
          varient="outlined"
        ></TextField>

         <Button variant="contained" type="submit" color="primary">
          join
        </Button>
      </form>

      <Stack>
        {messages.map((msg, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {msg}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};
export default App;
