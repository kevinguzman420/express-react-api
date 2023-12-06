import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function LoginPage() {
  const {
    signin,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    errors: signinErrors,
  } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    const data = signin(values);
    if (data) {
      setUser(data);
      setIsAuthenticated(true);
      // navigate("/tasks");
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/tasks");
  }, [isAuthenticated]);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)] ">
      <div className=" bg-zinc-800 max-w-md w-full p-10 rounded-md">
        {signinErrors.map((error, i) => (
          <div className="bg-red-500 p-2 text-white" key={i}>
            {error}
          </div>
        ))}
        <h1 className=" text-2xl font-bold ">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            {...register("email", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500">Email is required</p>}
          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500">Password is required</p>
          )}
          <button
            type="submit"
            className="bg-sky-500 text-white px-4 py-2 rounded-md my-2"
          >
            Login
          </button>
        </form>
        <p className=" flex gap-x-2 justify-between ">
          Don't have an account?{" "}
          <Link to="/register" className=" text-sky-500 ">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
