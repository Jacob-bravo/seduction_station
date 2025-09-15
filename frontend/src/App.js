import { Routes, Route } from "react-router-dom";
import { MenuProvider } from "./Components/NavigationBar/Menucontext";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Homepage from "./Pages/Homepage/Homepage";
import Chats from "./Pages/Messages/Chats";
import MobileChats from "./Pages/Messages/MobileChats";
import Profile from "./Pages/Profile/Profile";
import Layout from "./Components/Layout/Layout";
import Search from "./Pages/Search/Search";
import Details from "./Pages/ModelDetails/Details";
import About from "./Pages/About/About";
import Plans from "./Pages/Plans/Plans";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompleteOrder from "./Pages/OrderPage/CompleteOrder";
import CancelOrder from "./Pages/OrderPage/CancelOrder";
import Gmenu from "./Pages/General Menu/Gmenu";

function App() {
  return (
    <div className="App">
      <MenuProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Homepage />} />
            <Route path="/messages" element={<Chats />} />
            <Route
              path="/messages/:conversationId/:username/:chattingMemberUserId"
              element={<MobileChats />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/model/:id" element={<Details />} />
            <Route
              path="/complete-order/:modelId/:myId"
              element={<CompleteOrder />}
            />
            <Route path="/cancel-order/:modelId" element={<CancelOrder />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/about" element={<About />} />
            <Route path="/general" element={<Gmenu />} />
          </Route>
        </Routes>
      </MenuProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
