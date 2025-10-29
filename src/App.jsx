import { Routes, Route } from "react-router-dom";
import IdeaPitchComponent from "./Pages/IdeaPitchComponent";
import Evaluation from "./Pages/evaluation";
import Result from "./Pages/result";
// import Contact from "./Pages/Contact";

function App() {
  return (
    <Routes>
      <Route path="/" element={<IdeaPitchComponent />} />
      <Route path="/evaluation" element={<Evaluation />} />
      <Route path="/result" element={<Result/>}/>
    </Routes>
  );
}

export default App;
