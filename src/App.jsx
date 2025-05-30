import "./App.css";
import Header from "./component/header/Header";
import Main from "./pages/main/Main"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
         
        </Routes>
      </div>
    </div>
  );
}

export default App;
