import React from 'react';
import {STRINGS} from '../_utility/constants';
import Nav from '../nav/nav';
import Footer from '../footer/footer';
import DocumentTitle from "react-document-title";
import {Link} from 'react-router';

import {matchHeight} from '../_utility/utility';

class Landing extends React.Component {
    
    componentDidMount(){
        matchHeight();
        $(document).ready(function() {  
            $.event.special.swipe.scrollSupressionThreshold = 1;
            $(".carousel").swiperight(function() {  
              $(this).carousel('prev');  
            });  
           $(".carousel").swipeleft(function() {  
              $(this).carousel('next');  
           });  
           $(".carousel").carousel();
        }); 
        sessionStorage.setItem('answers', {});
        sessionStorage.setItem('personal_answers', {});
    }
    
    render() {
        return (
            <div className="">
                <section className="gig_section no_padding section1">
                    <div className="container-fluid">  
                    <div className="row">  
                    <div id="landingCarousel" className="carousel slide" data-ride="carousel" data-interval="6000" data-pause="false">  
                      <ol className="carousel-indicators">
                        <li data-target="#landingCarousel" data-slide-to="0" className="active"></li>
                        <li data-target="#landingCarousel" data-slide-to="1" className=""></li>
                        <li data-target="#landingCarousel" data-slide-to="2" className=""></li>
                        <li data-target="#landingCarousel" data-slide-to="3" className=""></li>
                      </ol>
                      <div className="carousel-inner" role="listbox">
                        <div className="carousel-caption floating-caption">
                        <div className="container">
                              <h1>GigUp!</h1>
                              <h2>So many options, so little time</h2>
                              <p>Open your eyes to a world of work that works for you</p>
                              <Link className="gig_button background backgroundHover color_1" to="/Questionnaire">GET STARTED</Link>
                        </div>
                        </div>
                       
                        <div className="item active slide_1">
                          {/*<img className="first-slide slide-image" src="public/img/landing/Man Delivering Food.jpg" alt="First slide"></img>*/}
                          <div className="container-fluid">
                            <div className="carousel-caption">
                            </div>
                          </div>
                        </div> 
                         
                        <div className="item slide_2">
                          {/*<img className="third-slide slide-image" src="public/img/landing/Man Driving Car.jpg" alt="First slide"></img>*/}
                          <div className="container-fluid">
                            <div className="carousel-caption">
                            </div>
                          </div>
                        </div>  
                        
                        <div className="item slide_3">
                          {/*<img className="fourth-slide slide-image" src="public/img/landing/Man with Hammer.jpg" alt="First slide"></img>*/}
                          <div className="container-fluid">
                            <div className="carousel-caption">
                            </div>
                          </div>
                        </div>  
                        
                        <div className="item slide_4">
                          {/*<img className="second-slide slide-image" src="public/img/landing/Man Walking Dog.jpg" alt="First slide"></img>*/}
                          <div className="container-fluid">
                            <div className="carousel-caption">
                            </div>
                          </div>
                        </div>                        
                        
                      </div>
                </div>
                </div>
                </div>
            </section>
            <section className="gig_section section2">
                <section className="container">
                    <h2>What is a Gig?</h2>
                    <p>GIG: /gig/ <i>noun</i> A flexible job that allows you to set your own schedule for on-demand tasks</p>
                </section>
            </section>
            <section className="gig_section section3">
                <section className="container">
                    <h2>How it works</h2>
                </section>
            </section>
            <section className="gig_section no_padding section4 matchHeightContainer">
               <div className="col_container">
               <div className="row">
                  <div className="col-xs-12 col-md-4 landing_col matchHeight">
                      <img className="col_image" src="public/img/landing/feature_1.png"></img>
                      <h5>Complete<br></br>Our Questionnaire</h5>
                      <p className="col_linebreak"></p>
                      <p>Tell us about your skills and qualifications by answering one easy set of questions.</p>
                  </div>
                  <div className="col-xs-12 col-md-4 landing_col matchHeight">
                      <img className="col_image" src="public/img/landing/feature_2.png"></img>
                      <h5>Match<br></br>to Multiple Gigs</h5>
                      <p className="col_linebreak"></p>
                      <p>Discover all of the companies for which you’re qualified to do work and let us know which excite you.</p>
                  </div>
                  <div className="col-xs-12 col-md-4 landing_col matchHeight">
                      <img className="col_image" src="public/img/landing/feature_3.png"></img>
                      <h5 className="gig_up">Gig Up!</h5>
                      <p className="col_linebreak"></p>
                      <p>We’ll securely transfer the information you’ve provided to the companies you choose so that you can continue the hiring process directly with them.</p>
                  </div>                   
               </div>                
               </div>                
            </section>
            <section className="gig_section section5">
                <section className="container">
                <section className="row">
                    <h2>Hear from Our Users</h2>
                    <div id="userCarousel" className="carousel slide" data-ride="carousel" data-interval="6000">  
                          <ol className="carousel-indicators">
                            <li data-target="#userCarousel" data-slide-to="0" className="active"></li>
                            <li data-target="#userCarousel" data-slide-to="1" className=""></li>
                            <li data-target="#userCarousel" data-slide-to="2" className=""></li>
                          </ol>
                          <div className="carousel-inner" role="listbox">

                            <div className="item active">
                              <div className="row">
                                <div className="carousel-caption">
                                <div className="container-fluid">                            
                                     <div className="carousel-profile col-lg-4 col-md-3">
                                        <div className="col_image_container">
                                            <img className="prof_image" src="public/img/landing/testimonial_image.png"></img>
                                        </div>
                                     </div>
                                     <div className="carousel-text col-lg-8 col-md-9">
                                          <p>“I can’t believe how easy it was to find out about all of the gigs I could be doing in my free time! All I had to do was fill out this one questionnaire and I was quickly connected to 3 different companies.”</p>
                                          <p><strong>Sam R.</strong><br></br>User, Brighton, MA</p>
                                     </div>
                                </div>
                                </div>
                              </div>
                            </div>

                            <div className="item">
                              <div className="row">
                                <div className="carousel-caption">
                                <div className="container-fluid">                            
                                     <div className="carousel-profile col-lg-4 col-md-3">
                                        <div className="col_image_container">
                                            <img className="prof_image" src="public/img/landing/shelley.png"></img>
                                        </div>
                                     </div>
                                     <div className="carousel-text col-lg-8 col-md-9">
                                          <p>“This didn’t feel like a job application.  It was actually kind of fun!”</p>
                                          <p><strong>Sally J.</strong><br></br>User, Boston, MA</p>
                                     </div>
                                </div>
                                </div>
                              </div>
                            </div>

                            <div className="item">
                              <div className="row">
                                <div className="carousel-caption">
                                <div className="container-fluid">                            
                                     <div className="carousel-profile col-lg-4 col-md-3">
                                        <div className="col_image_container">
                                            <img className="prof_image" src="public/img/landing/john.png"></img>
                                        </div>
                                     </div>
                                     <div className="carousel-text col-lg-8 col-md-9">
                                          <p>“We love GigUp! It helps us find great people we already know meet our basic qualifications.  It makes the rest of the screening process so easy for us when we get these pre-qualified candidates.”</p>
                                          <p><strong>John D.</strong><br></br>Hiring Manager, Boston, MA</p>
                                     </div>
                                </div>
                                </div>
                              </div>
                            </div>

                          </div>
                          <a class="left carousel-control" href="#userCarousel" role="button" data-slide="prev">
                            <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                          </a>
                          <a class="right carousel-control" href="#userCarousel" role="button" data-slide="next">
                            <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                          </a>
                    </div>
                </section>
                </section>
            </section>
            
            <section className="gig_section section6">
                <Link id="get_started_button" className="gig_button background backgroundHover color_1" to="/Questionnaire">GET STARTED</Link>
            </section>
            
        </div>
        )
    }
    
}

export default Landing;