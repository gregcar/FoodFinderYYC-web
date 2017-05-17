'use strict';

import React from 'react';
import {
  BrowserRouter,
  Router,
  Route,
  Switch
} from 'react-router-dom';

import Cookies from 'universal-cookie';

import App from './containers/app';
import SignUp from './scenes/signup';
import Intro from './scenes/intro';
import About from './scenes/about';
import Privacy from './scenes/privacy';
import Search from './scenes/search';
import NotFound from './scenes/notfound';

export default class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hideNav: false
    };
  }

  render() {
    const cookies = new Cookies();

    let hasCookie = cookies.get('skipIntro');

    let Redirect;

    /*
    if (hasCookie) {
      Redirect = Search;
    } else {
      Redirect = SignUp;
      //cookies.set('skipIntro', true);
    }

     <Route exact={true} path="/" component={Redirect} />
     <Route path="/search" component={Search} />
     <Route path="/about" component={About} />
     <Route path="/privacy" component={Privacy} />
     <Route component={NotFound} />

    */

    return (
      <BrowserRouter history={Router.history}>
        <App>
          <Switch>
            <Route component={SignUp} />
          </Switch>
        </App>
      </BrowserRouter>
    );
  }
};