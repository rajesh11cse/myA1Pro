import React from 'react';
import {STRINGS} from '../../_utility/constants';
import Nav from '../../nav/nav';
import Footer from '../../footer/footer';
import DocumentTitle from "react-document-title";
import {Link} from 'react-router';

class ForPlatforms extends React.Component {
    
    componentDidMount(){
        {/*JS Here*/}
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
    
    render() {
        return (
             <DocumentTitle title={STRINGS.PROJECT_NAME+" - ForPlatfrom"}>
              <section name="platfromcontainer" className="container container-platfroms">
              <div className="row platfrom-content">
           
              <div className="col-lg-1 col-md-1 "></div>
              <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
              
             <h2 className="platfrom-margin30">
                        Overview<br/><br/>
                        <div class="sign-font font-content">Quickly answer a series of simple questions and we'll give you personalized jobs that you can apply easily.</div>
                    
                       <div class="sign-font font-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </div>

                     

                         <div class="sign-font font-content">unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae </div>
                        </h2>
              </div>
              <div className="col-lg-1  col-md-1"></div>


              </div>
              
               <div className="row container-contact">
                <div className="col-lg-3 col-md-3 col-sm-0 col-xs-0"></div>
            
                
               <div className="col-lg-6 col-md-6 col-sm-0 col-xs-0 text-center">
               <form  className="queryform">
               <div class="col-lg-12  col-sm-12 col-xs-12 col-md-12">
                <div className="col-lg-6 col-md-6  col-sm-12 col-xs-12  forplat-name "> <input type="text" className="input" id="name" placeholder="Your Name" name="name"/></div>  <div className="col-lg-6  col-md-6  col-sm-12 col-xs-12 forplat-name-right"><input type="text" id="phone" className="input"  placeholder="Phone Number" name="phone"/></div>
               </div>
                   <div class="col-lg-12 col-md-12  col-sm-12 col-xs-12">
                   <input type="text" id="email" className="input"  placeholder="Email Address" name="email"/>
                        
                    <textarea  className="input textarea-heght" id="message" placeholder="Leave a Message" name="message"></textarea>
                    <br/><br/>
                    <button type="button" class="btn send-button pull-center"> Send  </button>
                   </div>
                     
                     
                         
                </form>

               
               </div>
                <div className="col-lg-3"></div>
               
               
               </div>
              </section>
            

            </DocumentTitle>
        )
    }
    
}

export default ForPlatforms;