import React, { useState } from 'react';
import logo from '../images/CataLogo.png';

function EmailVerification()
{
    const [message,setMessage] = useState('');
    const [code,setVerificationCode] = React.useState('');
    const [message2,setMessage2] = useState('');

    async function resendEmail() : Promise<void> {
        let userToken = localStorage.getItem("user_token");
        var obj = {userToken:userToken};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch('http://cop4331-11.com:5000/api/resendemail', {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if (res.valid != 1)
            {
                console.log("Verification email not sent.");
                return;
            }
            setMessage('Verification code email resent.');
            return;
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
    }

    async function doVerification(event:any) : Promise<void>
    {
        event.preventDefault();
        
        let userToken = localStorage.getItem("user_token");
        var obj = {userToken:userToken, code:code};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch('http://cop4331-11.com:5000/api/verifyemail', {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if(res.valid == -1)
            {
                setMessage('Your Verification code was incorrect.');
                setMessage2('Please try again.');
                return;
            }
            else
            {
                setMessage('Email verified! Logging in...');
                setMessage2('');
                window.location.href = '/cats';
                return;
            }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
    };

    function handleSetVerificationCode( e: any ) : void
    {
        setVerificationCode( e.target.value );
    }

    return(
        <div className= "w-[400px] mx-auto bg-white/90 rounded-lg shadow-lg p-8 flex flex-col items-center">
            <img src={logo} id="logo" alt="Logo" />
            <span id="login">Verify Email</span>
            <input type="text" id="verificationCode" placeholder="Verification Code" onChange={handleSetVerificationCode} /><br />
            <input type="submit" id="loginButton" className="buttons" value ="Verify your account" onClick={doVerification} /><br />
            <input type="submit" id="loginButton" className="buttons" value ="Resend verification email" onClick={resendEmail} /> <br />
            <span id="loginResult">{message}</span>
            <span id="loginResult2">{message2}</span>
        </div>
    );
};


export default EmailVerification;