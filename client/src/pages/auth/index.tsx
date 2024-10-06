import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export const Auth = () => {
  return (
    <div className="sign-in-container">
      <SignedOut>
        <SignUpButton mode="modal"/> //modal means to create SignIn in the same page
        <SignInButton mode="modal"/>
      </SignedOut>
      <SignedIn>
        <Navigate to="/" />
      </SignedIn>

    </div>
  );
};
