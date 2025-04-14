import React, { useState } from 'react';

function Signup()
{
    const [message,setMessage] = useState('');
    const [loginName,setLoginName] = React.useState('');
    const [loginPassword,setPassword] = React.useState('');
    const [confirmPassword,setConfirmPassword] = React.useState('');
    const [email,setEmail] = React.useState('');
    const [firstName,setFirstName] = React.useState('');
    const [lastName,setLastName] = React.useState('');

    async function doSignup(event:any) : Promise<void>
    {
        event.preventDefault();
        
        // Check for empty first names
        let firstNameEmpty = true;
        for (let i = 0; i < firstName.length; i++) {
            if ((firstName.charAt(i) >= '1' && firstName.charAt(i) <= '9') || (firstName.charAt(i) >= 'a' && firstName.charAt(i) <= 'z') || (firstName.charAt(i) >= 'A' && firstName.charAt(i) <= 'Z')) firstNameEmpty = false;
        }
        if (firstNameEmpty)
        {
            setMessage("Your first name field must have at least one letter or one number.");
            return;
        }

        // Check for empty last names
        let lastNameEmpty = true;
        for (let i = 0; i < lastName.length; i++) {
            if ((lastName.charAt(i) >= '1' && lastName.charAt(i) <= '9') || (lastName.charAt(i) >= 'a' && lastName.charAt(i) <= 'z') || (lastName.charAt(i) >= 'A' && lastName.charAt(i) <= 'Z')) lastNameEmpty = false;
        }
        if (lastNameEmpty)
        {
            setMessage("Your last name must have at least one letter or one number.");
            return;
        }

        // Check for valid email addresses
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(email)) {
            setMessage("Your email must in the form of alphanumeric@alphanumeric.alphanumeric");
            return;
        }

        // Check for empty login names
        let loginNameEmpty = true;
        for (let i = 0; i < loginName.length; i++) {
            if ((loginName.charAt(i) >= '1' && loginName.charAt(i) <= '9') || (loginName.charAt(i) >= 'a' && loginName.charAt(i) <= 'z') || (loginName.charAt(i) >= 'A' && loginName.charAt(i) <= 'Z')) loginNameEmpty = false;
        }
        if (loginNameEmpty)
        {
            setMessage("Your username must have at least one letter or one number.");
            return;
        }

        // Check if the password is at least eight characters long
        if (loginPassword.length < 8)
        {
            setMessage("Your password must be at least eight characters long.");
            return;
        }

        // Check if the password has at least one number and letter
        let hasNumber = false;
        let hasUppercaseLetter = false;
        let hasLowercaseLetter = false;
        for (let i = 0; i < loginPassword.length; i++) {
            if (loginPassword.charAt(i) >= '0' && loginPassword.charAt(i) <= '9') hasNumber = true;
            if (loginPassword.charAt(i) >= 'a' && loginPassword.charAt(i) <= 'z') hasLowercaseLetter = true;
            if (loginPassword.charAt(i) >= 'A' && loginPassword.charAt(i) <= 'Z') hasUppercaseLetter = true;
        }
        if (!hasLowercaseLetter) {
            setMessage("Your password must have at least one lowercase letter.");
            return;
        }
        if (!hasUppercaseLetter) {
            setMessage("Your password must have at least one uppercase letter.");
            return;
        }
        if (!hasNumber) {
            setMessage("Your password must have at least one number.");
            return;
        }

        // Check if the password is confirmed correctly
        if (loginPassword.valueOf() != confirmPassword.valueOf()) {
            setMessage('Passwords do not match! Please try again.');
            return;
        }

        // Check if the username/login has been taken already
        var obj1 = {login:loginName};
        var js1 = JSON.stringify(obj1);
        try {
            const response = await fetch('http://cop4331-11.com:5000/api/checkusername', {method:'POST',body:js1,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if( res.valid != 'valid')
            {
                setMessage('That username is already taken. Please try a different username.');
                return;
            }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }

        // Check if the email address is in use already
        var obj2 = {email:email};
        var js2 = JSON.stringify(obj2);
        try {
            const response = await fetch('http://cop4331-11.com:5000/api/checkemail', {method:'POST',body:js2,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if( res.valid != 'valid')
            {
                setMessage('That email address is already in use. Please use a different email address.');
                return;
            }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }

        // Do the signup
        var obj3 = {firstName:firstName, lastName:lastName, email:email, login:loginName, password:loginPassword};
        var js3 = JSON.stringify(obj3);
        try
        {
            const response = await fetch('http://cop4331-11.com:5000/api/signup', {method:'POST',body:js3,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if (res.error != '')
            {
                setMessage('Error processing signup. Please try again.');
                return;
            }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }

        // Send the verification email
        var obj4 = {login:loginName, password:loginPassword, email:email};
        var js4 = JSON.stringify(obj4);
        try
        {
            const response = await fetch('http://cop4331-11.com:5000/api/sendemail', {method:'POST',body:js4,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if (res.valid != 1)
            {
                console.log("Verification email not sent.");
            }
            setMessage('Signup successful! Please return to the login page to access your new account!');
            return;
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
    };

//    function handleSetLoginName( e: any ) : void
//    {
//        setLoginName( e.target.value );
//    }

//    function handleSetPassword( e: any ) : void
//    {
//        setPassword( e.target.value );
//    }

//    function handleSetConfirmPassword( e: any ) : void
//    {
//        setConfirmPassword( e.target.value );
//    }

//    function handleSetFirstName( e: any ) : void
//    {
//        setFirstName( e.target.value );
//    }

//    function handleSetLastName( e: any ) : void
//    {
//        setLastName( e.target.value );
//    }

//    function handleSetEmail( e: any ) : void
//    {
//        setEmail( e.target.value );
//    }

    return(
            <div
      className="min-h-screen flex items-center justify-center bg-cover bg-fixed bg-center"
      style={{ backgroundImage: 'url("./images/Background.png")' }}
    >
      <div className= "w-[400px] mx-auto bg-white/90 rounded-lg shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-black mb-10">Sign-Up</h1>

        <input
          type="text"
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
          className="w-4/5 p-3 mb-3 border-2 border-black rounded-md text-black"
        />

        <input
          type="text"
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
          className="w-4/5 p-3 mb-3 border-2 border-black rounded-md text-black"
        />

        <input
          type="text"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          className="w-4/5 p-3 mb-3 border-2 border-black rounded-md text-black"
        />

        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setLoginName(e.target.value)}
          className="w-4/5 p-3 mb-3 border-2 border-black rounded-md text-black"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-4/5 p-3 mb-3 border-2 border-black rounded-md text-black"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-4/5 p-3 mb-4 border-2 border-black rounded-md text-black"
        />

        <input
          type="submit"
          value="Sign Up Now!"
          onClick={doSignup}
          className="w-4/5 text-white font-semibold py-3 rounded-md cursor-pointer bg-gray-800 text-white hover:bg-gray-600 transition mb-3"
        />

        <span className="text-sm text-red-600 text-center mb-2">{message}</span>
      </div>
    </div>
    );
};


export default Signup;
