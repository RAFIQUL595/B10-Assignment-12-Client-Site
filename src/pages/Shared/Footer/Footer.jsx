import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer footer-center bg-base-200 text-base-content rounded p-10">
            <nav className="grid grid-flow-col gap-4">
                <a href="#" className="link link-hover">About us</a>
                <a href="#" className="link link-hover">Contact</a>
                <a href="#" className="link link-hover">Student</a>
                <a href="#" className="link link-hover">Tutor</a>
            </nav>
            <nav>
                <div className="grid grid-flow-col gap-4">
                    {/* Linkedin */}
                    <Link target="_blank" to='https://www.linkedin.com/in/rafiqul-islam-16367b196/'>
                        <FaLinkedin className='size-7' />
                    </Link>
                    {/* Instagram */}
                    <Link target="_blank" to='https://www.instagram.com/rafiqul._.islam/'>
                        <FaInstagram className='size-7' />
                    </Link>
                    {/* Facebook */}
                    <Link target="_blank" to='https://www.facebook.com/rafiqul.islam.126222'>
                        <FaFacebook className='size-7' />
                    </Link>
                </div>
            </nav>
            <aside>
                <p>Copyright © {new Date().getFullYear()} - All right reserved by <span className='font-bold'>Study Platform Ltd</span></p>
            </aside>
        </footer>
    );
};

export default Footer;
