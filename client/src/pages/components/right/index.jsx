import React from "react";
import Header from "./components/header";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Right = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <div className="flex flex-col min-h-screen">
        <Header />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Right;
