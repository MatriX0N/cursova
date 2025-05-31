import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

function Login() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <button onClick={() => loginWithRedirect()}>
        Увійти
      </button>
    )
  );
}

export default Login;