import React, {useState } from 'react';

function PasswordEdit()
{
    let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );
    let login : string = ud.login;
    const [currentPassword,setCurrentPassword] = React.useState('');
    const [newPassword,setNewPassword] = React.useState('');
    const [confirmPassword,setConfirmPassword] = React.useState('');
    const [message,setMessage] = useState('');

    async function updatePassword(event:any) : Promise<void> {
        event.preventDefault();
        // Check if the new password is at least eight characters long
        if (newPassword.length < 8)
        {
            setMessage("Your password must be at least eight characters long.");
            return;
        }

        // Check if the new password has at least one number and letter
        let hasNumber = false;
        let hasUppercaseLetter = false;
        let hasLowercaseLetter = false;
        for (let i = 0; i < newPassword.length; i++) {
            if (newPassword.charAt(i) >= '0' && newPassword.charAt(i) <= '9') hasNumber = true;
            if (newPassword.charAt(i) >= 'a' && newPassword.charAt(i) <= 'z') hasLowercaseLetter = true;
            if (newPassword.charAt(i) >= 'A' && newPassword.charAt(i) <= 'Z') hasUppercaseLetter = true;
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

        // Check that the new password matches the confirmation entry
        if (newPassword.valueOf() != confirmPassword.valueOf()) {
            setMessage('Passwords do not match! Please try again.');
            return;
        }
        
        // Verify the old password
        var obj1 = {login:login,password:currentPassword};
        var js1 = JSON.stringify(obj1);
        try
        {
            const response = await fetch('http://cop4331-11.com:5000/api/verifypassword', {method:'POST',body:js1,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if(res.valid == -1)
            {
                setMessage('Your current password was incorrect. Please try again.');
                return;
            }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }

        // Set the new password
        let userToken = localStorage.getItem("user_token");
        var obj2 = {password:newPassword, userToken:userToken};
        var js2 = JSON.stringify(obj2);
        try
        {
            const response = await fetch('http://cop4331-11.com:5000/api/editpassword', {method:'POST',body:js2,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if (res.expired == 'yes') {
                setMessage('Login token has expired. Please login again.');
                await timeout(3000);
                window.location.href = "/";
                return;
            }
            else if (res.error != '')
            {
                setMessage('Error updating password. Please try again.');
                return;
            }
            else
            {
                var newToken = res.userToken;
                localStorage.setItem('user_token', newToken);
                setMessage('Password successfully updated! Returning to the account page...');
                await timeout(3000);
                window.location.href = "/account";
                return;
            }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
    };

    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }

    function cancelInfo() : void {
        window.location.href = "/account";
    }

    function handleSetCurrentPassword( e: any ) : void
    {
        setCurrentPassword( e.target.value );
    }

    function handleSetNewPassword( e: any ) : void
    {
        setNewPassword( e.target.value );
    }

    function handleSetConfirmPassword( e: any ) : void
    {
        setConfirmPassword( e.target.value );
    }

    return(
        <div id="userinfo">
             <table>
                <tbody>
                    <tr>
                        <th>Username</th>
                        <td id="loginField">{login}</td>
                    </tr>
                    <tr>
                        <th>Current Password</th>
                        <td><input type="password" id="currentPassword" placeholder="Old password" onChange={handleSetCurrentPassword} /></td>
                    </tr>
                    <tr>
                        <th>New Password</th>
                        <td><input type="password" id="newPassword" placeholder="New password" onChange={handleSetNewPassword} /></td>
                    </tr>
                    <tr>
                        <th>Confirm New Password</th>
                        <td><input type="password" id="confirmNewPassword" placeholder="Confirm new password" onChange={handleSetConfirmPassword} /></td>
                    </tr>
                    <tr>
                        <th>Actions</th>
                        <td id="buttonField"><button type="button" id="updateButton" className="buttons" onClick={updatePassword}> Update </button></td>
                    </tr>
                    <tr>
                        <th></th>
                        <td id="buttonField"><button type="button" id="cancelButton" className="buttons" onClick={cancelInfo}> Cancel </button></td>
                    </tr>
                </tbody>
            </table>
            <span id="loginResult">{message}</span>
        </div>
    );
}

export default PasswordEdit;