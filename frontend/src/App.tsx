import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./components/error";
import Form from "./components/form";
import Success from "./components/success";
import ProtectedRoute from "./components/protectRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route
          path="error"
          element={
            <ProtectedRoute>
              <Error />
            </ProtectedRoute>
          }
        />
        <Route
          path="success"
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
