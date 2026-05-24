import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  getRole,
} from "@/services/tokenService";

export default function RoleRoute({
  children,
  allowedRoles = [],
}) {

  const location =
    useLocation();

  const role =
    getRole();

  /* No Role */
  if (!role) {

    return (

      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  /* Access Denied */
  if (
    !allowedRoles.includes(
      role
    )
  ) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-[#050816] px-4">

        <div className="w-full max-w-md rounded-[32px] border border-red-500/10 bg-white/[0.03] p-8 text-center backdrop-blur-2xl">

          {/* Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10">

            <span className="text-4xl">

              🚫

            </span>

          </div>

          {/* Heading */}
          <h1 className="mt-6 text-3xl font-black tracking-tight text-white">

            Access Denied

          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">

            You do not have permission
            to access this page.

          </p>

          {/* Button */}
          <button
            onClick={() =>
              window.history.back()
            }
            className="mt-8 inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(37,99,235,0.25)]"
          >

            Go Back

          </button>

        </div>

      </div>
    );
  }

  return children;
}