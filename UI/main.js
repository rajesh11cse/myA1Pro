import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';


import Landing from "./app/components/views/landing";
import ForPlatforms from "./app/components/views/platforms/ForPlatforms";
import Match from "./app/components/views/platforms/Match";
import PersonalInformation from "./app/components/views/questionnaire/PersonalInformation";
import Questionnaire from "./app/components/views/questionnaire/Questionnaire";
import AboutUs from "./app/components/views/aboutUs";
import ContactUs from "./app/components/views/contactUs";
import SignIn from "./app/components/views/signIn";
import SignUp from "./app/components/views/signUp";
import Profile from "./app/components/views/profile";
import ForgotPassword from "./app/components/views/forgotPassword";
import ConfirmPassword from "./app/components/views/confirmPassword";
import UnderConstruction from "./app/components/etc/underConstruction";
import NotFound from './app/components/etc/404';
import App from './app/components/App';

const root = document.getElementById('root');

render(
        <Router history={hashHistory} onUpdate={() => window.scrollTo(0, 0)} >
           
            <Route component={App} onUpdate={() => window.scrollTo(0, 0)}>
                <Route path="/" component={Landing}/> 
                <Route path="/home" component={Landing}/> 
                <Route path="/SignUp" component={SignUp}/>
                <Route path="/SignIn" component={SignIn}/>
                <Route path="/AboutUs" component={AboutUs}/>
                <Route path="/ContactUs" component={ContactUs}/>
                <Route path="/Questionnaire" component={Questionnaire}/>             
                <Route path="/ForPlatforms" component={ForPlatforms}/>
                <Route path="/Match" component={Match}/>
                <Route path="/PersonalInformation" component={PersonalInformation}/>
                <Route path="/CreateAccount" component={SignUp}/>
                <Route path="/Profile" component={Profile}/>
                 <Route path="/ForgotPassword" component={ForgotPassword}/>
                    <Route path="auth/resetPassword" component={ConfirmPassword}/>
            </Route>
            
            <Route path="/UnderConstruction" component={UnderConstruction} onUpdate={() => window.scrollTo(0, 0)}/>
            <Route path="/*" component={NotFound} onUpdate={() => window.scrollTo(0, 0)}/>
            <Route path="*" component={NotFound} onUpdate={() => window.scrollTo(0, 0)}/>
            
        </Router>, root
);
