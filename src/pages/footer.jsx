import React from 'react';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaT } from 'react-icons/fa6';

const Footer = () => {
    return (
        <>
            <div style={{ backgroundColor: '#e0e6f0', padding: '20px', textAlign: 'center' }}>
                <div style={{ marginBottom: '10px' }}>
                    <a href="https://x.com/SharmaSumi63012" target='_blank' rel="noopener noreferrer" style={{ margin: '0 10px', color: '#1DA1F2', fontSize: '24px' }}>
                        <FaTwitter />
                    </a>
                    <a href="https://github.com/alphasumit568" target='_blank' rel="noopener noreferrer" style={{ margin: '0 10px', color: '#333', fontSize: '24px' }}>
                        <FaGithub />
                    </a>
                    <a href="https://www.linkedin.com/in/sumit-sharma-459326332/" target='_blank' rel="noopener noreferrer" style={{ margin: '0 10px', color: '#0077B5', fontSize: '24px' }}>
                        <FaLinkedin />
                    </a>
                </div>
                <div>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                        &copy; 2025 <a href="https://my-portfolio-five-rosy-47.vercel.app/" target='_blank' rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'none' }}>Sumit Sharma</a>. All rights reserved.
                    </p>
                </div>
            </div>
        </>
    );
};

export default Footer;