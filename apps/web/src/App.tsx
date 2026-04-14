import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppsPage from "./pages/AppsPage";
import AppDetailsPage from "./pages/AppDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="page-shell">
        <Routes>
          <Route path="/" element={<AppsPage />} />
          <Route path="/apps/:id" element={<AppDetailsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
