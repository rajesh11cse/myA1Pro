import React from 'react';
import { FacebookLogin } from 'react-facebook-login-component';
import { browserHistory } from 'react-router';
import {STRINGS,REGEX,DB_MAP_UI} from '../_utility/constants';
 
class Login extends React.Component{
 
  constructor (props, context) {
    super(props, context);
  }
 
  responseFacebook (response) {
    var userData = {};
    sessionStorage.setItem("dynamicLogin",JSON.stringify(response));
    if(response && response.email){
      // console.log(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.CHECK_EMAIL);
      var dataToSend = {
          email : response.email
      };
        $.ajax({
            url: STRINGS.URL+STRINGS.API_PREFIX+STRINGS.CHECK_EMAIL,
            type: 'POST',
            cache: false,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(dataToSend),
            success: function(data) {
                if(data && data.token){
                  sessionStorage.setItem('token',data.token);
                }
                if(data.success && userData){
                    for(var key in DB_MAP_UI){
                          if(DB_MAP_UI[key] && DB_MAP_UI[key]["db"]!=null){
                            userData[key] = data.data[DB_MAP_UI[key]["db"]];
                        }else if(DB_MAP_UI[key]["db"]!=null){
                            userData[key] = "";
                        }
                    }
                    sessionStorage.setItem('data',JSON.stringify(userData));
                    sessionStorage.setItem('signedIn',JSON.stringify(dataToSend));
                    browserHistory.push('index.html#/Questionnaire');
                    window.location.reload();
                }

            }.bind(this),
            error: function(xhr, status, err) {
                // console.error(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.USER_DETAILS, status, err, xhr);
                var password_msg = err.toString();
                if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                    password_msg = xhr.responseJSON.message;
                }
                browserHistory.push('index.html#/CreateAccount');
                window.location.reload();
            }.bind(this)
        });
                  
    }else if(response && response.name){
       browserHistory.push('index.html#/CreateAccount');
      window.location.reload();
    }
    //anything else you want to do(save to localStorage)... 
  }


 
  render () {
    /* app Id required from Client*/
    return (
      <div>
        {(window.location.origin.includes("localhost"))?(<FacebookLogin 
                       socialId="1088597931155576"
                       language="en_US"
                       scope="public_profile,email"
                       responseHandler={this.responseFacebook}
                       xfbml={true}
                       fields="id,email,name"
                       version="v2.5"
                       buttonClass="facebook-login btn social-login-button fb-login-button"
                       buttonText="Login With Facebook"/>):((window.location.origin.includes("gigupdev"))?
        (<FacebookLogin 
                               socialId="1369623806486272"
                               language="en_US"
                               scope="public_profile,email"
                               responseHandler={this.responseFacebook}
                               xfbml={true}
                               fields="id,email,name"
                               version="v2.5"
                               buttonClass="facebook-login btn social-login-button fb-login-button"
                               buttonText="Login With Facebook"/>):
                        (<FacebookLogin 
                       socialId="445309232480594"
                       language="en_US"
                       scope="public_profile,email"
                       responseHandler={this.responseFacebook}
                       xfbml={true}
                       fields="id,email,name"
                       version="v2.5"
                       buttonClass="facebook-login btn social-login-button fb-login-button"
                       buttonText="Login With Facebook"/>))}
      </div>
    );
  }
 
}
 
export default Login;