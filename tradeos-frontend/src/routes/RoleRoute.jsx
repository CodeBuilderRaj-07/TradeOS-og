import React from "react";

import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  getRole,
} from "@/services/tokenService";

function RoleRoute({
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

      <div className="flex min-h-screen items-center justify-center bg-background px-4">

        <div className="w-full max-w-md rounded-xl border border-destructive/10 bg-card/30 p-8 text-center backdrop-blur-2xl">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-lg bg-destructive/10">

            <span className="text-4xl">
              🚫
            </span>

          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-foreground">

            Access Denied

          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">

            You do not have permission
            to access this page.

          </p>

          <button
            onClick={() =>
              window.history.back()
            }
            className="mt-8 inline-flex h-14 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors"
          >

            Go Back

          </button>

        </div>

      </div>
    );
  }

  return children;
}

export default React.memo(
  RoleRoute
);