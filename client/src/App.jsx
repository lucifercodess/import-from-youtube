import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Auth from "./pages/auth";
import OTPInput from "./pages/auth/otp";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import { PlaylistProvider } from "./context/PlaylistContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const App = () => {
  return (
    <PlaylistProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="min-h-screen  bg-[#222226] text-white">
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auth"
                element={
                  <GuestRoute>
                    <Auth />
                  </GuestRoute>
                }
              />
              <Route
                path="/verify-otp"
                element={
                  <GuestRoute>
                    <OTPInput />
                  </GuestRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      </DndProvider>
    </PlaylistProvider>
  );
};

export default App;
