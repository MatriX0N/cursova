import "./App.css";
import Header from "./component/header/Header";
import Main from "./pages/main/Main"
import Bookmarks from "./pages/bookmarks/Bookmarks"
import History from "./pages/history/History"
import Profile from "./pages/prifile/Profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
         
        </Routes>
      </div>
    </div>
  );
}

export default App;
