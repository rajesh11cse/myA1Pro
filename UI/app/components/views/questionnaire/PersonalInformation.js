import React from 'react';
import Nav from '../../nav/nav';
import Footer from '../../footer/footer';
import DocumentTitle from 'react-document-title';
import { browserHistory } from 'react-router';
import {STRINGS,REGEX} from '../../_utility/constants';
import {Link} from 'react-router';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Phone, {phoneNumberFormat, isValidPhoneNumber} from 'react-phone-number-input';
import classNames from "classnames";



class PersonalInformation extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.goToNext = this.goToNext.bind(this);
        this.goToBack = this.goToBack.bind(this);
        
        this.handleChange = this.handleChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        
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
                usr_usr_phone: "",
                usr_email : "",
                usr_birthday : "",
                usr_password : "",
                usr_password_confirm : "",
            },
            dob:"",
            current : 0 ,
        };

        var userData = sessionStorage.getItem('data')||null;
        if(userData){
            userData = JSON.parse(userData);
        }
        if(userData){
            var a = userData.usr_birthday;
            var localTime = moment((a)).format("MM/DD/YYYY");
            state["dob"] = moment(localTime.toString(), "MM/DD/YYYY");
            userData.usr_birthday = state["dob"];
        }
        var loginData = sessionStorage.getItem('signedIn')||null;
        if(loginData){
            loginData = JSON.parse(loginData);
            if(userData){
                state.personal_answers = userData;
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
        // console.log("PersonalInformation setDataInState",that.state);
        that.setState(state);
    }
    
    componentDidMount(){
        let that = this;
        this.setDataInState();
        let ans;
        let p_ans;
        var loginData = sessionStorage.getItem('signedIn')||null;
	    try {
            var answers_data = null;
            if(loginData){
            }
            answers_data = sessionStorage.getItem('answers')||null;
            // console.log("sessionStorage answers_data", answers_data,JSON.parse(answers_data));
            const serializedState1 = answers_data;
            if (serializedState1 === null) {
              ans = undefined;
            }
            ans = JSON.parse(serializedState1);
            // console.log("sessionStorage ans", ans);
          } catch (err) {
            ans = undefined;
          }     
        try {
            var personal_answers_data = null;
            if(loginData){
                personal_answers_data = sessionStorage.getItem('data');
                personal_answers_data = JSON.parse(personal_answers_data);
            }
            const serializedState2 = personal_answers_data;
            // console.log("sessionStorage personal_answers_data", personal_answers_data);
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
            // $( "#usr_birthday" ).datepicker();
            var loginData = sessionStorage.getItem('signedIn')||null;
            if(loginData){
                var email = document.getElementById("usr_email");
                email.disabled = true;
                var password = document.getElementById("usr_password");
                password.disabled = true;
                var password_confirm = document.getElementById("usr_password_confirm");
                password_confirm.disabled = true;
            }

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
            if ( ( (step-1) == 2 ) &&  (!Array.isArray(ans["q-002"]) )){
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
        if( step<=2 && that.checkFlow() ){
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
                    firstName : p_ans.usr_first_name,
                    lastName : p_ans.usr_last_name,
                    nickName : p_ans.usr_nick_name,
                    dateOfBirth: p_ans.usr_birthday,
                    phone : p_ans.usr_phone,
                    addressLine1 : p_ans.usr_address_1,
                    addressLine2 : p_ans.usr_address_2,
                    city: p_ans.usr_city,
                    state: p_ans.usr_address_state,
                    zipCode: p_ans.usr_zip,
                    licenceNo: p_ans.usr_license_id,
                    licenceState: p_ans.usr_license_state,
                    licenceExpDate: p_ans.usr_license_exp
                };
                sessionStorage.setItem('data',JSON.stringify(p_ans));
                var token = sessionStorage.getItem('token')||null;
                var loginData = sessionStorage.getItem('signedIn')||null;
                
                if(loginData){
                    // console.log(STRINGS.UPDATE_USER_DETAILS,dataToSend);
                    $.ajax({
                        url: STRINGS.URL+STRINGS.API_PREFIX+STRINGS.UPDATE_USER_DETAILS,
                        // dataType: 'json',
                        type: 'PUT',
                        data: JSON.stringify(dataToSend),
                        headers: {
                                'Content-Type': 'application/json',
                                "Authorization" : token
                        },
                        success: function(data) {

                            var get_pid = sessionStorage.getItem("pid_list");
                            var totalPFs = sessionStorage.getItem("totalPFs");
                            var objectToSend = {
                                email : p_ans.usr_email,
                                matchedPFs : (get_pid)?get_pid.split(","):[],
                                totalPFs : (totalPFs)?totalPFs.split(","):[]
                            };
                            if(objectToSend.matchedPFs.length>0){
                                // console.log(STRINGS.UPDATE_MATCHES,objectToSend);
                                $.ajax({
                                    url: STRINGS.URL+STRINGS.API_PREFIX+STRINGS.UPDATE_MATCHES,
                                    // dataType: 'json',
                                    type: 'PUT',
                                    data: JSON.stringify(objectToSend),
                                    headers: {
                                            'Content-Type': 'application/json'
                                    },
                                    success: function(data) {
                                        that.submitQuistionnaire(that, p_ans);
                                    }.bind(this),
                                    error: function(xhr, status, err) {
                                        // console.error(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.UPDATE_MATCHES, status, err.toString());
                                        var password_msg = err.toString();
                                        if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                                            password_msg = xhr.responseJSON.message;
                                        }
                                        $("#alertModal").modal('show');
                                        that.setState({message: password_msg, header: "Sorry"});
                                    }.bind(this)
                                });
                            }
                        }.bind(this),
                        error: function(xhr, status, err) {
                            // console.error(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.UPDATE_USER_DETAILS, status, err.toString());
                            var password_msg = err.toString();
                            if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                                password_msg = xhr.responseJSON.message;
                            }
                            $("#alertModal").modal('show');
                            that.setState({message: password_msg, header: "Sorry"});
                        }.bind(this)
                    });
                }else{
                    dataToSend["email"] = p_ans.usr_email;
                    dataToSend["password"] = p_ans.usr_password;
                    dataToSend["confirmPassword"] = p_ans.usr_password_confirm;
                    // console.log(STRINGS.CREATE_USER,dataToSend);
                    $.ajax({
                        url: STRINGS.URL+STRINGS.API_PREFIX+STRINGS.CREATE_USER,
                        // dataType: 'json',
                        type: 'POST',
                        data: JSON.stringify(dataToSend),
                        headers: {
                                'Content-Type': 'application/json'
                        },
                        success: function(data) {
                            var get_pid = sessionStorage.getItem("pid_list");
                            var objectToSend = {
                                email : p_ans.usr_email,
                                matchedPFs : (get_pid)?get_pid.split(","):[]
                            };
                            if(objectToSend.matchedPFs.length>0){
                                // console.log(STRINGS.UPDATE_MATCHES,objectToSend);
                                $.ajax({
                                    url: STRINGS.URL+STRINGS.API_PREFIX+STRINGS.UPDATE_MATCHES,
                                    // dataType: 'json',
                                    type: 'PUT',
                                    data: JSON.stringify(objectToSend),
                                    headers: {
                                            'Content-Type': 'application/json'
                                    },
                                    success: function(data) {
                                        that.setState({goToSignin: true});
                                        that.submitQuistionnaire(that, p_ans);
                                    }.bind(this),
                                    error: function(xhr, status, err) {
                                        // console.error(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.UPDATE_MATCHES, status, err.toString());
                                        var password_msg = err.toString();
                                        if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                                            password_msg = xhr.responseJSON.message;
                                        }
                                        $("#alertModal").modal('show');
                                        that.setState({message: password_msg, header: "Sorry"});
                                    }.bind(this)
                                });
                            }
                        }.bind(this),
                        error: function(xhr, status, err) {
                            // console.error(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.CREATE_USER, status, err.toString());
                            var password_msg = err.toString();
                            if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                                password_msg = xhr.responseJSON.message;
                            }
                            $("#alertModal").modal('show');
                            that.setState({message: password_msg, header: "Sorry"});
                        }.bind(this)
                    });
                }
            }
            window.scrollTo(0, 0);
        }
    }

    submitQuistionnaire(that, p_ans){
        var answers = sessionStorage.getItem('answers')||null;
        if(answers && Object.keys(JSON.parse(answers)).length>2){
            answers = JSON.parse(answers);
            var ansToSend = {
                email : p_ans.usr_email,
                selectedQns : answers
            };
            // console.log(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.UPDATE_QUESTIONNAIRE);
            $.ajax({
                url: STRINGS.URL+STRINGS.API_PREFIX+STRINGS.UPDATE_QUESTIONNAIRE,
                type: 'PUT',
                data: JSON.stringify(ansToSend),
                cache: false,
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function(data) {
                    // console.log(STRINGS.UPDATE_QUESTIONNAIRE,data);
                    if(that.state.goToSignin){
                        browserHistory.push('index.html#/SignIn');
                        window.location.reload();
                    }
                    if(data.success && data.data){
                        // that.setState({questionnaire:data.data});
                    }else{
                    }

                }.bind(this),
                error: function(xhr, status, err) {
                    // console.error(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.UPDATE_QUESTIONNAIRE, status, err, xhr);
                    var password_msg = err.toString();
                    if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                        password_msg = xhr.responseJSON.message;
                    }
                    $("#alertModal").modal('show');
                    that.setState({message: password_msg, header: "Sorry"});
                }.bind(this)
            });
        }else{
            if(that.state.goToSignin){
                browserHistory.push('index.html#/SignIn');
                window.location.reload();
            }
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
        let current = that.state.current;
        var loginData = sessionStorage.getItem('signedIn')||null;
        if(loginData){
            if (
                        ( p_ans["usr_first_name"] && p_ans["usr_first_name"].length >= 2 ) &&
                        ( !REGEX.ALPHANUMERIC.test(p_ans["usr_first_name"]) ) &&
                        ( p_ans["usr_last_name"] && p_ans["usr_last_name"].length >= 2 ) &&
                        ( !REGEX.ALPHANUMERIC.test(p_ans["usr_last_name"]) ) &&
                        
                        ( p_ans["usr_address_1"] && p_ans["usr_address_1"].length >= 2 ) &&
                        ( p_ans["usr_city"] && p_ans["usr_city"].length >= 2 ) &&
                        ( !REGEX.ALPHANUMERIC.test(p_ans["usr_city"]) ) &&
                        ( p_ans["usr_zip"] && p_ans["usr_zip"].length >= 2 ) &&
                        ( that.validateZipCode(p_ans["usr_zip"]) ) &&
                        ( p_ans["usr_address_state"] && p_ans["usr_address_state"] != "-1" ) &&

                        ( p_ans["usr_license_state"] && p_ans["usr_license_state"] != "-1" ) &&
                        ( p_ans["usr_license_id"] && p_ans["usr_license_id"].length >= 2 ) &&
                        ( p_ans["usr_license_exp"] && that.validateExpiration(p_ans["usr_license_exp"]) ) &&

                        ( p_ans["usr_phone"] && p_ans["usr_phone"].length >= 12 ) &&
                        ( p_ans["usr_email"] && p_ans["usr_email"].length >= 2 ) &&
                        ( that.validateEmail(p_ans["usr_email"]) ) &&
                        (( p_ans["usr_birthday"] ) && that.validateDate(p_ans["usr_birthday"]) )
                    ){
                        return true;
                    }
        }else{
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
                        ( p_ans["usr_address_1"] && p_ans["usr_address_1"].length >= 2 ) &&
                        ( p_ans["usr_city"] && p_ans["usr_city"].length >= 2 ) &&
                        ( !REGEX.ALPHANUMERIC.test(p_ans["usr_city"]) ) &&
                        ( p_ans["usr_zip"] && p_ans["usr_zip"].length >= 2 ) &&
                        ( that.validateZipCode(p_ans["usr_zip"]) ) &&
                        ( p_ans["usr_address_state"] && p_ans["usr_address_state"] != "-1" ) 
                    ){
                        return true;
                    }
                break;
                case 2 :
                    if (
                        ( p_ans["usr_license_state"] && p_ans["usr_license_state"] != "-1" ) &&
                        ( p_ans["usr_license_id"] && p_ans["usr_license_id"].length >= 2 ) &&
                        ( p_ans["usr_license_exp"] && that.validateExpiration(p_ans["usr_license_exp"]) )
                    ){
                        return true;
                    }
                break;
                case 3 :
                    if (
                        ( p_ans["usr_phone"] && p_ans["usr_phone"].length >= 12 ) &&
                        ( p_ans["usr_email"] && p_ans["usr_email"].length >= 2 ) &&
                        ( that.validateEmail(p_ans["usr_email"]) ) &&
                        (( p_ans["usr_birthday"]) && that.validateDate(p_ans["usr_birthday"]) ) &&
                        (( that.validatePassword(p_ans["usr_password"]) ) && ( p_ans["usr_password"] && p_ans["usr_password_confirm"] ) && ( ( p_ans["usr_password"] == p_ans["usr_password_confirm"] ) ))
                        
                    ){
                        return true;
                    }
                break;
                default : 
                    return false
                break;
            }
        }
        return false;
    }
    
    generateNextButton(){
        let that = this;
        var loginData = sessionStorage.getItem('signedIn')||null;
        if(loginData){
            return(
             <div className="col-xs-12 question_nav text-center">
                {(that.checkFlow()==false) &&
                 <button id="" type="button" className={"btn gig_button background backgroundHover color_2 disabledButton"}>SUBMIT</button>
                }
                {(that.checkFlow()==true) &&
                 <button id="" type="button" className={"btn gig_button background backgroundHover color_1"} data-toggle="modal" data-target="#confirmModal">SUBMIT</button>
                }
                {/*<div>
                    <Link className="skip_link" to="/Match">skip this step... <i class="fa fa-refresh fa-fw"></i></Link>
                </div>*/}
            </div>
            );
             
        }else{
             return(
             <div className="col-xs-12 question_nav text-center">
                {that.state.current >0 &&
                 <button id="" type="button" className={"btn gig_button background backgroundHover color_2 hidden-lg hidden-md hidden-sm"} onClick={that.goToBack}>PREVIOUS</button>
                }
                {that.state.current <3 &&
                 <button id="" type="button" className={"btn gig_button background backgroundHover "+(that.checkFlow()==true?"color_1":"color_2 disabledButton")} onClick={that.goToNext}>NEXT</button>
                }
                {(that.state.current == 3 && that.checkFlow()==false) &&
                 <button id="" type="button" className={"btn gig_button background backgroundHover color_2 disabledButton"}>SUBMIT</button>
                }
                {(that.state.current == 3 && that.checkFlow()==true) &&
                 <button id="" type="button" className={"btn gig_button background backgroundHover color_1"} data-toggle="modal" data-target="#confirmModal">SUBMIT</button>
                }
                {/*<div>
                    <Link className="skip_link" to="/Match">skip this step... <i class="fa fa-refresh fa-fw"></i></Link>
                </div>*/}
            </div>
            );
        }
            
    }

    render() {
        
        let that = this;
        let p_ans = that.state.personal_answers;
        let ans = that.state.answers;
        var loginData = sessionStorage.getItem('signedIn')||null;
        if(loginData){
            loginData = JSON.parse(loginData);
        }
        // console.log("PersonalInformation render",p_ans["usr_address_state"],that.state);
        
        let usr_first_name_feedback = classNames({
            "form-control": p_ans.usr_first_name,
            "form-control has-error": (!p_ans.usr_first_name || ( p_ans["usr_first_name"].length < 2 )) ,
        });        
        let usr_last_name_feedback = classNames({
            "form-control": p_ans.usr_last_name,
            "form-control has-error": (!p_ans.usr_last_name || ( p_ans["usr_last_name"].length < 2 )),
        });        
        let usr_address_1_feedback = classNames({
            "form-control": p_ans.usr_address_1,
            "form-control has-error": (!p_ans.usr_address_1 || ( p_ans["usr_address_1"].length < 2 )),
        });         
        let usr_city_feedback = classNames({
            "form-control": p_ans.usr_city,
            "form-control has-error": (!p_ans.usr_city || ( p_ans["usr_city"].length < 2 )),
        });        
        let usr_address_state_feedback = classNames({
            "form-control": p_ans.usr_address_state,
            "form-control has-error": (!p_ans.usr_address_state || ( p_ans["usr_address_state"] == "-1" )),
        });        
        let usr_zip_feedback = classNames({
            "form-control": p_ans.usr_zip,
            "form-control has-error": ( !p_ans.usr_zip || 
                    (
                        ( p_ans["usr_zip"].length < 2 ) ||
                        ( !that.validateZipCode(p_ans["usr_zip"]))
                    )) ,
        });       
        let usr_license_state_feedback = classNames({
            "form-control": p_ans.usr_license_state,
            "form-control has-error": (!p_ans.usr_license_state || (p_ans["usr_license_state"] == "-1")),
        });        
        let usr_license_id_feedback = classNames({
            "form-control": p_ans.usr_license_id,
            "form-control has-error": (!p_ans.usr_license_id || p_ans["usr_license_id"].length < 2),
        });        
        let usr_license_exp_feedback = classNames({
            "form-control": p_ans.usr_license_exp,
            "form-control has-error": (!p_ans.usr_license_exp || !that.validateExpiration(p_ans["usr_license_exp"])),
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
                        (!that.validateDate(p_ans["usr_birthday"]))
                    ),
        });       
                    
        if(loginData){
            let usr_password_feedback = classNames({"form-control": true});        
            let usr_password_confirm_feedback = classNames({"form-control":true});
            return (
                <DocumentTitle title="GIG Personal Information">
                    <section className="personal_questionnaire container content_wrapper">
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
                                <div className="questionGroup text-center margin-bottom-30">
                                    <h3 className="margin-bottom-15">What’s Your Address?</h3>
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-6">
                                        <input placeholder="Address line 1" type="text" className={usr_address_1_feedback} id="usr_address_1" onChange={that.handleChange} value={p_ans.usr_address_1}></input>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <input placeholder="Address line 2" type="text" className="form-control" id="usr_address_2" onChange={that.handleChange} value={p_ans.usr_address_2}></input>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <input placeholder="City" type="text" className={usr_city_feedback} id="usr_city" onChange={that.handleChange} value={p_ans.usr_city}></input>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <div className="row">
                                            <div className="form-group col-sm-6">
                                                <select placeholder="State" className={usr_address_state_feedback} id="usr_address_state" onChange={that.handleChange} value={p_ans.usr_address_state}>
                                                    <option value="-1">State</option>
                                                    <option value="AL">AL</option>
                                                    <option value="AK">AK</option>
                                                    <option value="AZ">AZ</option>
                                                    <option value="AR">AR</option>
                                                    <option value="CA">CA</option>
                                                    <option value="CO">CO</option>
                                                    <option value="CT">CT</option>
                                                    <option value="DE">DE</option>
                                                    <option value="DC">DC</option>
                                                    <option value="FL">FL</option>
                                                    <option value="GA">GA</option>
                                                    <option value="HI">HI</option>
                                                    <option value="ID">ID</option>
                                                    <option value="IL">IL</option>
                                                    <option value="IN">IN</option>
                                                    <option value="IA">IA</option>
                                                    <option value="KS">KS</option>
                                                    <option value="KY">KY</option>
                                                    <option value="LA">LA</option>
                                                    <option value="ME">ME</option>
                                                    <option value="MD">MD</option>
                                                    <option value="MA">MA</option>
                                                    <option value="MI">MI</option>
                                                    <option value="MN">MN</option>
                                                    <option value="MS">MS</option>
                                                    <option value="MO">MO</option>
                                                    <option value="MT">MT</option>
                                                    <option value="NE">NE</option>
                                                    <option value="NV">NV</option>
                                                    <option value="NH">NH</option>
                                                    <option value="NJ">NJ</option>
                                                    <option value="NM">NM</option>
                                                    <option value="NY">NY</option>
                                                    <option value="NC">NC</option>
                                                    <option value="ND">ND</option>
                                                    <option value="OH">OH</option>
                                                    <option value="OK">OK</option>
                                                    <option value="OR">OR</option>
                                                    <option value="PA">PA</option>
                                                    <option value="RI">RI</option>
                                                    <option value="SC">SC</option>
                                                    <option value="SD">SD</option>
                                                    <option value="TN">TN</option>
                                                    <option value="TX">TX</option>
                                                    <option value="UT">UT</option>
                                                    <option value="VT">VT</option>
                                                    <option value="VA">VA</option>
                                                    <option value="WA">WA</option>
                                                    <option value="WV">WV</option>
                                                    <option value="WI">WI</option>
                                                    <option value="WY">WY</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-sm-6">
                                                <input placeholder="Zip Code" className={usr_zip_feedback} id="usr_zip" onChange={that.handleChange} value={p_ans.usr_zip} maxLength="10"></input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                { ( ans["q-002"] && ans["q-002"]!="-1" ) &&
                                    <div> 
                                <div className="questionGroup text-center margin-bottom-30">
                                    <h3 className="margin-bottom-15">And Driver’s License Information?</h3>
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-4">
                                        <input placeholder="License #" type="text" className={usr_license_id_feedback} id="usr_license_id" onChange={that.handleChange} value={p_ans.usr_license_id} maxLength="22"></input>
                                    </div>
                                    <div className="form-group col-sm-4">
                                        <select placeholder="License State" className={usr_license_state_feedback} id="usr_license_state" onChange={that.handleChange} value={p_ans.usr_license_state}>
                                            <option value="-1">License State</option>
                                            <option value="AL">AL</option>
                                            <option value="AK">AK</option>
                                            <option value="AZ">AZ</option>
                                            <option value="AR">AR</option>
                                            <option value="CA">CA</option>
                                            <option value="CO">CO</option>
                                            <option value="CT">CT</option>
                                            <option value="DE">DE</option>
                                            <option value="DC">DC</option>
                                            <option value="FL">FL</option>
                                            <option value="GA">GA</option>
                                            <option value="HI">HI</option>
                                            <option value="ID">ID</option>
                                            <option value="IL">IL</option>
                                            <option value="IN">IN</option>
                                            <option value="IA">IA</option>
                                            <option value="KS">KS</option>
                                            <option value="KY">KY</option>
                                            <option value="LA">LA</option>
                                            <option value="ME">ME</option>
                                            <option value="MD">MD</option>
                                            <option value="MA">MA</option>
                                            <option value="MI">MI</option>
                                            <option value="MN">MN</option>
                                            <option value="MS">MS</option>
                                            <option value="MO">MO</option>
                                            <option value="MT">MT</option>
                                            <option value="NE">NE</option>
                                            <option value="NV">NV</option>
                                            <option value="NH">NH</option>
                                            <option value="NJ">NJ</option>
                                            <option value="NM">NM</option>
                                            <option value="NY">NY</option>
                                            <option value="NC">NC</option>
                                            <option value="ND">ND</option>
                                            <option value="OH">OH</option>
                                            <option value="OK">OK</option>
                                            <option value="OR">OR</option>
                                            <option value="PA">PA</option>
                                            <option value="RI">RI</option>
                                            <option value="SC">SC</option>
                                            <option value="SD">SD</option>
                                            <option value="TN">TN</option>
                                            <option value="TX">TX</option>
                                            <option value="UT">UT</option>
                                            <option value="VT">VT</option>
                                            <option value="VA">VA</option>
                                            <option value="WA">WA</option>
                                            <option value="WV">WV</option>
                                            <option value="WI">WI</option>
                                            <option value="WY">WY</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-sm-4">
                                        <input placeholder="Expiration MM/YY" type="text" className={usr_license_exp_feedback} id="usr_license_exp" onChange={that.handleChange} value={p_ans.usr_license_exp} maxLength="7"></input>
                                    </div>
                                </div>
                                </div>
                            }
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
                                    </div>
                                    {/*<div className="form-group col-sm-6">
                                        <input placeholder="Create Password" type="password" className={usr_password_feedback} id="usr_password" onChange={that.handleChange} value={p_ans.usr_password||"A@2asdas"}></input>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <input placeholder="Confirm Password" type="password" className={usr_password_confirm_feedback} id="usr_password_confirm" onChange={that.handleChange} value={p_ans.usr_password_confirm||"A@2asdas"}></input>
                                    </div>*/}
                                    {/*<p className="col-sm-12 text-left"><span id="password_feedback">(Passwords must contain at least 1 special character, 1 uppercase letter and 1 number)</span></p>*/}
                                </div>
                                {that.generateNextButton()}
                            </section>

                            <div class="modal fade" id="confirmModal" role="dialog" aria-labelledby="confirmModalLabel">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 class="modal-title text-center" id="confirmModalLabel">Important!</h4>
                                </div>
                                <div class="modal-body">
                                    We’ve gotten everything we needed. By clicking on GIG UP below, you authorize us to securely transfer the information you provided to us to each of the companies you chose.
                                </div>
                                <div class="modal-footer">
                                    <Link className={"btn gig_button background backgroundHover color_2"} onClick={()=>{window.location.href = "/#/Match"}} data-dismiss="modal">DISAGREE</Link>
                                    <button id="gig_up" type="button" class="btn gig_button background backgroundHover color_2 hvr-buzz-out" data-dismiss="modal" data-toggle="modal" data-target="#thankyouModal">GIG UP !</button>
                                </div>
                                </div>
                            </div>
                            </div>
                            
                            <div class="modal fade" id="thankyouModal" role="dialog" aria-labelledby="thankyouModalLabel">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 class="modal-title text-center" id="thankyouModalLabel">Thank you!</h4>
                                </div>
                                <div class="modal-body">
                                    Your information will be shared with your chosen companies within 24 hours. They will contact you directly to move forward with their hiring processes.
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn gig_button background backgroundHover color_2" data-dismiss="modal" onClick={that.submit.bind(that)}>CLOSE</button> {/*onClick={()=>{window.location.href = "/#/Home"}}*/}
                                </div>
                                </div>
                            </div>
                            </div>
                            
                    </div>
                    </section>
                </DocumentTitle>
            )
        }else{
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
                    <section className="personal_questionnaire container content_wrapper">
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
                                    <h3 className="margin-bottom-15">What’s Your Address?</h3>
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-6">
                                        <input placeholder="Address line 1" type="text" className={usr_address_1_feedback} id="usr_address_1" onChange={that.handleChange} value={p_ans.usr_address_1}></input>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <input placeholder="Address line 2" type="text" className="form-control" id="usr_address_2" onChange={that.handleChange} value={p_ans.usr_address_2}></input>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <input placeholder="City" type="text" className={usr_city_feedback} id="usr_city" onChange={that.handleChange} value={p_ans.usr_city}></input>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <div className="row">
                                            <div className="form-group col-sm-6">
                                                <select placeholder="State" className={usr_address_state_feedback} id="usr_address_state" onChange={that.handleChange} value={p_ans.usr_address_state}>
                                                    <option value="-1">State</option>
                                                    <option value="AL">AL</option>
                                                    <option value="AK">AK</option>
                                                    <option value="AZ">AZ</option>
                                                    <option value="AR">AR</option>
                                                    <option value="CA">CA</option>
                                                    <option value="CO">CO</option>
                                                    <option value="CT">CT</option>
                                                    <option value="DE">DE</option>
                                                    <option value="DC">DC</option>
                                                    <option value="FL">FL</option>
                                                    <option value="GA">GA</option>
                                                    <option value="HI">HI</option>
                                                    <option value="ID">ID</option>
                                                    <option value="IL">IL</option>
                                                    <option value="IN">IN</option>
                                                    <option value="IA">IA</option>
                                                    <option value="KS">KS</option>
                                                    <option value="KY">KY</option>
                                                    <option value="LA">LA</option>
                                                    <option value="ME">ME</option>
                                                    <option value="MD">MD</option>
                                                    <option value="MA">MA</option>
                                                    <option value="MI">MI</option>
                                                    <option value="MN">MN</option>
                                                    <option value="MS">MS</option>
                                                    <option value="MO">MO</option>
                                                    <option value="MT">MT</option>
                                                    <option value="NE">NE</option>
                                                    <option value="NV">NV</option>
                                                    <option value="NH">NH</option>
                                                    <option value="NJ">NJ</option>
                                                    <option value="NM">NM</option>
                                                    <option value="NY">NY</option>
                                                    <option value="NC">NC</option>
                                                    <option value="ND">ND</option>
                                                    <option value="OH">OH</option>
                                                    <option value="OK">OK</option>
                                                    <option value="OR">OR</option>
                                                    <option value="PA">PA</option>
                                                    <option value="RI">RI</option>
                                                    <option value="SC">SC</option>
                                                    <option value="SD">SD</option>
                                                    <option value="TN">TN</option>
                                                    <option value="TX">TX</option>
                                                    <option value="UT">UT</option>
                                                    <option value="VT">VT</option>
                                                    <option value="VA">VA</option>
                                                    <option value="WA">WA</option>
                                                    <option value="WV">WV</option>
                                                    <option value="WI">WI</option>
                                                    <option value="WY">WY</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-sm-6">
                                                <input placeholder="Zip Code" className={usr_zip_feedback} id="usr_zip" onChange={that.handleChange} value={p_ans.usr_zip} maxLength="10"></input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {that.generateNextButton()}
                            </section>    
                                            
                            { ( ans["q-002"] && ans["q-002"]!="-1" ) &&
                            <section id="page_3" 
                                className="questionGroup text-center col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 margin-bottom-30" style={{display:(""+(that.state.current==2?"block":"none"))}}>
                                <div className="questionGroup text-center margin-bottom-30">
                                    <h3 className="margin-bottom-15">And Driver’s License Information?</h3>
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-4">
                                        <input placeholder="License #" type="text" className={usr_license_id_feedback} id="usr_license_id" onChange={that.handleChange} value={p_ans.usr_license_id} maxLength="22"></input>
                                    </div>
                                    <div className="form-group col-sm-4">
                                        <select placeholder="License State" className={usr_license_state_feedback} id="usr_license_state" onChange={that.handleChange} value={p_ans.usr_license_state}>
                                            <option value="-1">License State</option>
                                            <option value="AL">AL</option>
                                            <option value="AK">AK</option>
                                            <option value="AZ">AZ</option>
                                            <option value="AR">AR</option>
                                            <option value="CA">CA</option>
                                            <option value="CO">CO</option>
                                            <option value="CT">CT</option>
                                            <option value="DE">DE</option>
                                            <option value="DC">DC</option>
                                            <option value="FL">FL</option>
                                            <option value="GA">GA</option>
                                            <option value="HI">HI</option>
                                            <option value="ID">ID</option>
                                            <option value="IL">IL</option>
                                            <option value="IN">IN</option>
                                            <option value="IA">IA</option>
                                            <option value="KS">KS</option>
                                            <option value="KY">KY</option>
                                            <option value="LA">LA</option>
                                            <option value="ME">ME</option>
                                            <option value="MD">MD</option>
                                            <option value="MA">MA</option>
                                            <option value="MI">MI</option>
                                            <option value="MN">MN</option>
                                            <option value="MS">MS</option>
                                            <option value="MO">MO</option>
                                            <option value="MT">MT</option>
                                            <option value="NE">NE</option>
                                            <option value="NV">NV</option>
                                            <option value="NH">NH</option>
                                            <option value="NJ">NJ</option>
                                            <option value="NM">NM</option>
                                            <option value="NY">NY</option>
                                            <option value="NC">NC</option>
                                            <option value="ND">ND</option>
                                            <option value="OH">OH</option>
                                            <option value="OK">OK</option>
                                            <option value="OR">OR</option>
                                            <option value="PA">PA</option>
                                            <option value="RI">RI</option>
                                            <option value="SC">SC</option>
                                            <option value="SD">SD</option>
                                            <option value="TN">TN</option>
                                            <option value="TX">TX</option>
                                            <option value="UT">UT</option>
                                            <option value="VT">VT</option>
                                            <option value="VA">VA</option>
                                            <option value="WA">WA</option>
                                            <option value="WV">WV</option>
                                            <option value="WI">WI</option>
                                            <option value="WY">WY</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-sm-4">
                                        <input placeholder="Expiration MM/YY" type="text" className={usr_license_exp_feedback} id="usr_license_exp" onChange={that.handleChange} value={p_ans.usr_license_exp} maxLength="7"></input>
                                    </div>
                                </div>
                                {that.generateNextButton()}
                            </section>}     
                                            
                            <section id="page_4" 
                                className="questionGroup text-center col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 margin-bottom-30" style={{display:(""+(that.state.current==3?"block":"none"))}}>
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
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <input placeholder="Create Password" type="password" className={usr_password_feedback} id="usr_password" onChange={that.handleChange} value={p_ans.usr_password}></input>
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <input placeholder="Confirm Password" type="password" className={usr_password_confirm_feedback} id="usr_password_confirm" onChange={that.handleChange} value={p_ans.usr_password_confirm}></input>
                                    </div>
                                    <p className="col-sm-12 text-left"><span id="password_feedback">(Passwords must contain at least 1 special character, 1 uppercase letter and 1 number)</span></p>
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
                                        <button id="gig_up" type="button" class="btn gig_button background backgroundHover color_2 " data-dismiss="modal" data-toggle="modal" onClick={that.alertMessage.bind(that)}>OK</button>
                                    </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal fade" id="confirmModal" role="dialog" aria-labelledby="confirmModalLabel">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 class="modal-title text-center" id="confirmModalLabel">Important!</h4>
                                </div>
                                <div class="modal-body">
                                    We’ve gotten everything we needed. By clicking on GIG UP below, you authorize us to securely transfer the information you provided to us to each of the companies you chose.
                                </div>
                                <div class="modal-footer">
                                    <Link className={"btn gig_button background backgroundHover color_2"} onClick={()=>{window.location.href = "/#/Match"}} data-dismiss="modal">DISAGREE</Link>
                                    <button id="gig_up" type="button" class="btn gig_button background backgroundHover color_2 hvr-buzz-out" data-dismiss="modal" data-toggle="modal" data-target="#thankyouModal">GIG UP !</button>
                                </div>
                                </div>
                            </div>
                            </div>
                            
                            <div class="modal fade" id="thankyouModal" role="dialog" aria-labelledby="thankyouModalLabel">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <h4 class="modal-title text-center" id="thankyouModalLabel">Thank you!</h4>
                                </div>
                                <div class="modal-body">
                                    Your information will be shared with your chosen companies within 24 hours. They will contact you directly to move forward with their hiring processes.
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn gig_button background backgroundHover color_2" data-dismiss="modal" onClick={that.submit.bind(that)}>CLOSE</button> {/*onClick={()=>{window.location.href = "/#/Home"}}*/}
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
    
}

export default PersonalInformation;