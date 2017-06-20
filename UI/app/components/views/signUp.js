import React from 'react';
import Nav from '../nav/nav';
import Footer from '../footer/footer';
import DocumentTitle from 'react-document-title';
import { browserHistory } from 'react-router';
import {STRINGS,REGEX,DB_MAP_UI} from '../_utility/constants';
import {Link} from 'react-router';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Phone, {phoneNumberFormat, isValidPhoneNumber} from 'react-phone-number-input';
import classNames from "classnames";


class SignUp extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.goToNext = this.goToNext.bind(this);
        this.goToBack = this.goToBack.bind(this);
        this.dobChange = this.dobChange.bind(this);
        
        this.handleChange = this.handleChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        var dynamicLogin = sessionStorage.getItem("dynamicLogin")||null;
        var state = {
            goToSignin : false,
            header: "Sorry",
            message : "loading ...",
            answers : {},
            personal_answers : {
                usr_first_name : "",
                usr_last_name : "",
                usr_nick_name : "",
                usr_address_1 : "",
                usr_address_2 : "",
                usr_city : "",
                usr_address_state : "",
                usr_zip : "",
                usr_license_state : "",
                usr_license_id : "",
                usr_license_exp : "",
                usr_phone: "",
                usr_email : "",
                usr_birthday : "",
                usr_password : "",
                usr_password_confirm : "",
            },
            dob:"",
            current : 0 ,
        };
        if(dynamicLogin){
            dynamicLogin = JSON.parse(dynamicLogin);
            if(dynamicLogin && dynamicLogin.email){
                state.personal_answers.usr_email = dynamicLogin.email;
            }
            if(dynamicLogin && dynamicLogin.name){
                var temp_name = (dynamicLogin.name).split(" ");
                if(temp_name.length>1){
                    for(var index = 0; index<temp_name.length; index++){
                        if(index == 0){
                            state.personal_answers.usr_first_name = temp_name[index];
                        }else{
                            state.personal_answers.usr_last_name += " "+temp_name[index];
                        }
                    }
                }else{
                    state.personal_answers.usr_first_name = dynamicLogin.name;
                }
            }
        }

        this.state = state;
    }

    alertMessage(){
        let that = this;
        if(that.state.goToSignin){
            browserHistory.push('index.html#/SignIn');
            window.location.reload();
        }
    }
    
    setDataInState() { //q-002
        var that = this;      
        var state = that.state;
        that.setState(state);
    }
    
    componentDidMount(){
        let that = this;
        this.setDataInState();
        let ans;
        let p_ans;
        var loginData = sessionStorage.getItem('signedIn')||null;
	    try {
            var answers_data = (loginData)?sessionStorage.getItem('answers'):null;
            const serializedState1 = answers_data;
            if (serializedState1 === null) {
              ans = undefined;
            }
            ans = JSON.parse(serializedState1);
          } catch (err) {
            ans = undefined;
          }     
        try {
            var personal_answers_data = (loginData)?sessionStorage.getItem('personal_answers'):null;
            const serializedState2 = personal_answers_data;
            if (serializedState2 === null) {
              p_ans = undefined;
            }
            p_ans = JSON.parse(serializedState2);
          } catch (err) {
            p_ans = undefined;
          }
        if (ans!=undefined){
            that.setState({
                answers : ans
            },function(){
                //console.log(that.state.answers)
            })
        }
        if (p_ans!=undefined){
            that.setState({
                personal_answers : p_ans
            },function(){
                //console.log(that.state.answers)
            })
        }
    }

    componentDidUpdate(){
       let that = this; 
       let p_ans = that.state.personal_answers;
       try {
            var serializedState2 = JSON.stringify(p_ans);
            sessionStorage.setItem('personal_answers', serializedState2);
          } catch (err) {
            // Ignore write errors.
          }
    }

    goToBack(e){
        let that = this;
        let step = that.state.current;
        let ans = that.state.answers;
        var obj = e.target;
        if(step>=1){
            if (( (step-1) == 2 ) &&  (!Array.isArray(ans["q-002"]) )){
                that.setState({
                    current : 1,
                })
            }else{
                that.setState({
                    current : step-=1,
                })
            }
        }
        window.scrollTo(0, 0);
    }
    
    goToNext(e){
        let that = this;
        var obj = e.target;
        let ans = that.state.answers;
        let step = that.state.current;
        if( step<=1 && that.checkFlow() ){
            if ( ( (step+1) == 2 ) && (!Array.isArray(ans["q-002"]) )){ 
                that.setState({
                    current : 3,
                })
            }else{
                that.setState({
                    current : step+=1,
                })
            } 
        }
        window.scrollTo(0, 0);
    }
    
    handleChange(e){
        let that = this;
        var obj = e.target;
        var id = $(obj).attr("id");
        var value = $(obj).val();
        //value = value.replace(/[^A-Z0-9\-\'\/\ ]+/i, '');
        var personal_answers = that.state.personal_answers;
        personal_answers[id]=value;
        that.setState({
            personal_answers : personal_answers,
        },function(){
            //console.log(that.state.personal_answers);
        });
    }

    dobChange(date) { 
        
        var state = this.state; 
        var personal_answers = this.state.personal_answers;
        personal_answers["usr_birthday"]=date;
        
        var a = JSON.stringify(date);
        debugger;
        var localTime = moment(JSON.parse(a)).format("MM/DD/YYYY");
        var hardTime = moment("2017-05-30T00:00:00.000Z").format('MM/DD/YYYY');
        // console.log("date_date",date,hardTime,JSON.stringify(date),localTime,a);
        // console.log(moment(localTime.toString(), "MM/DD/YYYY"));
        state.dob = date; 
        state.personal_answers = personal_answers; 
        this.setState(state); 
        // this.handleFieldError(); 
    }

    submit(e){
        let that = this;
        if(that){
            var obj = e.target;
            let p_ans = that.state.personal_answers;
            if(that.checkFlow()){
                var dataToSend = {
                    email : p_ans.usr_email,
                    password : p_ans.usr_password,
                    confirmPassword : p_ans.usr_password_confirm,
                    phone : p_ans.usr_phone,
                    firstName : p_ans.usr_first_name,
                    lastName : p_ans.usr_last_name,
                    nickName : p_ans.usr_nick_name,
                    dateOfBirth : p_ans.usr_birthday
                };
                $.ajax({
                    url: STRINGS.URL+STRINGS.API_PREFIX+STRINGS.CREATE_USER,
                    // dataType: 'json',
                    type: 'POST',
                    data: JSON.stringify(dataToSend),
                    headers: {
                            'Content-Type': 'application/json'
                    },
                    success: function(data) {


                        var response = sessionStorage.getItem("dynamicLogin")||null;
                        var userData = {};
                        if(response){
                            response = JSON.parse(response);
                            if(response.email){
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
                                        var password_msg = "error";
                                        if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                                            password_msg = xhr.responseJSON.message;
                                        }
                                        $("#alertModal").modal('show');
                                        that.setState({message: password_msg, header: "Sorry"});
                                    }.bind(this)
                                });
                            }       
                        }else{
                            sessionStorage.setItem('data',JSON.stringify(p_ans));
                            browserHistory.push('index.html#/SignIn');
                            window.location.reload();
                        }


                    }.bind(this),
                    error: function(xhr, status, err) {
                        // console.error(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.CREATE_USER, status, err,xhr);
                        var password_msg = err.toString();
                        if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                            password_msg = xhr.responseJSON.message;
                        }
                        $("#alertModal").modal('show');
                        that.setState({message: password_msg, header: "Sorry"});
                    }.bind(this)
                });
                
            }
            window.scrollTo(0, 0);
        }
    }
    
    validateEmail(email) {
        let re = REGEX.EMAIL;
        return re.test(email);
    }

    validateZipCode(zip) {
        let re = REGEX.ZIP;
        return re.test(zip);
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
    
    validateExpiration(date) {
        let re = REGEX.EXPDATE;
        if ( re.test(date) ){
            let breakDate = date.split("/");
            let month = (new Date().getMonth())+1; 
            let year = new Date().getFullYear(); 
            let uMonth = parseInt(breakDate[0]);
            let uYear = parseInt(breakDate[1]);
            if ( uYear < 100 ){
                uYear = uYear+(parseInt(year/1000)*1000);
            }
            if ( 
                uYear > year ||
                (( year == uYear ) && ( uMonth >= month )) 
            ){
                return true;
            }
        }
        //return re.test(date);
        return false;
    }    
    
    validateDate(date) {
        let isValid = (
                ( moment(date, "MM/DD/YYYY", true).isValid() || moment(date, "MM/DD/YY", true).isValid() ) && 
                ( moment().diff(date) > 0 ) &&
                ( moment().subtract("years", 18).diff(date) >= 0 )
        );
        return isValid;
    }
    
    handlePhoneChange(val) {
        var state = this.state;
        state.personal_answers.usr_phone = val;
        this.setState(state);
    }
    
    checkFlow(){
        let that = this;
        let p_ans = that.state.personal_answers;
        let password_feedback = document.getElementById('password_feedback');
        let current = that.state.current;
        switch(current){
            case 0 :
                if (
                     ( p_ans["usr_first_name"] && p_ans["usr_first_name"].length >= 2 ) &&
                     ( !REGEX.ALPHANUMERIC.test(p_ans["usr_first_name"]) ) &&
                     ( p_ans["usr_last_name"] && p_ans["usr_last_name"].length >= 2 ) &&
                     ( !REGEX.ALPHANUMERIC.test(p_ans["usr_last_name"]) ) 
                ){
                    return true;
                }
            break;
            case 1 :
                if (
                     ( p_ans["usr_phone"] && p_ans["usr_phone"].length >= 12 ) &&
                     ( p_ans["usr_email"] && p_ans["usr_email"].length >= 2 ) &&
                     ( that.validateEmail(p_ans["usr_email"]) ) &&
                     (( p_ans["usr_birthday"] ) && that.validateDate(p_ans["usr_birthday"]) ) &&
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
    
    generateNextButton(){
        let that = this;
             return(
             <div className="col-xs-12 question_nav text-center">
                {that.state.current >0 &&
                 <button id="" type="button" className={"btn gig_button background backgroundHover color_2 hidden-lg hidden-md hidden-sm"} onClick={that.goToBack}>PREVIOUS</button>
                }
                {that.state.current <1 &&
                 <button id="" type="button" className={"btn gig_button background backgroundHover "+(that.checkFlow()==true?"color_1":"color_2 disabledButton")} onClick={that.goToNext}>NEXT</button>
                }
                {(that.state.current == 1 && that.checkFlow()==false) &&
                 <button id="" type="button" className={"btn gig_button background backgroundHover color_2 disabledButton"}>SUBMIT</button>
                }
                {(that.state.current == 1 && that.checkFlow()==true) &&
                 <button id="submit_button_input" type="button" className={"btn gig_button background backgroundHover color_1"} onClick={that.submit.bind(that)}>SUBMIT</button>
                }
                {/*<div>
                    <Link className="skip_link" to="/Match">skip this step... <i class="fa fa-refresh fa-fw"></i></Link>
                </div>*/}
            </div>
        );
    }

    render() {
        
        let that = this;
        let p_ans = that.state.personal_answers;
        let ans = that.state.answers;
        
        let usr_first_name_feedback = classNames({
            "form-control": p_ans.usr_first_name,
            "form-control has-error": (!p_ans.usr_first_name || ( p_ans["usr_first_name"].length < 2 )) ,
        });        
        let usr_last_name_feedback = classNames({
            "form-control": p_ans.usr_last_name,
            "form-control has-error": (!p_ans.usr_last_name || ( p_ans["usr_last_name"].length < 2 )),
        });        
        let usr_phone_feedback = classNames({
            "form-control": p_ans.usr_phone,
            "form-control has-error": ( !p_ans.usr_phone || p_ans["usr_phone"].length < 12 ),
        });        
        let usr_email_feedback = classNames({
            "form-control": p_ans.usr_email,
            "form-control has-error": (!p_ans.usr_email || 
                        ( p_ans["usr_email"].length < 2 ) ||
                        ( !that.validateEmail(p_ans["usr_email"]) )
                     ),
        });        
        let usr_birthday_feedback = classNames({
            "form-control": p_ans.usr_birthday,
            "form-control has-error": ( !p_ans.usr_birthday || 
                        (p_ans["usr_birthday"].length < 2  || !that.validateDate(p_ans["usr_birthday"]))
                    ),
        });       
        let usr_password_feedback = classNames({
            "form-control": ( ( that.validatePassword(p_ans["usr_password"]) ) && ((!p_ans.usr_password && !p_ans.usr_password_confirm) || (p_ans.usr_password.length==0 && p_ans.usr_password_confirm.length==0)) || (( p_ans["usr_password"] == p_ans["usr_password_confirm"] ))),
            "form-control has-error": (
            (( p_ans["usr_password"] && !p_ans["usr_password_confirm"] ) || 
                ( ( p_ans["usr_password"] != p_ans["usr_password_confirm"] ) ) ||
                ( ( p_ans["usr_password"] == p_ans["usr_password_confirm"] ) && ( !that.validatePassword(p_ans["usr_password"]) ) && p_ans["usr_password"].length>0)
            )),
        });        
        let usr_password_confirm_feedback = classNames({
            "form-control": ( ( that.validatePassword(p_ans["usr_password"]) ) && ((!p_ans.usr_password && !p_ans.usr_password_confirm) || (p_ans.usr_password.length==0 && p_ans.usr_password_confirm.length==0)) || (( p_ans["usr_password"] == p_ans["usr_password_confirm"] ))),
            "form-control has-error": (
            (( !p_ans["usr_password"] && p_ans["usr_password_confirm"] ) || 
                ( ( p_ans["usr_password"] != p_ans["usr_password_confirm"] ) ) ||
                ( ( p_ans["usr_password"] == p_ans["usr_password_confirm"] ) && ( !that.validatePassword(p_ans["usr_password"]) ) && p_ans["usr_password"].length>0 )
            )),
        });        
        
        return (
            <DocumentTitle title="GIG Personal Information">
                <section className="questionnaire_container personal_questionnaire container-fluid">
                   <style>{`body{background-color:#ededed;}`}</style>
                   <div className="container">
                        {that.state.current >0 &&
                            <img className="prev_arrow hidden-xs" onClick={that.goToBack} src="public/img/icons/left_arrow.png"></img>
                        }
                        
                        <section id="page_1" 
                            className="questionGroup text-center col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 margin-bottom-30" style={{display:(""+(that.state.current==0?"block":"none"))}}>
                            <div className="questionGroup text-center margin-bottom-30">
                                <h3 className="margin-bottom-15">You’re almost finished! Before we can securely transfer your information over to the companies you selected, we just need to get your basic info.</h3>
                            </div>
                            <div className="row">
                                <div className="form-group col-sm-4">
                                    <input placeholder="First Name" type="text" className={usr_first_name_feedback} id="usr_first_name" onChange={that.handleChange} value={p_ans.usr_first_name}></input>
                                </div>
                                <div className="form-group col-sm-4">
                                    <input placeholder="Last Name " type="text" className={usr_last_name_feedback} id="usr_last_name" onChange={that.handleChange} value={p_ans.usr_last_name}></input>
                                </div>
                                <div className="form-group col-sm-4">
                                    <input placeholder="Nickname (optional)" type="text" className="form-control" id="usr_nick_name" onChange={that.handleChange} value={p_ans.usr_nick_name}></input>
                                </div>
                                
                            </div>
                            {that.generateNextButton()}
                        </section>      
                                         
                            
                                          
                        <section id="page_2" 
                            className="questionGroup text-center col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 margin-bottom-30" style={{display:(""+(that.state.current==1?"block":"none"))}}>
                            <div className="questionGroup text-center margin-bottom-30">
                                <h3 className="margin-bottom-15">And, finally, what’s the best way for these companies to contact you?</h3>
                            </div>
                            <div className="row">
                                <div className="form-group col-sm-5">
                                    <input placeholder="Email address" type="text" className={usr_email_feedback} id="usr_email" onChange={that.handleChange} value={p_ans.usr_email}></input>
                                </div>
                               <div className="form-group col-sm-3">
                                    <Phone
                                        id="usr_phone"
                                        placeholder="Phone"
                                        format={phoneNumberFormat.US}
                                        value={this.state.personal_answers.usr_phone}
                                        onChange={that.handleChange}
                                        onChange={(val) => this.handlePhoneChange(val)}
                                        className={usr_phone_feedback} />
                                </div>
                                <div className="form-group col-sm-4">
                                    <DatePicker
                                        placeholder="Birthday" className={usr_birthday_feedback} id="usr_birthday"
                                        value={p_ans.usr_birthday}
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        dateFormat="MM/DD/YYYY"
                                        placeholderText="Date of Birth"
                                        onChange={(date) => {
                                            this.dobChange(date)
                                        }}
                                        selected={(this.state.dob != '') ? this.state.dob : null}
                                    />
                                     
                                </div><div className="form-group col-sm-6">
                                    <input placeholder="Create Password" type="password" className={usr_password_feedback} id="usr_password" onChange={that.handleChange} value={p_ans.usr_password}></input>
                                </div>
                                <div className="form-group col-sm-6">
                                    <input placeholder="Confirm Password" type="password" className={usr_password_confirm_feedback} id="usr_password_confirm" onChange={that.handleChange} value={p_ans.usr_password_confirm}></input>
                                </div>
                                <p className="col-sm-12 text-left"><span id="password_feedback">(Passwords must contain at least 8 characters, 1 special character, 1 uppercase letter and 1 number)</span></p>
                            </div>
                            {that.generateNextButton()}
                        </section>
                        <div class="modal fade" id="alertModal" role="dialog" aria-labelledby="confirmModalLabel">
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
                   </div>
                 </section>
            </DocumentTitle>
        )
    }
    
}

export default SignUp;