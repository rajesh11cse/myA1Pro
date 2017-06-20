import React from 'react';
import {STRINGS} from '../_utility/constants';
import {Link} from 'react-router';

class Nav extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    signOut() {
        
    }

    render() {

        return (        
            <nav className="navbar navbar-default navbar-fixed-top">
              <div className="container-fluid">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                    <a href="#" className="gig_logo"><img src="public/img/GigUp-logo.png"></img></a>
                </div>
                <div id="navbar" className="collapse navbar-collapse">
                  <ul className="nav navbar-nav">
                    <li><Link className="nav_button background border backgroundHover color_1" to="/ForPlatforms">For Platforms</Link></li>
                  </ul>
                  <ul className="nav navbar-nav navbar-right">
                    <li><Link className="nav_button textHover color_1" to="/SignIn">Sign In</Link></li>
                    <li className="hidden-xs"><span className="nav_separator">|</span></li>
                    <li><Link className="nav_button border borderHover color_1" to="/CreateAccount">Create Account</Link></li>
                  </ul>
                 </div>
              </div>
            </nav>
        )

    }
}

export default Nav;
