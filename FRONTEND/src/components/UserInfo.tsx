function UserInfo()
{
    let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );
    let firstName : string = ud.firstName;
    let lastName : string = ud.lastName;
    let email : string = ud.email;
    let login : string = ud.login;

    function editInfo() : void {
        window.location.href = "/accountedit";
    }

    function changePassword() : void {
        window.location.href = "/changepassword";
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
                        <th>First Name</th>
                        <td id="firstNameField">{firstName}</td>
                    </tr>
                    <tr>
                        <th>Last Name</th>
                        <td id="lastNameField">{lastName}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td id="emailField">{email}</td>
                    </tr>
                    <tr>
                        <th>Actions</th>
                        <td id="buttonField"><button type="button" id="editAccountButton" className="buttons" onClick={editInfo}> Edit Account Info</button></td>
                    </tr>
                    <tr>
                        <th></th>
                        <td id="buttonField"><button type="button" id="editPasswordButton" className="buttons" onClick={changePassword}> Change Password</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default UserInfo;