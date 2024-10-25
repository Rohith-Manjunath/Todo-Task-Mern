import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomeModal from "./components/WelcomeModal";

const App = () => {
  return (
    // Add return statement here
    <>
      <WelcomeModal />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
