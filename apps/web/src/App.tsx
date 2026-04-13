import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppsPage from "./pages/AppsPage";
import AppDetailsPage from "./pages/AppDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppsPage />}></Route>
        <Route path="/apps/:id" element={<AppDetailsPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
