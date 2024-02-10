import { signIn } from "next-auth/react";
import Link from "next/link";
import React from "react";
import GoogleIcon from "~/components/icons/GoogleIcon";
import LogoIcon from "~/components/icons/LogoIcon";

type Props = {};

const Login = (props: Props) => {
  return (
    <div className="flex h-screen w-full items-center">
      <div className="md:w-1/2">
        <LogoIcon className="mx-auto h-1/2 max-h-[380px]" />
      </div>
      <div className="mx-auto md:mx-0 ">
        <h1 className="mb-8 text-3xl font-bold">Sign in to X.</h1>
        <div className="w-[300px]">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="my-3 flex h-10 w-full items-center justify-center rounded-full border border-gray-300 active:bg-gray-300 "
          >
            <GoogleIcon className="h-5 w-5" />
            <span className="ml-1 font-semibold">Sign in with Google</span>
          </button>
          <span className="block text-center">or</span>
          <form>
            <input
              className="mt-3 block w-full rounded-sm border border-gray-300 px-1 py-2"
              type="text"
              placeholder="Phone, email, or username"
            />
            <button
              onClick={() => alert("Not implemented")}
              className="my-3 block h-9 w-full rounded-full bg-black font-semibold text-white"
            >
              Next
            </button>
          </form>
          <button
            type="button"
            onClick={() => alert("Not implemented")}
            className="my-3 h-9 w-full rounded-full  border border-gray-300 font-semibold active:bg-gray-300"
          >
            Forgot password?
          </button>
          {/* <span>
            By signing in you agree to the Terms of Service and Privacy Policy,
            including Cookie Use.
          </span> */}

          <span className="mt-10 block">
            Don't have an account?{" "}
            <Link
              href={"/auth/signup"}
              className="text-blue-500 hover:underline"
            >
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
