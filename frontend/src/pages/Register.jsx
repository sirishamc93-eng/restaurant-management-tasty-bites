import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const response =
        await API.post("/auth/register", {
          name,
          email,
          password
        });

      login(response.data);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-orange-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="mb-2 text-3xl font-black">
          Create Account
        </h1>

        <p className="mb-8 text-gray-500">
          Join TastyBite today
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <label className="mb-2 block font-medium">
          Name
        </label>

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="mb-5 w-full rounded-xl border p-3"
          required
        />

        <label className="mb-2 block font-medium">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="mb-5 w-full rounded-xl border p-3"
          required
        />

        <label className="mb-2 block font-medium">
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="mb-6 w-full rounded-xl border p-3"
          minLength="6"
          required
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-orange-600 py-3 font-bold text-white"
        >
          Register
        </button>

        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-orange-600"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;