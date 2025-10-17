import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <style>
        {`
          /* Basic Reset & Body Styles */
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* Container for the entire page */
          .not-found-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #a8c0ff, #3f2b96); /* Soft gradient background */
            color: #fff;
            padding: 20px;
            box-sizing: border-box;
            text-align: center;
          }

          /* Content box styling */
          .not-found-content {
            background-color: rgba(255, 255, 255, 0.95); /* Slightly transparent white background */
            border-radius: 15px;
            padding: 40px 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* Soft shadow */
            max-width: 500px;
            width: 100%;
            animation: fadeInScale 0.6s ease-out forwards; /* Fade-in and slight scale animation */
          }

          /* Error code (404) styling */
          .not-found-code {
            font-size: 100px;
            font-weight: 800;
            color: #3f2b96; /* Dark purple color */
            margin-bottom: 10px;
            animation: bounce 2s infinite ease-in-out; /* Gentle bounce animation */
            text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
          }

          /* Heading for the message */
          .not-found-heading {
            font-size: 32px;
            font-weight: 700;
            color: #333;
            margin-bottom: 15px;
          }

          /* Description text */
          .not-found-message {
            font-size: 18px;
            color: #555;
            line-height: 1.6;
            margin-bottom: 30px;
          }

          /* Home button styling */
          .not-found-home-button {
            display: inline-flex; /* For icon and text alignment if an icon were used */
            align-items: center;
            background-color: #3f2b96; /* Dark purple button */
            color: #fff;
            padding: 12px 25px;
            border-radius: 50px; /* Pill-shaped button */
            text-decoration: none;
            font-size: 18px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(63, 43, 150, 0.3);
            border: none;
            cursor: pointer;
          }

          .not-found-home-button:hover {
            background-color: #5b47a9; /* Lighter purple on hover */
            transform: translateY(-3px); /* Slight lift on hover */
            box-shadow: 0 8px 20px rgba(63, 43, 150, 0.4);
          }

          .not-found-home-button:active {
            transform: translateY(0);
            box-shadow: 0 3px 10px rgba(63, 43, 150, 0.2);
          }

          /* Animations */
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          /* Responsive Adjustments */
          @media (max-width: 600px) {
            .not-found-content {
              padding: 30px 20px;
            }
            .not-found-code {
              font-size: 80px;
            }
            .not-found-heading {
              font-size: 26px;
            }
            .not-found-message {
              font-size: 16px;
            }
            .not-found-home-button {
              font-size: 16px;
              padding: 10px 20px;
            }
          }
        `}
      </style>
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h1 className="not-found-heading">Page Not Found</h1>
        <p className="not-found-message">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link to="/" className="not-found-home-button">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;