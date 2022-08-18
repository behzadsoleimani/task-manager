import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import "./App.css"
import { Fragment } from 'react';
import Header from './components/Header';
import Test from './pages/Test';


export default () => (
  <Fragment>
    <BrowserRouter>
      <Header />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  </Fragment>
)