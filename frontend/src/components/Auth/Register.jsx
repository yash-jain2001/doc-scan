import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center gap-15">
      <form
        onSubmit={handleRegister}
        className="border-2 w-1/2 justify-center border-gray-300 flex flex-col gap-2 p-5 rounded-lg"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Register</h2>
          <input
            className="p-2 border-2 border-gray-300 rounded"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="p-2 border-2 border-gray-300 rounded"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="p-2 border-2 active:scale-95 bg-green-500 text-white rounded-lg"
            type="submit"
          >
            Sign Up
          </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <div className="w-[520px] h-[220px] rounded-full bg-gray-300">
        <img className="w-full h-full object-cover" src="https://tse2.mm.bing.net/th/id/OIP.M-Xrl0hHEqEF7eom1F8bAQHaDZ?pid=Api&P=0&h=180" alt="" />
      </div>
    </div>
  );
};

export default Register;
