import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import axios from 'axios';
import { API_URL } from 'src/config';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const DefaultLayout = ({ auth, pageData, ipAddress }) => {

  const UserStatus = auth.UserStatus.toLowerCase()

  const LogoutTime = auth.AutoLogoutTime

  const navigate = useNavigate();

  let count = 0;

  const handleAutologout = async () => {
    let countdown = 10; // Countdown starting from 10 seconds
    let countdownInterval;

    const showCountdown = () => {
      swal({
        title: 'Are You Still There?',
        text: `You will be logged out in ${countdown} seconds.`,
        icon: 'warning',
        buttons: [true, 'Yes'],
        closeOnClickOutside: false,
        closeOnEsc: false
      }).then(async (result) => {
        if (result) {
          try {
            swal({
              text: 'Ok, you are still logged in.',
            });
            count++;
            clearInterval(countdownInterval); // Clear the countdown interval
          } catch (error) {
            console.log(error);
          }
        }
      });

      countdownInterval = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          clearInterval(countdownInterval);
          logouting();
        } else {
          swal({
            title: 'Are You Still There?',
            text: `You will be logged out in ${countdown} seconds.`,
            icon: 'warning',
            buttons: [true, 'Yes'],
            closeOnClickOutside: false,
            closeOnEsc: false
          }).then(async (result) => {
            if (result) {
              try {
                swal({
                  text: 'Ok, you are still logged in.',
                });
                count++;
                clearInterval(countdownInterval); // Clear the countdown interval
              } catch (error) {
                console.log(error);
              }
            }
          });
        }
      }, 1000);
    };
    showCountdown();
  };



  const logouting = async () => {
    try {
      if (count === 0) {

        const alldata = { usercode: auth.usercode, username: auth.employeename, status: 'SystemAborted', ipAddress, mood: 'I', branchid: auth.branchid }

        const response = await axios.post(`${API_URL}/loginhistory`, alldata);
        if (response.status === 200) {
          localStorage.clear();
          navigate('/');
          window.location.reload();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

  const timeoutRef = useRef(null);


  const resetTimeout = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (UserStatus !== 'sa') {
        handleAutologout();
      }
    }, LogoutTime * 60000); // 10 seconds
  };

  

  const handleUserInteraction = () => {
    setLastInteractionTime(Date.now());
    resetTimeout();
  };


  useEffect(() => {
    const events = ['click', 'keypress', 'mousemove', 'scroll', 'touchstart'];

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleUserInteraction);
    });

    // Set the initial timeout
    resetTimeout();

    // Clean up event listeners and timeout on component unmount
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction);
      });
      clearTimeout(timeoutRef.current);
    };
  }, []);



  return (
    <div>
      <AppSidebar auth={auth} pageData={pageData} />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader auth={auth} ipAddress={ipAddress} />
        <div className="body flex-grow-1 px-3">
          <AppContent auth={auth} ipAddress={ipAddress} />
        </div>
        <AppFooter />
      </div>
    </div>
  );
}

DefaultLayout.propTypes = {
  auth: PropTypes.any, // Replace 'any' with the appropriate type based on what 'auth' contains
  pageData: PropTypes.any,
  ipAddress: PropTypes.any,
};

export default DefaultLayout;
