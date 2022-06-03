import React, { Component } from 'react'
import Layout from "../layout/Layout";
import "./bootstrap.css"
import Builder from "./Builder";
import { Route, Routes } from 'react-router-dom';
import Home from '../layout/Home';
import Checkout from './Checkout';
import Orders from './Orders';


export default class App extends Component {

  render() {
    return (
      <Routes>
        <>
          <Route path='/' element={<Home />}></Route>
          <Route path='/builder' element={
            <Layout>
              <Builder />
            </Layout>
          }></Route>
          <Route path='/checkout' element={
            <Layout>
              <Checkout />
            </Layout>
          }></Route>
          <Route path='/orders' element={
            <Layout>
              <Orders/>
            </Layout>
          }></Route>
        </>
      </Routes>
    )
  }
}


