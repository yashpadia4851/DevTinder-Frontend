import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { store } from "./store";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Login from "./features/auth/Login";
import Feed from "./features/feed/Feed";
import Profile from "./features/profile/Profile";
import Connections from "./features/connections/Connections";
import Requests from "./features/requests/Requests";
import Premium from "./features/Premium/Premium";
import Chat from "./features/Chat/Chat";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route index element={<Navigate to="/feed" replace />} />
              <Route path="feed" element={<Feed />} />
              <Route path="profile" element={<Profile />} />
              <Route path="connections" element={<Connections />} />
              <Route path="request" element={<Requests />} />
              <Route path="premium" element={<Premium />} />
              <Route path="chat/:targetUserId" element={<Chat />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
