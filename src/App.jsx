import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./Screen/Body/Body";
import Feed from "./Screen/Body/Feed";
import Footer from "./Screen/Body/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="feed" element={<Feed />} />
            {/* <Route path="footer" element={<Footer />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
