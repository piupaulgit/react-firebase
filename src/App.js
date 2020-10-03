import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyA7AIlbN7eMPG3l3rY7-4WEgo-izLdJq3U",
  authDomain: "realtime-chat-20a33.firebaseapp.com",
  databaseURL: "https://realtime-chat-20a33.firebaseio.com",
  projectId: "realtime-chat-20a33",
  storageBucket: "realtime-chat-20a33.appspot.com",
  messagingSenderId: "363476402445",
  appId: "1:363476402445:web:dd9281a264fc9b9a8e3044",
  measurementId: "G-BSX00T1HXT",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <section className="bg-warning justify-content-center p-3 d-flex">
        {user ? <ChatRoom></ChatRoom> : <SignIn></SignIn>}
      </section>
    </div>
  );
}

const SignIn = () => {
  const SignInWithGoogle = () => {
    const provioder = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provioder);
  };
  return (
    <div className="chat-content">
      <h3 className="text-dark text-uppercase mb-4">Welcome to SuperChat</h3>
      <button className="btn btn-light" onClick={SignInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
};

const ChatRoom = () => {
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const dummy = useRef();
  const signOut = () => {
    return (
      auth.currentUser && (
        <button className="btn btn-sign" onClick={() => auth.signOut()}>
          Sign out
        </button>
      )
    );
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="chat-content justify-content-between p-0">
      <div className="chat-header bg-dark text-left py-2  px-3 d-flex justify-content-between aling-items-center">
        <p className="m-0 align-self-center">SuperChat</p>
        {signOut()}
      </div>
      <div className="message-body">
        <div className="chat-holder">
          {messages &&
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg}></ChatMessage>
            ))}
          <div ref={dummy}></div>
        </div>
      </div>
      <div className="send-msg-box bg-light p-3">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            className="form-control"
            placeholder="Type Message..."
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          ></input>
          <svg
            type="submit"
            role="button"
            onClick={sendMessage}
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            className="bi bi-arrow-right-square-fill"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm2.5 8.5a.5.5 0 0 1 0-1h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5z"
            />
          </svg>
        </form>
      </div>
    </div>
  );
};

const ChatMessage = (props) => {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="user photo"></img>
      <p>{text}</p>
    </div>
  );
};
export default App;
