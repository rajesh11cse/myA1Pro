import React from 'react';
import {Link} from 'react-router';

class Footer extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (            
            <footer className="footer">
              <div className="container-fluid">
                <div className="text-muted row">
                    <div className="footer_section footer_left_section col-md-4">© 2017 Kalgan LLC. All rights reserved.</div>
                    <div className="footer_section footer_center_section col-md-4">
                        <Link className="footer_link textHover color_1" to="/AboutUs">About Us</Link>
                        <span className="footer_separator">|</span>
                        <Link className="footer_link textHover color_1" to="/ContactUs">Contact Us</Link>
                    </div>
                    <div className="footer_section footer_right_section col-md-4"> 
                        <Link className="footer_social textHover color_1" to="/Facebook"><i className="fa fa-facebook" aria-hidden="true"></i></Link>
                        <Link className="footer_social textHover color_1" to="/Twitter"><i className="fa fa-twitter" aria-hidden="true"></i></Link>
                        <Link className="footer_social textHover color_1" to="/Google"><i className="fa fa-google-plus" aria-hidden="true"></i></Link>
                    </div>
                </div>
              </div>
            </footer>
        )
    }
    
}


export default Footer;
