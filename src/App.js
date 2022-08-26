import { BrowserRouter, Routes, Route } from "react-router-dom";//router 쓰기위함
import Search from "./routes/Search";
import Done from "./routes/Done";
import Thanks from "./routes/Thanks";
import Home from "./routes/Home";

function App() {
  //Routes는 하나의 Route 만 실행되도록 함
  // '/search'가 '/'보다 앞에 있어야 함. /search는 /속에도 속하기 때문
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/search/:id" element={<Search />}></Route>
        <Route path="/done/:id" element={<Done />}></Route>
        <Route path="/thanks" element={<Thanks />}></Route>
        <Route path="/:id" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
