import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Details from './pages/Details';


function App() {
  return (
    // Routing for the App.
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/home" element={ <Home /> } />
        <Route path="/details" element={ <Details /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
