import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ApartmentDetailView } from "./views/apartment-detail/ApartmentDetailView";
import { ReviewView } from "./views/review/ReviewView";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Navbar */}
        <header className="navbar"></header>

        <Routes>
          <Route path="/" element={<ApartmentDetailView />} />
          <Route path="/review" element={<ReviewView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
