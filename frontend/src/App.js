
import { Routes, Route } from 'react-router-dom';
import LandingPage from "./Pages/LandingPage/LandingPage";
import Homepage from "./Pages/Homepage/Homepage";
import Chats from "./Pages/Messages/Chats";
import MobileChats from "./Pages/Messages/MobileChats";
import Profile from "./Pages/Profile/Profile";
import Layout from './Components/Layout/Layout';
import Search from './Pages/Search/Search';
import Details from './Pages/ModelDetails/Details';
import MobileDetails from './Pages/MobileDetails/MobileDetails';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path='/home' element={<Homepage />} />
          <Route path='/messages' element={<Chats />} />
          <Route path='/messages/index' element={<MobileChats />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/search' element={<Search />} />
          <Route path="/model/:id" element={<Details />} />
          <Route path="/model/media/:id" element={<MobileDetails />} />
        </Route>

      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
