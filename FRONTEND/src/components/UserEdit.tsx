import React, { useEffect, useState } from 'react';

function UserEdit()
{
    let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );
    let firstName : string = ud.firstName;
    let lastName : string = ud.lastName;
    let email : string = ud.email;
    let login : string = ud.login;
    const [newFirstName,setFirstName] = React.useState('');
    const [newLastName,setLastName] = React.useState('');
    const [newEmail,setEmail] = React.useState('');
    const [message,setMessage] = useState('');    

    async function updateInfo(event:any) : Promise<void> {
        event.preventDefault();
        let userToken = localStorage.getItem("user_token");
        
        var obj = {firstName:newFirstName, lastName:newLastName, email:newEmail, userToken:userToken};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch('http://cop4331-11.com/api/edituser', {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if (res.expired == 'yes') {
                setMessage('Login token has expired. Please login again.');
                await timeout(3000);
                window.location.href = "/";
                return;
            }
            else if (res.error != '')
            {
                setMessage('Error updating account info. Please try again.');
                return;
            }
            else
            {
                var user = {firstName:res.firstName,lastName:res.lastName,email:res.email,login:login,id:1}
                localStorage.setItem('user_data', JSON.stringify(user));
                var newToken = res.userToken;
                localStorage.setItem('user_token', newToken);
                setMessage('Account information successfully updated! Returning to the account page...');
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
    
    function handleSetFirstName( e: any ) : void
    {
        setFirstName( e.target.value );
    }

    function handleSetLastName( e: any ) : void
    {
        setLastName( e.target.value );
    }

    function handleSetEmail( e: any ) : void
    {
        setEmail( e.target.value );
    }

    function cancelInfo() : void {
        window.location.href = "/account";
    }

    useEffect(() => {
        setFirstName(firstName);
        setLastName(lastName);
        setEmail(email);
    }, []);

    return(
        <div className="w-[600px] mx-auto p-6 bg-white rounded shadow">
             <table className="w-full">
                <tbody>
                    <tr>
                        <th>Username</th>
                        <td id="loginField">{login}</td>
                    </tr>
                    <tr>
                        <th>First Name</th>
                        <td id="firstNameField"><input type="text" id="editFirstName" defaultValue={firstName} onChange={handleSetFirstName} /></td>
                    </tr>
                    <tr>
                        <th>Last Name</th>
                        <td id="lastNameField"><input type="text" id="editLastName" defaultValue={lastName} onChange={handleSetLastName} /></td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td id="emailField"><input type="text" id="editEmail" defaultValue={email} onChange={handleSetEmail} /></td>
                    </tr>
                    <tr>
                        <th>Actions</th>
                        <td id="buttonField"><button type="button" id="updateButton" className="buttons" onClick={updateInfo}> Update </button></td>
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

export default UserEdit;
