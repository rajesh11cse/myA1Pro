import React from 'react';
import { browserHistory } from 'react-router';
import {STRINGS} from '../_utility/constants';
import {Link} from 'react-router';

class Nav extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    signOut(e) {
        let that = this;
        var obj = e.target;
        window.scrollTo(0, 0);
        let itemsToRemove_list = ['signedIn','token','answers','data','pid_list','personal_answers'];
        for(let itemsToRemove in itemsToRemove_list){
          sessionStorage.removeItem(itemsToRemove_list[itemsToRemove]);
        }
        browserHistory.push('index.html#/SignIn');
        window.location.reload();
    }

    generateRightNav() {
        let that = this;
        if(that.props.loginData){
          let username = that.props.userData.usr_first_name;
          return(
            <ul className="nav navbar-nav navbar-right">

            

              <li><Link className="nav_button textHover color_1 color_username" to="/Profile">Welcome {username}</Link></li>

              <li className="hidden-xs"><span className="nav_separator">|</span></li>
              <li><Link className="nav_button border borderHover color_1" onClick={this.signOut}>Sign Out</Link></li>
            </ul>
          );
        }if((window.location.toString()).includes("SignIn")){
          return(
            <ul className="nav navbar-nav navbar-right">
            </ul>
          );
        }if((window.location.toString()).includes("CreateAccount") || (window.location.toString()).includes("PersonalInformation")){
          return(
            <ul className="nav navbar-nav navbar-right">
              <li><Link className="nav_button textHover color_1" to="/SignIn">Sign In</Link></li>
            </ul>
          );
        }else{
          return(
            <ul className="nav navbar-nav navbar-right">
              <li><Link className="nav_button textHover color_1" to="/SignIn">Sign In</Link></li>
              <li className="hidden-xs"><span className="nav_separator">|</span></li>
              <li><Link className="nav_button border borderHover color_1" to="/CreateAccount">Create Account</Link></li>
            </ul>
          );
          
        }
    }



    generateForButton() {
        let that = this;
        if((window.location.toString()).includes("ForPlatforms")){
          return(
            <ul className="nav navbar-nav">
              <li><Link className="nav_button background-color-nav background border backgroundHover color_1 " to="/">For Applicants</Link></li>
            </ul>
          );
        }else{
          return(
            <ul className="nav navbar-nav">
              <li><Link className="nav_button background-color-nav background border backgroundHover color_1" to="/ForPlatforms">For Platforms</Link></li>
            </ul>
          );
          
        }
    }

    render() {

        let that = this;
        return (        
            <nav className="navbar navbar-default navbar-fixed-top">
              <div className="container">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                    {/*<a href="#" className="gig_logo"><img src="public/img/GigUp-logo.png"></img></a>*/}
                    <a href="#" className="gig_logo"><img src="public/img/logo_notitle.png"></img><span>GigUp</span></a>
                </div>
                <div id="navbar" className="collapse navbar-collapse">
                  {that.generateForButton()}
                  {that.generateRightNav()}
                 </div>
              </div>
            </nav>
        )

    }
}

export default Nav;
