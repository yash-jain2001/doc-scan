import React, { useEffect, useState } from "react";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Header from "./components/Header";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase/firebase";
import UploadFile from "./components/upload/UploadFile";
import Gallary from "./components/Gallary";


const App = () => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshGallery, setRefreshGallery] = useState(false);



  useEffect(() => {
    fetch("https://healthcheck-hkc6n3274a-uc.a.run.app")
      .then((res) => res.json())
      .then((data) => {
        // setMessage(data.message);
        console.log(data);
      })
      .catch((err) => {
        // setMessage("Backend not reachable");
        console.log("Backend not reachable", err);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (CurrentUser) => {
      setUser(CurrentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logOutHandler = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      <Header />
      <div className="flex flex-col gap-5 px-20">
        {user ? (
          <>
            <div className="flex border-t hover:border border-b rounded-lg shadow-lg border-black items-center justify-between p-5">
              <p className="text-lg font-semibold">Logged in as <br /><span>👨</span> <span className="font-semibold underline text-xl">{user.email}</span></p>
              <button
                className="bg-red-500 hover:bg-red-600   text-white px-5 py-2 rounded"
                onClick={logOutHandler}
              >
                Logout
              </button>
            </div>
            <div>
              <UploadFile  onUploadSuccess={() => setRefreshGallery(prev => !prev)}/>
            </div>
            <div>
              <Gallary refresh={refreshGallery}/>
            </div>
          </>
        ) : (
          <>
            <Register />
            <Login />
          </>
        )}
      </div>
            

    </div>
  );
};

export default App;
