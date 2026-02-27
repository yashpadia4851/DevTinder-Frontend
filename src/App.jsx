import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./Screen/Body/Body";
import Feed from "./Screen/Body/Feed";
import Footer from "./Screen/Body/Footer";
import Login from "./Screen/Login/Login";
import appStore from "./Utils/appStore";
import { Provider } from "react-redux";
import Profile from "./Screen/Body/Profile";
import Connections from "./Screen/Body/Connections";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="/" element={<Body />}>
              <Route index element={<Feed />} />
              <Route path="feed" element={<Feed />} />
              <Route path="profile" element={<Profile />} />
              <Route path="connections" element={<Connections />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
