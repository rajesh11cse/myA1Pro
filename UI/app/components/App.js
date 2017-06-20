import React from 'react';
import Nav from './nav/nav';
import Footer from './footer/footer';
import DocumentTitle from "react-document-title";
import {STRINGS,REGEX,DB_MAP_UI} from './_utility/constants';
import moment from 'moment';

class App extends React.Component {

    constructor(props) {
        super(props);
        let that = this;
        var userData = sessionStorage.getItem('data')||JSON.stringify({});
        var loginData = sessionStorage.getItem('signedIn')||null;
        if(userData){
            userData = JSON.parse(userData);
        }
        var token = sessionStorage.getItem('token')||null;
            /* this ajax is done to get the user name in case one is logged in*/
        if(loginData){
            loginData = JSON.parse(loginData);
        
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
                        var a = userData.usr_birthday;
                        var localTime = moment((a)).format("MM/DD/YYYY");
                        userData["dob"] = moment(localTime.toString(), "MM/DD/YYYY");
                        sessionStorage.setItem('data',JSON.stringify(userData));
                        that.setState({});
                    }

                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.USER_DETAILS, status, err.toString());
                }.bind(this)
            });
        }
    }

    generateNavBar(){
        let that = this;
        var userData = sessionStorage.getItem('data')||JSON.stringify({});
        var loginData = sessionStorage.getItem('signedIn')||null;
        if(userData){
            userData = JSON.parse(userData);
        }
        var token = sessionStorage.getItem('token')||null;
        if(loginData){
            loginData = JSON.parse(loginData);
            
        }

        return(
            <Nav userData={userData} loginData={loginData} />
        );
    }

    render() {
        let that = this;
        $("#navbar").removeClass("in").attr("aria-expanded","false");
        return (
            <DocumentTitle title={STRINGS.PROJECT_NAME}>
            <div>
                {that.generateNavBar()}
                <div id="mainWrapper">
                    {this.props.children}
                </div>            
                <Footer/>
            </div>
            </DocumentTitle>
        )
    }
    
}

export default App;