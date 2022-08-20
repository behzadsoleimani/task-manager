import React, { useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Board from './pages/Board';
import "./App.css"
import { Fragment } from 'react';
import Header from './components/Header';
import { getInit } from './redux/board';
import { useAppDispatch } from './redux/hook';


const App = () => {
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    if(!localStorage.getItem("boards")) return;
    else{
      dispatch(getInit())
    }
  }, []);
  return (
    <Fragment>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board/:boardId" element={<Board />} />
        </Routes>
      </BrowserRouter>
    </Fragment>);
};

export default App;