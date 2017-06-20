import React from 'react';
import Nav from '../nav/nav';
import Footer from '../footer/footer';
import DocumentTitle from "react-document-title";
import { browserHistory } from 'react-router';
import {STRINGS,REGEX,DB_MAP_UI} from '../_utility/constants';
import {Link} from 'react-router';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Phone, {phoneNumberFormat, isValidPhoneNumber} from 'react-phone-number-input';
import classNames from "classnames";
import ProfileQuestionnaire from './profileQuestionnaire';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        let that = this;
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.toggleSelect = this.toggleSelect.bind(this);

        var userData = sessionStorage.getItem('data')||JSON.stringify({});
        var token = sessionStorage.getItem('token')||null;
        if(userData){
            userData = JSON.parse(userData);
        }

        var state = {
            goToSignin : false,
            message : "loading ...",
            header : "Sorry",
            alertLeftMargin : {"margin-left": "5%"},
            personal_answers : userData,
            current : 0 ,
            disableDate : true,
            platforms : [],
            flow : [],
            answers : {"q-001":"1","q-002":["2"],"q-003":"1","q-004":"1","q-005":"1","q-006":"1","q-006-01":["3"],"q-007":"1","q-007-02":"1"},
            selected : []
        };

        // console.log(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.USER_DETAILS,userData);
        $.ajax({
            url: STRINGS.URL+STRINGS.API_PREFIX+STRINGS.USER_DETAILS,
            type: 'GET',
            cache: false,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            success: function(data) {
                if(data.success && userData){
                    for(var key in DB_MAP_UI){
                        if(key=="usr_phone" && DB_MAP_UI[key] && DB_MAP_UI[key]["db"]!=null){
                            var ph = data.data[DB_MAP_UI[key]["db"]];
                            if(!(ph.toString()).includes("+")){
                                ph = "+"+ph;
                            }
                            userData[key] = ph;
                        }
                        else if(DB_MAP_UI[key] && DB_MAP_UI[key]["db"]!=null){
                            userData[key] = data.data[DB_MAP_UI[key]["db"]];
                        }else if(DB_MAP_UI[key]["db"]!=null){
                            userData[key] = "";
                        }
                    }
                }else{
                }

                if(userData){
                    var a = userData.usr_birthday;
                    var localTime = moment((a)).format("MM/DD/YYYY");
                    state["dob"] = moment(localTime.toString(), "MM/DD/YYYY");
                    userData.usr_birthday = state["dob"];
                }else{
                    state["dob"] = "";
                }

                state["personal_answers"] = userData;
                that.state = state;
                that.setDataInState();

            }.bind(this),
            error: function(xhr, status, err) {
                // console.error(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.USER_DETAILS, status, err, xhr);
                var password_msg = err.toString();
                if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                    password_msg = xhr.responseJSON.message;
                }
                $("#confirmModal").modal('show');
                var objetToUpdate = {message: password_msg, header: "Sorry"};
                if(password_msg.includes("Unauthorized")){
                    objetToUpdate["goToSignin"] = true;
                    let itemsToRemove_list = ['signedIn','token','answers','data','pid_list','personal_answers'];
                    for(let itemsToRemove in itemsToRemove_list){
                      sessionStorage.removeItem(itemsToRemove_list[itemsToRemove]);
                    }
                }
                that.setState(objetToUpdate);
            }.bind(this)
        });
        if(userData){
            var a = userData.usr_birthday;
            var localTime = moment((a)).format("MM/DD/YYYY");
            state["dob"] = moment(localTime.toString(), "MM/DD/YYYY");
            userData.usr_birthday = state["dob"];
        }else{
            state["dob"] = "";
        }

        state["personal_answers"] = userData;
        that.state = state;
        that.setDataInState();
    }

    toggleSelect(e){
        
        let that = this;
        let pid = e.target.getAttribute("data-pid");
        let name = e.target.value;
        let list = that.state.selected;
        if( !list[pid] ){
            list[pid] = name;
        }else{
            delete list[pid];
        }

        var pid_list = [];
        for(var key in list){
            // console.log(key,list[key]);
            pid_list.push(key);
        }
        sessionStorage.setItem("pid_list",pid_list);

        that.setState({
            selected : list
        })
        //comment
    }

    alertMessage(){
        let that = this;
        if(that.state.goToSignin){
            browserHistory.push('index.html#/SignIn');
            window.location.reload();
        }
    }
    
    componentWillUnmount(){
        let that = this;
        let userData = JSON.stringify(that.state.personal_answers);
        // sessionStorage.setItem('data',userData);
    }

    componentWillMount(){
        let that = this;
        let ans;
        try {
            const serializedState = {"q-001":"1","q-002":["2"],"q-003":"1","q-004":"1","q-005":"1","q-006":"1","q-006-01":["3"],"q-007":"1","q-007-02":"1"};
            if (serializedState === null) {
              ans = undefined;
            }
            ans = /*JSON.parse*/(serializedState);
          } catch (err) {
            ans = undefined;
          }
        that.setState({
            answers : ans
        },function(){
            //console.log(that.state.answers)
        })
        this.setDataInState();
    }
    
    componentDidMount(){
        let that = this;
        let ans;
        try {
            const serializedState = {"q-001":"1","q-002":["2"],"q-003":"1","q-004":"1","q-005":"1","q-006":"1","q-006-01":["3"],"q-007":"1","q-007-02":"1"};
            if (serializedState === null) {
              ans = undefined;
            }
            ans = /*JSON.parse*/(serializedState);
          } catch (err) {
            ans = undefined;
          }
        that.setState({
            answers : ans
        },function(){
            //console.log(that.state.answers)
        })
        this.setDataInState();
    }

    componentDidUpdate(){
        // $( "#usr_birthday" ).datepicker();
    }
    
    setDataInState() {
        var that = this;      
        var state = this.state;
        var aux = [];

        // console.log(STRINGS.GET_MATCHES);
        var token = sessionStorage.getItem('token')||null;
        $.ajax({
            url: STRINGS.URL+STRINGS.API_PREFIX+STRINGS.GET_MATCHES,
            type: 'GET',
            headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : token
            },
            success: function(data) {
                // console.log(STRINGS.GET_MATCHES,'data',data);
                if(data.success && data.data){
                    state["platforms"] = data.data;
                    
                    that.setState({
                        flow : state.flow,
                        platforms : state.platforms,
                    });
                }
            }.bind(this),
            error: function(xhr, status, err) {
                // console.error(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.GET_MATCHES, status, err, xhr);
                var password_msg = "error";
                if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                    password_msg = xhr.responseJSON.message;
                }
            }.bind(this)
        });
        
        
        state["flow"] = ["q-001","q-002","q-003","q-004","q-005",["q-006","q-006-01"],["q-007","q-007-02"]]
           
        that.setState({
            flow : state.flow,
            platforms : state.platforms,
        },function(){
            if(state["platforms"] && state["platforms"].length){
                for ( let i = 0 ; i < state["platforms"].length ; i++ ){
                    let platform = state["platforms"][i];
                    if ( platform.conditions && that.state.answers && that.score(platform.conditions) ){
                        aux.push(platform);
                    }
                }
                state["platforms"] = aux;
                that.setState({
                    platforms : state["platforms"],
                })
            }
        });
    }
    
    score(cond){
        let score = 0;
        let index = 0;
        let ans = this.state.answers;
        let flow = this.state.flow;
        var arr = cond.tier;
        if(arr && arr.length>0){
            for( var i = 0 ; i < arr.length ; i++ ){
                var level = cond.tier[i];
                var el = flow[level];
                if (Array.isArray(el)){
                    for (let j = 0 ; j < el.length ; j++ ){
                        if ( Array.isArray(ans[el[j]]) || ans[el[j]] == "1" ){
                            score++;
                        }
                    }
                }else{
                    if ( Array.isArray(ans[el]) || ans[el] == "1" ){
                        score++;
                    }
                }
            }
        }
        if ( score >= cond.score ){
            return true;
        }else{
            return false;
        }
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
    
    editDetails() {

        let that = this;
        let editDetails_array = ["usr_first_name","usr_last_name","usr_nick_name","usr_birthday","usr_phone"];
        for(var id_item in DB_MAP_UI){
            var element = document.getElementById(''+id_item);
            if(/*!(id_item.toString()).includes("email") */(editDetails_array.indexOf(id_item) != -1)){
                if(element){
                    if(element.disabled){
                        element.removeAttribute("disabled");
                    }
                }
            }
        }
        this.setState({disableDate: false});
    }

    saveDetails() {
        let that = this;
        var token = sessionStorage.getItem('token')||null;
        var dataToSend = {};
        let flag = 0;
        for(var id_item in DB_MAP_UI){
            var element = document.getElementById(''+id_item);
            if(element && !element.disabled){
                let check = true;
                let data = that.state.personal_answers[''+id_item];
                let check_validation_array = {
                    // "email"     : function(data){return that.validateEmail(data)},
                    "first_name"  : function(data){return that.validateWithALPHANUMERIC(data)},
                    "last_name"  : function(data){return that.validateWithALPHANUMERIC(data)},
                    "birthday"  : function(data){
                        var localTime = moment((data)).format("MM/DD/YYYY");
                        // console.log(moment(localTime.toString(), "MM/DD/YYYY"));
                        var validDate = that.validateDate(moment(localTime.toString(), "MM/DD/YYYY"))
                        that.setState({disableDate: validDate});
                        return validDate;
                    },
                    "phone"     : function(data){return that.validatePhone(data)},
                    "usr_address_1"  : function(data){return that.validateWithoutALPHANUMERIC(data)},
                    "usr_city"  : function(data){return that.validateWithALPHANUMERIC(data)},
                    "usr_address_state"  : function(data){return that.validateState(data)},
                    "usr_zip"  : function(data){return that.validateZipCode(data)},
                    "usr_license_id"  : function(data){return that.validateWithoutALPHANUMERIC(data)},
                    "usr_license_state"  : function(data){return that.validateState(data)},
                    "usr_license_exp"  : function(data){return that.validateExpiration(data)}
                };
                for(var key in check_validation_array){
                    if((id_item.toString()).includes(key)){
                        check = (check_validation_array[key])(data);
                        if(!check){
                            flag = 1;
                            if(that.hasClass(document.getElementById(''+id_item+"_message"),"hide")){
                                that.removeClass(document.getElementById(''+id_item+"_message"),"hide");
                            }
                        }else{
                            if(!that.hasClass(document.getElementById(''+id_item+"_message"),"hide")){
                                that.addClass(document.getElementById(''+id_item+"_message"),"hide");
                            }
                        }
                    }
                }
                if(check){
                    
                    for(var key in DB_MAP_UI){
                        if(!key.includes("password") && !key.includes("email")){
                            dataToSend[DB_MAP_UI[key]["db"]] = that.state.personal_answers[key];
                        }
                    }
                    if(element.disabled){
                        element.disabled = check;
                    }else{
                        element.setAttribute("disabled",check);
                    }
                }else{
                    element.removeAttribute("disabled");
                }
            }
        }
        let userData = JSON.stringify(that.state.personal_answers);
        if(flag == 0){
            // console.log(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.UPDATE_USER_DETAILS,dataToSend);
            $.ajax({
                url: STRINGS.URL+STRINGS.API_PREFIX+STRINGS.UPDATE_USER_DETAILS,
                type: 'PUT',
                cache: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                data: JSON.stringify(dataToSend),
                success: function(data) {
                    if(data.success ){
                        sessionStorage.setItem('data',userData);
                        var password_msg = "Details updated successfully.";
                        $("#confirmModal").modal('show');
                        that.setState({message: password_msg, header: ""});
                    }else{
                    }

                }.bind(this),
                error: function(xhr, status, err) {
                    // console.error(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.UPDATE_USER_DETAILS, status, err, xhr);
                    var password_msg = "Error while Updating details";
                    if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                        password_msg = xhr.responseJSON.message;
                    }
                    $("#confirmModal").modal('show');
                    that.setState({message: password_msg, header: "Sorry"});
                }.bind(this)
            });
            
        }
        
    }

    editAdditionalDetails() {

        let that = this;
        let editDetails_array = ["usr_address_1","usr_address_2","usr_city","usr_address_state","usr_zip","usr_license_id","usr_license_state","usr_license_exp"];
        for(var id_item in DB_MAP_UI){
            var element = document.getElementById(''+id_item);
            if((editDetails_array.indexOf(id_item) != -1)){
                if(element){
                    element.disabled = false;
                }
            }
        }
    }

    editPasswords() {

        let that = this;
        let editDetails_array = ["usr_current_password","usr_new_password","usr_confirm_password"];
        for(var id_item in editDetails_array){
            var element = document.getElementById(''+editDetails_array[id_item]);
            if((editDetails_array.indexOf(editDetails_array[id_item]) != -1)){
                if(element){
                    element.disabled = false;
                }
            }
        }
    }

    savePasswords() {
        let that = this;
        var personal_answers = that.state.personal_answers;
        var token = sessionStorage.getItem('token')||null;
        let editDetails_array = ["usr_current_password","usr_new_password","usr_confirm_password"];
        var usr_current_password = document.getElementById("usr_current_password");
        var usr_new_password = document.getElementById("usr_new_password");
        var usr_confirm_password = document.getElementById("usr_confirm_password");
        var pwd_check = that.validatePassword(usr_new_password.value,usr_confirm_password.value);
        
        if(usr_current_password.value.includes(" ") || usr_new_password.value.includes(" ") || usr_confirm_password.value.includes(" ")){

            var password_msg = "Password Credentials should not have space";
            $("#confirmModal").modal('show');
            that.setState({message: password_msg, header: "Sorry"});
        }
        else if(usr_current_password.value.length>=8){
            if(pwd_check){
                // usr_current_password.disabled = true;
                // usr_new_password.disabled = true;
                // usr_confirm_password.disabled = true;
                var dataToSend = {
                        email : personal_answers.usr_email,
                        oldPassword : usr_current_password.value,
                        newPassword : usr_confirm_password.value
                    };
                $.ajax({
                    url: STRINGS.URL+STRINGS.API_PREFIX+STRINGS.CHANGE_PASSWORD,
                    type: 'PUT',
                    cache: false,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    data: JSON.stringify(dataToSend),
                    success: function(data) {
                        if(data.success ){
                            var password_msg = "Password Successfully changed";
                            $("#confirmModal").modal('show');
                            that.setState({message: password_msg, header: "Congrats"});
                            usr_current_password.value = "";
                            usr_new_password.value = "";
                            usr_confirm_password.value = "";
                            let p_ans = that.state.personal_answers;
                            p_ans.usr_new_password = "";
                            p_ans.usr_confirm_password = "";
                            p_ans.usr_current_password = "";
                            that.setState({personal_answers:p_ans, header: "Congrats"/*, alertLeftMargin: {"margin-left": "40%"}*/});
                            
                        }else{
                        }

                    }.bind(this),
                    error: function(xhr, status, err) {
                        // console.error(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.CHANGE_PASSWORD, status, err, xhr);
                        var password_msg = "Password change error";
                        if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                            password_msg = xhr.responseJSON.message;
                        }
                        $("#confirmModal").modal('show');
                        that.setState({message: password_msg, header: "Sorry"});
                        usr_current_password.value = "";
                        usr_new_password.value = "";
                        usr_confirm_password.value = "";
                        let p_ans = that.state.personal_answers;
                        p_ans.usr_new_password = "";
                        p_ans.usr_confirm_password = "";
                        p_ans.usr_current_password = "";
                        that.setState({personal_answers:p_ans/*, alertLeftMargin: {"margin-left": "37%"}*/});
                    }.bind(this)
                });
            }
        }else{
            var password_msg = "Please enter current password.";
            $("#confirmModal").modal('show');
            that.setState({message: password_msg, header: "Sorry"});
        }
    }


    
    validateWithALPHANUMERIC(name) {
        let re = false;
        if( name && name.length >= 2 && !REGEX.ALPHANUMERIC.test(name)){
            re = true;
        }
        return re;
    }

    validateWithoutALPHANUMERIC(name) {
        let re = false;
        if( name && name.length >= 2 ){
            re = true;
        }
        return re;
    }

    validateState(state) {
        let re = false;
        let state_array = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
        if( state && (state != "-1") && (state_array.indexOf(state) != -1) ){
            re = true;
        }
        return re;
    }
    
    validatePhone(phone) {
        let re = false;
        if(phone.length >= 12 ){
            re = true;
        }
        return re;
    }
    
    validateEmail(email) {
        let re = REGEX.EMAIL;
        return re.test(email);
    }

    validateZipCode(zip) {
        let re = REGEX.ZIP;
        return re.test(zip);
    }

    validatePassword(password,cnf_password) {
        let re = REGEX.PASSWORD;

        let that = this;
        let p_ans = {
            usr_password : password,
            usr_password_confirm : cnf_password
        };
        var password_feedback = document.getElementById('usr_password_message');
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
            }else if(p_ans["usr_password_confirm"].length != p_ans["usr_password"].length){
                flag=1;
                password_msg = "(Passwords are not of same length)";
            }
        }
        var usr_current_password = document.getElementById("usr_current_password");
        if(password_feedback && usr_current_password.value.length>=8){
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

    addDateClass(){
        let dateClassStr = ["react-datepicker__input-container", "react-datepicker__tether-target", "react-datepicker__tether-abutted", "react-datepicker__tether-abutted-left", "react-datepicker__tether-element-attached-bottom", "react-datepicker__tether-element-attached-left", "react-datepicker__tether-target-attached-top", "react-datepicker__tether-target-attached-left"];
        var birthday_element = document.getElementsByClassName('react-datepicker__input-container');
        // if(this.hasClass(birthday_element,"react-datepicker-ignore-onclickoutside")){
        //     this.removeClass(birthday_element,"react-datepicker-ignore-onclickoutside");
        // }
        for(var element in birthday_element){
            // console.log("addClass this.hasClass(birthday_element,element)",element,!this.hasClass(birthday_element,element))
            if(!this.hasClass(birthday_element,element)){
                this.addClass(birthday_element,element);
            }
        }
    }

    removeDateClass(){
        let dateClassStr = ["react-datepicker__input-container", "react-datepicker__tether-target", "react-datepicker__tether-abutted", "react-datepicker__tether-abutted-left", "react-datepicker__tether-element-attached-bottom", "react-datepicker__tether-element-attached-left", "react-datepicker__tether-target-attached-top", "react-datepicker__tether-target-attached-left"];
        var birthday_element = document.getElementById('usr_birthday');
        for(var element in birthday_element){
            // console.log("removeClass this.hasClass(birthday_element,element)",element,this.hasClass(birthday_element,element))
            if(this.hasClass(birthday_element,element)){
                this.removeClass(birthday_element,element);
            }
        }
    }

    generateDatePicker(){
        let that = this;
        let p_ans = that.state.personal_answers;
        if(that.state.disableDate){
            return(
                <DatePicker
                                        disabled
                                        placeholder="Birthday" className="form-control profile-date-width" 
                                        id="usr_birthday"
                                        value={p_ans.usr_birthday}
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        dateFormat="MM/DD/YYYY"
                                        placeholderText="Date of Birth"
                                        onChange={(date) => {
                                            that.dobChange.bind(that,date)
                                        }}
                                        selected={(that.state.dob != '') ? that.state.dob : null}
                                    />
            );
        }else{
            return(
            <DatePicker
                                        
                                        placeholder="Birthday" className="form-control profile-date-width" 
                                        id="usr_birthday"
                                        value={p_ans.usr_birthday}
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        dateFormat="MM/DD/YYYY"
                                        placeholderText="Date of Birth"
                                        onChange={(date) => {
                                            that.dobChange(date)
                                        }}
                                        selected={(that.state.dob != '') ? that.state.dob : null}
                                    />
            );
        }
    }
    
    handlePhoneChange(val) {
        var state = this.state;
        state.personal_answers.usr_phone = val;
        this.setState(state);
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

        let platforms = that.state.platforms;
        let matchedPlatforms = platforms.length;
        let selected = that.state.selected;
        let selectedItems = Object.keys(selected).length;
        return (
            <DocumentTitle title={STRINGS.PROJECT_NAME+" - Profile"}>
            <div>
                <section className="container-fluid">
                       <style>{`body{background-color:#ededed;}`}</style>
                    <div className="">
                    
<div class="row">
 
  <ul class="nav nav-tabs nav-tab-width">
  
    <li class="active  boderleft"><a data-toggle="tab" href="#home"><div class="col-lg-12"><div class="col-lg-6"><img src ="public/img/landing/personal_info.png" class="profile-pic"/></div><div class="col-lg-6"><div className="profile-content">Profile</div></div></div></a></li>
    <li><a data-toggle="tab" href="#menu1"><div class="col-lg-12"><div class="col-lg-6"><img src ="public/img/landing/questionnaire.png" class="profile-pic"/></div><div class="col-lg-6"><div className="profile-content">Questionnaire</div></div></div></a></li>
    <li><a data-toggle="tab" href="#menu2"><div class="col-lg-12"><div class="col-lg-6"><img src ="public/img/landing/matches.png" class="profile-pic"/></div><div class="col-lg-6"><div className="profile-content">Matches </div></div></div></a></li>
   
  </ul>

  <div class="tab-content">
    <div id="home" class="tab-pane fade in active">
     <section name="home">
     <div className="col-lg-12 text-center">
     <div className="col-lg-2"></div>
      <div className="col-lg-8">
    
                    <h3 className="platfrom-margin30">
                        Personal Information 
                    </h3>
                    <div class="box-shadow row  box-shadow-bottom">
                        <div class="sign-font font-content text-left">
                           
                 
                            <div className="row">
                                <div className="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
                                 <label for="first_name">First Name:</label>
                                    <input placeholder="First Name" type="text" id="usr_first_name" className="form-control" onChange={that.handleChange.bind(this)} value={p_ans.usr_first_name} disabled></input>
                                    <span id="usr_first_name_message" class="help-inline control-label hide">Enter a valid First Name !</span>
                                </div>
                                <div className="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                      <label for="last_name">Last Name:</label>
                                    <input placeholder="Last Name" type="text" id="usr_last_name" className="form-control" onChange={that.handleChange.bind(this)} value={p_ans.usr_last_name} disabled></input>
                                    <span id="usr_last_name_message" class="help-inline control-label hide">Enter a valid Last Name !</span>
                                </div>
                            </div>
                      
                            <div className="row">
                                <div className="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                        <label for="Nick_name">Nick Name:</label>
                                    <input placeholder="Nick Name" type="text" id="usr_nick_name" className="form-control" onChange={that.handleChange.bind(this)} value={p_ans.usr_nick_name} disabled></input>
                                </div>
                                <div className="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                 <label for="Email">Email:</label>
                                    <input placeholder="Email Name" type="text" id="usr_email" className="form-control" onChange={that.handleChange.bind(this)} value={p_ans.usr_email} disabled></input>
                                    <span id="usr_email_message" class="help-inline control-label hide">Enter a valid email !</span>
                                </div>
                            </div>
                          
                            <div className="row">
                                <div className="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                  <label for="Birthday">Birthday:</label><br/>
                                    {that.generateDatePicker()}
                                    <span id="usr_birthday_message" class="help-inline control-label hide">Enter a valid birthday !</span>
                                </div>
                                <div className="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                  <label for="Phone">Phone:</label>
                                    <Phone placeholder="Phone" format={phoneNumberFormat.US} id="usr_phone" className="usr_phone_feedback form-control" onChange={(val) => that.handlePhoneChange(val)} value={p_ans.usr_phone} disabled />
                                    <span id="usr_phone_message" class="help-inline control-label hide">Enter a valid phone number !</span>
                                </div>
                            </div>

                             <div className="row">
                                <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    
                                    <button type="button" className={"btn send-button pull-right col-xs-pull-0"} onClick={this.editDetails.bind(this)}>Edit</button>
                                </div>
                                <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    <button type="button" className={"btn send-button "} onClick={this.saveDetails.bind(this)}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                       {/*<div class="sign-font font-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </div>

                     

                         <div class="sign-font font-content">unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae </div>
                        */}
      
      </div>
      <div className="col-lg-2"></div>

     
     </div>


     <div className="col-lg-12 text-center add-top-margin">
       <div className="col-lg-2"></div>
        <div className="col-lg-8">

            <h3 className="platfrom-margin30">
                        Additional Information 
                    </h3>
                    <div class="box-shadow row  box-shadow-bottom">
                        <div class="sign-font font-content text-left">
                           
                            <div className="row">
                            
                                <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12">
                                  <label for="Address 1"> Address 1: </label>
                                    <input placeholder="Address 1" type="text" id="usr_address_1" className="form-control" onChange={that.handleChange.bind(this)} value={p_ans.usr_address_1} disabled></input>
                                    <span id="usr_address_1_message" class="help-inline control-label hide">Enter a valid Address !</span>
                                </div>
                                <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12">
                                  <label for="Address 2"> Address 2: </label>
                                    <input placeholder="Address 2" type="text" id="usr_address_2" className="form-control" onChange={that.handleChange.bind(this)} value={p_ans.usr_address_2} disabled></input>
                                </div>
                            </div>
                           
                            <div className="row">
                                <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12">
                                 <label for="City"> City: </label>
                                    <input placeholder="City" type="text" id="usr_city" className="form-control" onChange={that.handleChange.bind(this)} value={p_ans.usr_city} disabled></input>
                                    <span id="usr_city_message" class="help-inline control-label hide">Enter a valid City !</span>
                                </div>
                                <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12">
                                 <label for=" State"> State: </label>
                                    {/*<input placeholder="State" type="text" id="usr_address_state" className="form-control" onChange={that.handleChange.bind(this)} value={p_ans.usr_address_state} disabled></input>*/}
                                    <select placeholder="State" className="form-control" id="usr_address_state" onChange={that.handleChange.bind(this)} value={p_ans.usr_address_state} disabled>
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
                                    <span id="usr_address_state_message" class="help-inline control-label hide">Enter a valid state !</span>
                                </div>
                            </div>
                          
                            <div className="row">
                                <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12">
                                 <label for="ZIP"> ZIP: </label>
                                    <input placeholder="ZIP" type="text" id="usr_zip" className="form-control" onChange={that.handleChange.bind(this)} value={p_ans.usr_zip} disabled></input>
                                    <span id="usr_zip_message" class="help-inline control-label hide">Enter a valid zip !</span>
                                </div>
                                <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12">
                                 <label for="License"> License: </label>
                                    <input placeholder="License" id="usr_license_id" className="form-control" onChange={that.handleChange.bind(this)} value={p_ans.usr_license_id} disabled />
                                    <span id="usr_license_id_message" class="help-inline control-label hide">Enter a valid License id !</span>
                                </div>
                            </div>
                           
                            <div className="row">
                                <div className="form-group col-sm-6">
                                  <label for="License State">     License State:  </label>
                                    {/*<input placeholder="License State" type="text" id="usr_license_state" className="form-control" onChange={that.handleChange.bind(this)} value={p_ans.usr_license_state} disabled></input>*/}
                                    <select placeholder="License State" className="form-control" id="usr_license_state" onChange={that.handleChange.bind(this)} value={p_ans.usr_license_state} disabled>
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
                                    <span id="usr_license_state_message" class="help-inline control-label hide">Enter a valid state for License !</span>
                                </div>
                                <div className="form-group col-sm-6">
                                  <label for="License Expiry">  License Expiry: </label>
                                    <input placeholder="Expiration MM/YY" id="usr_license_exp" className="form-control" onChange={this.handleChange.bind(this)} value={p_ans.usr_license_exp} disabled />
                                    <span id="usr_license_exp_message" class="help-inline control-label hide">Enter a valid License !</span>
                                </div>
                            </div>

                             <div className="row">
                                <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6 ">
                                    
                                    <button type="button" className={"btn send-button pull-right col-xs-pull-0"} onClick={this.editAdditionalDetails.bind(this)}>Edit</button>
                                </div>
                               <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6 ">
                                    <button type="button" className={"btn send-button "} onClick={this.saveDetails.bind(this)}>Save</button>
                                </div>
                            </div>
                        </div>
      
                    </div>
            
        </div>
         <div className="col-lg-2"></div>
     </div>



     <div className="col-lg-12 text-center add-top-margin">
       <div className="col-lg-2"></div>
        <div className="col-lg-8">

            <h3 className="platfrom-margin30">
                        Change Password
                    </h3>
                    <div class="box-shadow row  box-shadow-bottom">
                        <div class="sign-font font-content text-left">
                           
                            <div className="row">
                                <div className="form-group col-sm-12">
                                   <label for="Current Password">  Current Password: </label>
                                    <input placeholder="Current Password" type="password" id="usr_current_password" className="form-control" onChange={that.handleChange.bind(this)} value={p_ans.usr_current_password} ></input>
                                </div>
                               <div className="form-group col-sm-12">
                                <label for="New Password ">      New Password:  </label>
                                    <input placeholder="New Password" type="password" id="usr_new_password" className="form-control" onChange={that.handleChange.bind(this)} value={p_ans.usr_new_password} ></input>
                                </div>
                                <div className="form-group col-sm-12">
                                <label for=" Confirm Password">     Confirm Password:   </label>
                                    <input placeholder="Confirm Password" type="password" id="usr_confirm_password" className="form-control" onChange={that.handleChange.bind(this)} value={p_ans.usr_confirm_password} ></input>
                                </div>
                                <span id="usr_password_message" style={that.state.alertLeftMargin} class="help-inline control-label "></span>
                            </div>
                            
                            
                            

                            <div className="row">
                                 <div className="form-group col-lg-5 col-md-5 col-sm-5 col-xs-5 ">
                                    
                                    {/*<button type="button" className={"btn send-button pull-right col-xs-pull-0"} onClick={this.editPasswords.bind(this)}>Edit</button>*/}
                                </div>
                                <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6 ">
                                    <button type="button" className={"btn send-button "} onClick={this.savePasswords.bind(this)}>Save</button>
                                </div>
                            </div>
                        </div>
      
                    </div>
            
        </div>
         <div className="col-lg-2"></div>
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

    </div>
    <div id="menu1" class="tab-pane fade">
        <section name="Questionnaire">
            <div className="col-lg-12 text-center">
                <div className="col-lg-1"></div>
                <div className="col-lg-10  box-shadow-bottom">
      
                    <h3 className="platfrom-margin30">
                        Questionnaire Information </h3>


                    {/*<div class="col-lg-12">
                                                        </div> */}                
                    <ProfileQuestionnaire />

                </div>
                <div className="col-lg-1"></div>
            </div>
        </section>
    </div>
    <div id="menu2" class="tab-pane fade">
      <section name="Questionnaire">
     <div className="col-lg-12 text-left">
      <div className="col-lg-12 box-shadow-bottom">
      
     <h3 className="platfrom-margin30 text-center">
                       Matches  </h3>
                       <section id="main" className="matches_container  container">
                        <div className="container">
                            {   platforms.map(function(platform,index){

                                      let id = platform.id;
                                      return (
                                            <div id={"platform_"+id} class="container-fluid margin-bottom-30 match_element" key={index}>

                                                 <div class="box-shadow row">  
                                                    <div className="row"> 
                                                         <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                                                           <div className="img-thumbnail">
                                                               <a target="_blank" href={platform.url}><img className="platform_logo" src={"public/img/platforms/"+platform.logo}></img></a>
                                                           </div>
                                                           <button type="button" 
                                                               class={"btn gig_button background backgroundHover "+(that.state.selected[id] || platform.isInterested?" color_1":" color_2")} 
                                                               data-pid={id} 
                                                               value={platform.name}
                                                               disabled
                                                               onClick={that.toggleSelect}>{(platform.isInterested)?"Submitted":"Not Submitted"}</button>
                                                         </div>
                                                         <div class="col-lg-10 col-md-9 col-sm-8 col-xs-12 match_summary">
                                                             <h5>
                                                                 <span>{platform.name}</span> <a 
                                                                 class="learnMore textHover color_1" 
                                                                 target="_blank" 
                                                                 href={platform.url}
                                                                 > Learn more</a>
                                                             </h5>
                                                             <p>
                                                                 <strong>About Company</strong>
                                                                 <br></br>
                                                                 {platform.about}
                                                             </p>
                                                             <p>
                                                                 <strong>Role</strong>
                                                                 <br></br>
                                                                 {platform.role}
                                                             </p> 
                                                         </div>   
                                                    </div>
                                                </div>

                                            </div>
                                          )
                                      }

                                              
                                    )
                            }
                        </div>
                        </section>
                        
      </div>
     

     
     </div>
     </section>
     
    </div>
    <div id="menu3" class="tab-pane fade">
      
    </div>
  </div>
</div>

                    </div>
                
               
                </section>
                <Footer/>
            </div>
            </DocumentTitle>
        )
    }
    
}

export default Profile;

