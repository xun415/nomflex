import React from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom"
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import Home from "./Routes/Home";
import Header from "./Components/Header";

function App() {
  return (
    <BrowserRouter>
        <Header />
      <Routes>
        <Route path={`${process.env.PUBLIC_URL}/`} element={<Home/>} />
          <Route path={`${process.env.PUBLIC_URL}/movies/:id`} element={< Home />} />
        <Route path={`${process.env.PUBLIC_URL}/tv`} element={<Tv/>} />
          <Route path={`${process.env.PUBLIC_URL}/tv/:id`} element={<Tv/>} />
        <Route path={`${process.env.PUBLIC_URL}/search`} element={<Search />} />
          <Route path={`${process.env.PUBLIC_URL}/search/tv/:id`} element={<Search />} />
          <Route path={`${process.env.PUBLIC_URL}/search/movie/:id`} element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
