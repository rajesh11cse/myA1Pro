import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import {STRINGS,REGEX,DB_MAP_UI} from '../_utility/constants';
import Nav from '../nav/nav';
import Footer from '../footer/footer';
import DocumentTitle from "react-document-title";
import Login from "./fblogin";
import GoogleLogin from 'react-google-login';


function responseGoogle(googleResponse){
    var response = googleResponse.profileObj;
    var userData = {};
    if(response && response.email){
        sessionStorage.setItem("dynamicLogin",JSON.stringify(response));
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
                // console.log(xhr.statusCode, xhr.status, xhr.getAllResponseHeaders(),xhr.statusCode());
                var password_msg = "error";
                if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                    password_msg = xhr.responseJSON.message;
                }
                // alert(password_msg);
                browserHistory.push('index.html#/CreateAccount');
                window.location.reload();
            }.bind(this)
        });
                  
    }else{
        // console.log("no email in response Google",googleResponse);
        // browserHistory.push('index.html#/CreateAccount');
        // window.location.reload();
    }
}


class SignIn extends React.Component {

     constructor(props) {
        super(props);
        
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
        
        this.handleChange = this.handleChange.bind(this);
        sessionStorage.removeItem("dynamicLogin");
        var state = {
            answers : {},
            signin_answers : {
                usr_name : "",
                usr_password : ""
            },
            current : 0 ,
        };
        this.state = state;
        this.init();
    }

    componentDidMount(){
        this.rem();
    }

    componentWillReceiveProps(nextProps) {
        this.init();
        // this._getContent(nextProps.params.featureName);
    }

    init(){
        
        let that = this;
        var div_name = document.getElementById('usr_name_text');
        var div_password = document.getElementById('usr_password');
        var div_name_input = document.getElementById('usr_name_input');
        var div_password_input = document.getElementById('usr_password_input');
        var div_login_input = document.getElementById('login_button_input');
        if(div_login_input && !that.hasClass(div_login_input,"hide")){
            that.addClass(div_login_input,"hide");
        }
        if(div_name_input && !that.hasClass(div_name_input,"hide")){
            that.addClass(div_name_input,"hide");
        }
        if(div_name && that.hasClass(div_name,"has-error")){
            that.removeClass(div_name,"has-error");
        }
        if(div_password && that.hasClass(div_password,"has-error")){
            that.removeClass(div_password,"has-error");
        }
    }

    submit(e){
        let that = this;
        var obj = e.target;
        let p_ans = that.state.signin_answers;
        var div_login_button_input = document.getElementById('login_button_input');
        var data = sessionStorage.getItem('data');
        var div_name = document.getElementById('usr_name_text');
        var div_password = document.getElementById('usr_password');
        var div_name_input = document.getElementById('usr_name_input');
        if(data){
            data = JSON.parse(data);
        }
        // if(that.checkFlow() && data && data.usr_email && p_ans["usr_name"] == data.usr_email && p_ans["usr_password"] == data.usr_password){
        if(that.checkFlow()){
            if(div_login_button_input && !that.hasClass(div_login_button_input,"hide")){
                that.addClass(div_login_button_input,"hide");
            }
            var dataToSend = {
                "email" : p_ans.usr_name,
                "password" : p_ans.usr_password
            };
            // console.log(STRINGS.URL+STRINGS.AUTH+STRINGS.LOGIN,dataToSend);
            $.ajax({
                url: STRINGS.URL+STRINGS.AUTH+STRINGS.LOGIN,
                type: 'POST',
                cache: false,
                data: JSON.stringify(dataToSend),
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function(data) {
                    if(data.success){
                        sessionStorage.setItem('signedIn',JSON.stringify({"email":p_ans.usr_name}));
                        sessionStorage.setItem('token',data.token);
                        browserHistory.push('index.html#/Questionnaire');
                        window.location.reload();
                    }else{
                        if(div_login_button_input && that.hasClass(div_login_button_input,"hide")){
                            that.removeClass(div_login_button_input,"hide");
                        }
                    }
                }.bind(this),
                error: function(xhr, status, err) {
                    // console.error(STRINGS.URL+STRINGS.AUTH+STRINGS.LOGIN, status, err.toString());
                    if(div_login_button_input && that.hasClass(div_login_button_input,"hide")){
                        that.removeClass(div_login_button_input,"hide");
                    }
                }.bind(this)
            });
            
        }else{
        }
        // window.scrollTo(0, 0);
    }

    cancel(e){
        let that = this;
        var obj = e.target;
        window.scrollTo(0, 0);
        window.location.reload();
    }

    forgotPassword(e){
        let that = this;
        var obj = e.target;
        window.scrollTo(0, 0);
        browserHistory.push('index.html#/ForgotPassword');
        window.location.reload();
    }
    
    createUser(e) {
        let that = this;
        var obj = e.target;
        window.scrollTo(0, 0);
        browserHistory.push('index.html#/CreateAccount');
        window.location.reload();
    }
    
    validateEmail(email) {
        let re = REGEX.EMAIL;
        return re.test(email);
    }

    validatePassword(password) {
        let re = REGEX.PASSWORD;
        return re.test(password);
    } 

    handleChange(e){
        let that = this;
        var obj = e.target;
        var id = $(obj).attr("id");
        var value = $(obj).val();
        var signin_answers = that.state.signin_answers;
        signin_answers[id]=value;
        that.setState({
            signin_answers : signin_answers,
        },function(){
            //console.log(that.state.signin_answers);
        });
    }

    emailCheck(){
        let that = this;
        let p_ans = that.state.signin_answers;
        let current = that.state.current;
        var name_validitor_regex = /^[a-zA-Z]+$/;
        var flag = 0;
        var div_name = document.getElementById('usr_name_text');
        var div_name_input = document.getElementById('usr_name_input');

        if ( ( p_ans["usr_name"] && p_ans["usr_name"].length >= 2 ) ){
            if(div_name && that.hasClass(div_name,"has-error")){
                that.removeClass(div_name,"has-error");
            }

            if(that.validateEmail(p_ans["usr_name"])){
                if(div_name && that.hasClass(div_name,"has-error")){
                    that.removeClass(div_name,"has-error");
                }

                if(div_name_input && !that.hasClass(div_name_input,"hide")){
                    that.addClass(div_name_input,"hide");
                }
            }else{
                flag = 1;
                if(div_name_input && that.hasClass(div_name_input,"hide")){
                    that.removeClass(div_name_input,"hide");
                }

                if(div_name && !that.hasClass(div_name,"has-error")){
                    that.addClass(div_name,"has-error");
                }
            }
        }else{
            flag = 1;
            if(div_name_input && that.hasClass(div_name_input,"hide")){
                that.removeClass(div_name_input,"hide");
            }

            if(div_name && !that.hasClass(div_name,"has-error")){
                that.addClass(div_name,"has-error");
            }
        }
        
        if(flag == 0){
            return true;
        }
        return false;
    }

    passwordCheck(){
        let that = this;
        let p_ans = that.state.signin_answers;
        let current = that.state.current;
        var name_validitor_regex = /^[a-zA-Z]+$/;
        var flag = 0;
        var div_password = document.getElementById('usr_password');
        var div_password_input = document.getElementById('usr_password_input');
        if(flag == 0){
            return true;
        }
        return false;
    }


    checkFlow(){
        let that = this;
        let p_ans = that.state.signin_answers;
        let current = that.state.current;
        switch(current){
            case 0 :
                var name_validitor_regex = /^[a-zA-Z]+$/;
                var flag = 0;
                var div_name = document.getElementById('usr_name_text');
                var div_password = document.getElementById('usr_password');
                var div_name_input = document.getElementById('usr_name_input');
                var div_password_input = document.getElementById('usr_password_input');

                if ( ( p_ans["usr_name"] && p_ans["usr_name"].length >= 2 ) ){
                    if(that.validateEmail(p_ans["usr_name"])){}else{
                        flag = 1;
                    }
                }else{
                    flag = 1;
                }
                
                if(( p_ans["usr_password"] && p_ans["usr_password"].length >= 2 )){

                    if(that.validatePassword(p_ans["usr_password"])){}else{
                        // flag = 1;
                    }
                }else{
                    flag = 1;
                }
                
                if(flag == 0){
                    return true;
                }
            
            break;
            default : 
                return false
            break;
        }
        return false;
    }

    hasClass(el, className) {
      if (el.classList)
        return el.classList.contains(className)
      else
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    }
   
   /* remember me functionality removes the user email from the session storage*/
   remember(){

        if($("#checkbox"). prop("checked") == true){

             var username =  document.getElementById("usr_name").value;
              localStorage.setItem("username",username);

        }
        else if($("#checkbox"). prop("checked") == false){
           
            localStorage.removeItem("username");

        }
    }

    
    /* remember me functionality sets the user email to the session storage*/
    rem(){
        let that = this;
        let p_ans = that.state.signin_answers;
       if(localStorage.getItem("username")===null){
        
       }

       else{
           document.getElementById("checkbox").checked = true;
           var username = localStorage.getItem("username") || null;
           if(username){
                // document.getElementById("usr_name").value = username;
                p_ans.usr_name = username;
                that.setState({
                    signin_answers : p_ans
                }); 
           }  
       }
    }


    addClass(el, className) {
      if (el.classList)
        el.classList.add(className)
      else if (!hasClass(el, className)) el.className += " " + className
    }

    removeClass(el, className) {
      if (el.classList)
        el.classList.remove(className)
      else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
        el.className=el.className.replace(reg, ' ')
      }
    }
    
    render() {
        let that = this;
        let p_ans = that.state.signin_answers;
        return (
            <DocumentTitle title={STRINGS.PROJECT_NAME+" - Sign In"}>
                 <section className="container content_wrapper">
                 <style>{`body{background-color:#ededed;}`}</style>
                 
                    <section id="page-header" className="text-center margin-bottom-30">
                        <h3 className="">
                        Sign in to your account<br/>
                        <small class="sign-font">Our goal is to give you personalized jobs that you can apply easily.</small>
                        </h3>
                    </section>

                    <section id="login-page">
                    <div className="row">

                        <div className="col-sm-5 col-xs-12 ">

                            <div className="form-group margin-bottom-30" id="usr_name_text">
                                 <input placeholder="Email" type="text" id="usr_name" className="form-control" onBlur={that.emailCheck.bind(that)} onChange={that.handleChange} value={p_ans.usr_name}></input>
                                 <span id="usr_name_input" style={{}} className="help-inline control-label hide">Enter a valid email !</span>
                            </div>

                            <div className="form-group margin-bottom-30" id="usr_password">
                                 <input placeholder="Password" type="password" id="usr_password" className="form-control" onBlur={that.passwordCheck.bind(that)} onChange={that.handleChange} value={p_ans.usr_password} ></input>
                                 <span id="usr_password_input" style={{}} class="help-inline control-label hide">Password should have at least Minimum 8 characters, 1 Uppercase Alphabet, 1 Number and 1 Special Character !</span>
                            </div>

                            <div className="form-group">
                                <button type="button" className={"btn login-btn background backgroundHover "+(that.checkFlow()==true?"color_1":"color_2 disabledButton")} onClick={that.submit}>SIGN IN</button>
                                <span id="login_button_input" style={{}} class="help-inline control-label hide">Your email or password is not correct !</span>
                            </div>

                            <div className="form-group login_helpers">
                            <div className="row">
                                 <div className="col-xs-6 text-left">
                                    <label className="text-right textHover color_1">
                                        <input type="checkbox" id="checkbox" onClick={this.remember}></input> <span class="color_1">Remember me</span>
                                    </label>
                                 </div>
                                 <div className="col-xs-6 text-right">
                                     <a className="textHover color_1" onClick={this.forgotPassword}>Forgot Password?</a>
                                 </div>
                            </div>
                            <div className="row">
                                 <div className="col-xs-12 text-left">
                                        <br/>
                                        <span>Don't have an account?<a className="textHover color_1" onClick={this.createUser}> Create Account</a></span>
                                 </div>
                            </div>
                            </div>

                        </div>

                        <div className="col-sm-2 col-xs-12">
                             <div className="col-round">OR</div>
                        </div>

                        <div className="col-sm-5 col-xs-12 social_login_container">

                            <div className="margin-bottom-30 row">
                                <div className="col-md-2 col-xs-2 hidden-sm hidden-xs">
                                    <div className="fb-col-round"><i className="fa fa-facebook font-size-fa" aria-hidden="true"></i></div>
                                </div>
                                <div  className="col-md-10 col-xs-12 ">
                                    <a type="button" class="btn social-login-button fb-login-button1">Sign in with Facebook</a>
                                    <div class="fb-login-button6" id="" style={{"position":"absolute", "margin-top":"-37px", "opacity":"0", "width": "100%", "margin-bottom": "20px"}}><Login/></div>
                                </div>
                            </div>

                            <div className="margin-bottom-30 row">
                                <div className="col-md-2 col-xs-2 hidden-sm hidden-xs">
                                    <div className="fb-col-round"><i className="fa fa-google-plus font-size-ga" aria-hidden="true"></i></div>
                                </div>
                                <div  className="col-md-10 col-xs-12">
                                    {(window.location.origin.includes("localhost"))?(<GoogleLogin
                                        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com" className="fa fa-google-plus font-size-ga"
                                        buttonText="Sign in with Google +" 
                                        class="btn social-login-button ga-login-button"
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle}
                                    />):((window.location.origin.includes("gigupdev"))?
                                    (<GoogleLogin
                                                                            clientId="60487635539-kgs5hb00heqt6eq6mc03mqhva74ff0t2.apps.googleusercontent.com" className="fa fa-google-plus font-size-ga"
                                                                            buttonText="Sign in with Google +" 
                                                                            class="btn social-login-button ga-login-button"
                                                                            onSuccess={responseGoogle}
                                                                            onFailure={responseGoogle}
                                                                        />):
                                     (<GoogleLogin
                                        clientId="60487635539-4rrnvck9lblv02k0pj7okmjp3uc87ev3.apps.googleusercontent.com" className="fa fa-google-plus font-size-ga"
                                        buttonText="Sign in with Google +" 
                                        class="btn social-login-button ga-login-button"
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle}
                                    />))}
                                </div>
                            </div>

                        </div>

                    </div>
                    </section>

                </section>
            </DocumentTitle>
        )
    }
    
}

export default SignIn;