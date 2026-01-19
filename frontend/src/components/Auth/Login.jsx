import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-end gap-15 items-center">
      <div className="w-[520px] h-[220px] rounded-full bg-gray-300">
        <img className="w-full h-full object-cover" src="https://tse2.mm.bing.net/th/id/OIP.GtrbEmKuw31n3w0QbtI3TwHaDb?pid=Api&P=0&h=180" alt="" />
      </div>
      <form
        onSubmit={handleLogin}
        className="border-2 w-1/2 justify-center border-gray-300 flex flex-col gap-2 p-5 rounded-lg"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Login</h2>
          <input
            className="p-2 border-2 border-gray-300 rounded"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="p-2 border-2 border-gray-300 rounded"
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="p-2 border-2 active:scale-95 bg-blue-500 text-white rounded-lg "
            type="submit"
          >
            Log In
          </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
