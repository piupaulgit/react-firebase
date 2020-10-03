import React from "react";
const SignIn = () => {
  const SignInWithGoogle = () => {
    const provioder = new firebase.auth.GoogleAuthProvider();
  };
  return (
    <div>
      <button className="btn btn-primary" onClick={SignInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
};

export default SignIn;
