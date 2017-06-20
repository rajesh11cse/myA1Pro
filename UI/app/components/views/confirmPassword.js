import React from 'react';
import {STRINGS,REGEX} from '../_utility/constants';
import Nav from '../nav/nav';
import Footer from '../footer/footer';
import DocumentTitle from "react-document-title";
import { browserHistory } from 'react-router';


class ConfirmPassword extends React.Component {

    constructor(props) {
        super(props);
        
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        
        var state = {
            goToSignin : false,
            header: "Sorry",
            message : "loading ...",
            answers : {},
            personal_answers : {
                usr_password : "",
                usr_password_confirm : ""
            },
            current : 0 ,
        };
        this.state = state;
    }

    alertMessage(){
        let that = this;
        if(that.state.goToSignin){
            browserHistory.push('index.html#/SignIn');
            window.location.reload();
        }
    }

    submit(e){
        let that = this;
        var obj = e.target;
        window.scrollTo(0, 0);
        var dataToSend = {
            newPassword : that.state.personal_answers.usr_password_confirm
        };
        var token = that.props.location.query.token||null;
        if(that.checkFlow()==true){
            // console.log(STRINGS.URL+STRINGS.AUTH+STRINGS.RESET_PASSWORD,token,dataToSend);
            $.ajax({
                url: STRINGS.URL+STRINGS.AUTH+STRINGS.RESET_PASSWORD,
                type: 'POST',
                cache: false,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization" : token
                },
                data: JSON.stringify(dataToSend),
                success: function(data) {
                    var password_msg = "Reset Password Successfull.";
                    if(data.success ){
                        if(data.message){
                            password_msg = data.message;
                        }
                        $("#confirmModal").modal('show');
                        that.setState({message: password_msg, goToSignin: true, header: "Congrats"});
                    }else{
                    }

                }.bind(that),
                error: function(xhr, status, err) {
                    // console.error(STRINGS.URL+STRINGS.AUTH+STRINGS.RESET_PASSWORD, status, err, xhr);
                    var password_msg = err.toString();
                    if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                        password_msg = xhr.responseJSON.message;
                    }
                    $("#confirmModal").modal('show');
                    that.setState({message: password_msg, header: "Sorry"});
                }.bind(that)
            });
        }
    }

    cancel(e){
        let that = this;
        var obj = e.target;
        window.scrollTo(0, 0);
    }

    handleChange(e){
        let that = this;
        var obj = e.target;
        var id = $(obj).attr("id");
        var value = $(obj).val();
        var personal_answers = that.state.personal_answers;
        personal_answers[id]=value;
        that.setState({
            personal_answers : personal_answers,
        },function(){
            //console.log(that.state.personal_answers);
        });
    }

    validatePassword(password) {
        let re = REGEX.PASSWORD;

        let that = this;
        let p_ans = that.state.personal_answers;
        var password_feedback = document.getElementById('password_feedback');
        let pwd_array = [];
        let password_msg = "";
        let flag = 0;

        if(!(REGEX.LENGTH).test(p_ans["usr_password"])){
            flag=1;
            pwd_array.push("8 characters");
        }
        if(!(REGEX.SPECIAL_CHARACTER).test(p_ans["usr_password"])){
            flag=1;
            pwd_array.push("1 special character");
        }
        if(!(REGEX.CAPITAL_LETTER).test(p_ans["usr_password"])){
            flag=1;
            pwd_array.push("1 uppercase letter");
        }
        if(!(REGEX.NUMBER).test(p_ans["usr_password"])){
            flag=1;
            pwd_array.push("1 number");
        }

        let pwd_array_length = pwd_array.length;
        if(pwd_array_length > 0){
            password_msg = "(Passwords must contain at least ";
        }
        for(var item=0; item<pwd_array_length; item++){
            if(item == 0){
                password_msg += pwd_array[item];
            }
            else if(item != pwd_array_length-1){
                password_msg += ", "+pwd_array[item];
            }else{
                password_msg += " and "+pwd_array[item];
            }
        }
        if(pwd_array_length > 0){
            password_msg += ")";
        }
        if(pwd_array.length == 0){
            if(p_ans["usr_password_confirm"].length >= p_ans["usr_password"].length && !(p_ans["usr_password"] == (p_ans["usr_password_confirm"]))){
                flag=1;
                password_msg = "(Passwords are not matching)";
            }
        }
        if(password_feedback){
            password_feedback.innerHTML = password_msg;
        }
        if(flag == 0){
            return true;
        }else{
            return false;
        }
        // return re.test(password);
    } 

    checkFlow(){
        let that = this;
        let p_ans = that.state.personal_answers;
        let current = that.state.current;
        switch(current){
            case 0 :
                if (
                    (( that.validatePassword(p_ans["usr_password"]) )  && ( p_ans["usr_password"] && p_ans["usr_password_confirm"] ) && ( ( p_ans["usr_password"] == p_ans["usr_password_confirm"] )))
                     
                ){
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
        let p_ans = that.state.personal_answers;
        return (
            <DocumentTitle title={STRINGS.PROJECT_NAME+" - Contact Us"}>
                <section className="container content_wrapper">
                <style>{`body{background-color:#ededed;}`}</style>
                   
                    <section id="" className="text-center margin-bottom-30">
                        <h3 className="margin-bottom-15">Set New Password?</h3>
                    </section>

                    <section id="page_1" 
                        className="text-center margin-bottom-30" style={{display:(""+(that.state.current==0?"block":"none"))}}>
                        <div className="form-group">
                           
                            <div className="form-group col-sm-8 col-sm-offset-2" id="usr_email">
                                <input placeholder="New Password " type="password" className="form-control" id="usr_password" onChange={that.handleChange} value={p_ans.usr_password}></input>
                                {/*<span id="usr_email_input" class="help-inline control-label">Enter a New Password !</span>*/}
                            </div>
                            <div className="form-group col-sm-8 col-sm-offset-2" id="confirm-password">
                                <input placeholder="Confirm Password " type="password" className="form-control" id="usr_password_confirm" onChange={that.handleChange} value={p_ans.usr_password_confirm}></input>
                                {/*<span id="usr_email_input" class="help-inline control-label">Confirm Password !</span>*/}
                            </div>
                            <p className="col-sm-12 text-center"><span id="password_feedback">(Passwords must contain at least 8 characters, 1 special character, 1 uppercase letter and 1 number)</span></p>
                        </div>
                        <div className="question_nav">
                            <div className="form-group">
                
                                <button id="submitResetPassword" type="button" className={"btn gig_button background backgroundHover "+(that.checkFlow()==true?"color_1":"color_2 disabledButton")} onClick={that.submit}>Submit</button>
                            </div>
                        </div>
                    </section>      
                    <div class="modal fade" id="confirmModal" role="dialog" aria-labelledby="confirmModalLabel">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 class="modal-title text-center" id="confirmModalLabel">{that.state.header}!</h4>
                            </div>
                            <div class="modal-body text-center">
                                {that.state.message}
                            </div>
                            <div class="modal-footer">
                                <button id="gig_up" type="button" class="btn gig_button background backgroundHover color_2 " data-dismiss="modal" data-toggle="modal" data-target="#thankyouModal" onClick={that.alertMessage.bind(that)}>OK</button>
                            </div>
                            </div>
                        </div>
                    </div>      

                </section>
            </DocumentTitle>
        )
    }
    
}

export default ConfirmPassword;