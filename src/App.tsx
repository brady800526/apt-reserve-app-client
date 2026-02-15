import "./App.css";
import { ApartmentDetailView } from "./views/apartment-detail/ApartmentDetailView";

const App = () => {
  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar"></header>

      <ApartmentDetailView />
    </div>
  );
};

export default App;
