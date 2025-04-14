function LoggedInName()
{
    let _ud : any = localStorage.getItem('user_data');
    let ud = JSON.parse( _ud );
    let userId : number = ud.id;
    let firstName : string = ud.firstName;
//    let lastName : string = ud.lastName;

    if (userId != 1) {
        window.location.href = "/";
        return;
    }

    verifyToken();

    async function verifyToken() : Promise<void> {
        let userToken = localStorage.getItem("user_token");
        
        var obj = {userToken:userToken};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch('http://cop4331-11.com:5000/api/verifytoken', {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
            var res = JSON.parse(await response.text());
            if (res.expired == 'yes') {
                window.location.href = "/";
                return;
            }
            else if (res.expired == 'no') {
                var newToken = res.userToken;
                localStorage.setItem('user_token', newToken);
                return;
            }
            else {
                return;
            }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
    }

    function doLogout(event:any) : void
    {
        event.preventDefault();
        var user = {firstName:"",lastName:"",id:-1}
        localStorage.setItem('user_data', JSON.stringify(user));
        // document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "/";
    };
    
    return(
        <div id="loggedInDiv" className="text-sm space-y-2">
            <span className="text-md">Hello {firstName}!</span>
            <button type="button" id="logoutButton" className="buttons px-4 py-2" onClick={doLogout}> Log Out </button>
        </div>
    );
};

export default LoggedInName;
