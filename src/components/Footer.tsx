import React from 'react';
import './Footer.css'


function Footer() {
    return (
        <div id="Footer" className="container text-center">
            <div className="row">
                <div className="col">
                    <div>Support Version</div>
                    <div>Privacy Policy</div>
                </div>
                <div className="col">
                    <ul className="list-inline">
                        <li className="list-inline-item">
                            <a href="#" className="circular-button">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href="#" className="circular-button">
                                <i className="fa-brands fa-facebook"></i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href="#" className="circular-button">
                                <i className="fa-brands fa-twitter"></i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href="#" className="circular-button">
                                <i className="fa-brands fa-youtube"></i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href="#" className="circular-button">
                                <i className="fa-brands fa-tiktok"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="col">
                FAQ 
                </div>
            </div>
        </div>
      );
}

export default Footer;