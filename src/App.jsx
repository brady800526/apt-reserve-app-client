import "./App.css";
import { ReservationView } from "./views/reserve/ReservationView";

const App = () => {
  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="navbar"></header>

      <ReservationView />
    </div>
  );
};

export default App;
