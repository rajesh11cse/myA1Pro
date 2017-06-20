import React from 'react';
import {STRINGS} from '../_utility/constants';
import Nav from '../nav/nav';
import Footer from '../footer/footer';
import DocumentTitle from "react-document-title";
import { browserHistory } from 'react-router';

class ForgotPassword extends React.Component {

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
                usr_full_name : "",
                usr_email : "",
                usr_query : ""
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
            email : that.state.personal_answers.usr_email
        };
        if(dataToSend.email && dataToSend.email.trim() != ""){
            that.setState({message: "loading..."});
            // console.log(STRINGS.URL+STRINGS.AUTH+STRINGS.FORGOT_PASSWORD,dataToSend);
            $.ajax({
                url: STRINGS.URL+STRINGS.AUTH+STRINGS.FORGOT_PASSWORD,
                type: 'POST',
                cache: false,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(dataToSend),
                success: function(data) {
                    var password_msg = "Token has been sent to your email";
                    if(data.success ){
                        if(data.message){
                            password_msg = data.message;
                        }
                        $("#confirmModal").modal('show');
                        that.setState({message: password_msg, goToSignin: true, header: "congratulations"});
                    }else{
                    }

                }.bind(that),
                error: function(xhr, status, err) {
                    // console.error(STRINGS.URL+STRINGS.AUTH+STRINGS.FORGOT_PASSWORD, status, err, xhr);
                    var password_msg = err.toString();
                    if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                        password_msg = xhr.responseJSON.message;
                    }
                    $("#confirmModal").modal('show');
                    that.setState({message: password_msg, header: "Sorry"});
                }.bind(that)
            });
        }else{
            $("#confirmModal").modal('show');
            that.setState({message: "Email is not valid", header: "Sorry"});
        }
    }

    cancel(e){
        let that = this;
        var obj = e.target;
        var personal_answers = that.state.personal_answers;
        window.scrollTo(0, 0);
        personal_answers["usr_email"] = "";
        that.setState({
            personal_answers : personal_answers,
            goToSignin : false
        });
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

    validateEmail(email) {
        let re = REGEX.EMAIL;
        return re.test(email);
    }

    checkFlow(){
        let that = this;
        let p_ans = that.state.personal_answers;
        let current = that.state.current;
        switch(current){
            case 0 :
                var email_validitor_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                var flag = 0;
             
                var div_email = document.getElementById('usr_email');
         
                var div_email_input = document.getElementById('usr_email_input');
                
                if(( p_ans["usr_email"] && p_ans["usr_email"].length >= 2 )){
                    if(div_email && that.hasClass(div_email,"has-error")){
                        that.removeClass(div_email,"has-error");
                    }

                    if(email_validitor_regex.test(p_ans["usr_email"])){
                        if(div_email_input && !that.hasClass(div_email_input,"hide")){
                            that.addClass(div_email_input,"hide");
                        }

                        if(div_email && that.hasClass(div_email,"has-error")){
                            that.removeClass(div_email,"has-error");
                        }
                    }else{
                        flag = 1;
                        if(div_email_input && that.hasClass(div_email_input,"hide")){
                            that.removeClass(div_email_input,"hide");
                        }

                        if(div_email && !that.hasClass(div_email,"has-error")){
                            that.addClass(div_email,"has-error");
                        }
                    }
                }else{
                    flag = 1;
                    if(div_email_input && that.hasClass(div_email_input,"hide")){
                        that.removeClass(div_email_input,"hide");
                    }

                    if(div_email && !that.hasClass(div_email,"has-error")){
                        that.addClass(div_email,"has-error");
                    }
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

    generateNextButton(){
        let that = this;
        if(that.checkFlow()){
            return(
                // <button id="submitForgotPassword" type="button" className={"btn gig_button background backgroundHover "+(that.checkFlow()==true?"color_1":"color_2 disabledButton")} onClick={that.submit} data-toggle="modal" data-target="#confirmModal">Submit</button>
                <button id="submitForgotPassword" type="button" className={"btn gig_button background backgroundHover "+(that.checkFlow()==true?"color_1":"color_2 disabledButton")} onClick={that.submit}>Submit</button>
            );
        }else{
            return(
                <button id="submitForgotPassword" type="button" className={"btn gig_button background backgroundHover "+(that.checkFlow()==true?"color_1":"color_2 disabledButton")}>Submit</button>
            );
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
                        <h3 className="margin-bottom-15">Forgot Password?</h3>
                    </section>

                    <section id="page_1" 
                        className="text-center margin-bottom-30" style={{display:(""+(that.state.current==0?"block":"none"))}}>
                        <div className="form-group">
                           
                            <div className="form-group col-sm-8 col-sm-offset-2" id="usr_email">
                                <input placeholder="Email " type="email" className="form-control" id="usr_email" onChange={that.handleChange} value={p_ans.usr_email}></input>
                                <span id="usr_email_input" class="help-inline control-label hide">Enter a valid email !</span>
                            </div>
                         
                        </div>
                        <div className="question_nav">
                            <div className="form-group">
                                <button id="" type="button" className={"btn gig_button background backgroundHover color_2"} onClick={that.cancel}>Cancel</button>
                                {that.generateNextButton()}
                            </div>
                        </div>
                    </section>   
                    <div class="modal fade" id="confirmModal" role="dialog" aria-labelledby="confirmModalLabel">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 class="modal-title text-center" id="confirmModalLabel">{/*that.state.header*/}</h4>
                            </div>
                            <div class="modal-body text-center modelFontSize">
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

export default ForgotPassword;