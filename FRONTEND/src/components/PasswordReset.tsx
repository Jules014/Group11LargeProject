import React, { useState } from 'react';
import logo from '../images/CataLogo.png';

function PasswordReset()
{
    const [message,setMessage] = useState('');
    const [email,setEmail] = React.useState('');
    const [message2,setMessage2] = useState('');

    async function resendEmail(event:any) : Promise<void>
    {
        event.preventDefault();
        
        var obj = {email:email};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch('http://cop4331-11.com:5000/api/resetpassword', {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
            JSON.parse(await response.text());
            setMessage('Password recovery email sent if an account with the email exists.');
            setMessage2('');
            return;
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
    };

    function handleSetEmail( e: any ) : void
    {
        setEmail( e.target.value );
    }

    return(
        <div id="loginDiv">
            <img src={logo} id="logo" alt="Logo" />
            <input type="text" id="verificationCode" placeholder="Email address" onChange={handleSetEmail} /><br />
            <input type="submit" id="loginButton" className="buttons" value ="Reset your password" onClick={resendEmail} /> <br />
            <span id="loginResult">{message}</span>
            <span id="loginResult2">{message2}</span>
        </div>
    );
};


export default PasswordReset;