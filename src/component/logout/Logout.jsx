import { useAuth0 } from "@auth0/auth0-react";
import React from 'react'

function Logout() {
    const {logOut, isAuthenticade} = useAuth0();
  return (
    isAuthenticade && (
        <button onClick={() => logOut()}>
             Вийти
        </button>
    )
  )
}

export default Logout