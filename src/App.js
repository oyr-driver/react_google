import { BrowserRouter, Routes, Route } from "react-router-dom";//router 쓰기위함
import Check from "./routes/Check";
import Search from "./routes/Search";
import Done from "./routes/Done";
import Camera from "./routes/Camera";
import Thanks from "./routes/Thanks";
import Home from "./routes/Home";

function App() {
  //Routes는 하나의 Route 만 실행되도록 함
  // '/search'가 '/'보다 앞에 있어야 함. /search는 /속에도 속하기 때문
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/search/:id/:flag" element={<Search />}></Route> {/*:는 뒤에 변수가 옴, useParams를 이용해 id(변수) 값 설정(Search에서) */}
        <Route path="/done/:id/:flag" element={<Done />}></Route>
        <Route path="/camera/:id/:flag" element={<Camera />}></Route>
        <Route path="/thanks" element={<Thanks />}></Route>
        <Route path="/loc/:id/:flag" element={<Home />}></Route>
        <Route path="/:id" element={<Check />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;