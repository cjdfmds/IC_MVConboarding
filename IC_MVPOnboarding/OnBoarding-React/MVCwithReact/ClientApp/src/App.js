import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import './custom.css'
import Product from './components/Product';
import Store from './components/Store';
import Customer from './components/Customer';
import Sales from './components/Sale';


export default class App extends Component {
  static displayName = App.name;
    
  //here we give particular string paths for each component that's specified. These string paths defined by
    // the path="" attribute must match up exactly with the string in the layout.js files to="" attribute for each tab

  render () {
    return (
      <Layout>
        <Route exact path='/Home' component={Home} />
        
            <Route path='/Customer' component={Customer} />
            <Route path='/Product' component={Product} />
            <Route path='/Store' component={Store} />
            <Route path='/Sale' component={Sales} />
      </Layout>
    );
  }
}
