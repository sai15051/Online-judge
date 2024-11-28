
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/signup";
import Home from "./components/home";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import Problemdetails from "./components/problemdetails";
import Createproblem from "./components/createproblem";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/getproblem/:id" element={<Problemdetails/>}/>
      <Route path="/createproblem" element = {<Createproblem/>}/>

    </Routes>
  );
}

export default App;
