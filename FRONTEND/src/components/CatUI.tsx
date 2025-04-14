import React, { useState } from 'react';

function CatUI()
{
    const [message,setMessage] = useState('');
    const [message2,setMessage2] = useState('');
    const [file, setFile] = useState<File | null>(null);

    function handleFileChange (e: React.ChangeEvent<HTMLInputElement>) : void 
    {
        if (e.target.files) {
          setFile(e.target.files[0]);
        }
    };

    async function uploadFile(event:any) : Promise<void> {
        event.preventDefault();

        if (file) {
            const fd = new FormData();
            fd.append('file', file);

            try
            {
                const response = await fetch('https://ketchrl-CatAI-logue.hf.space/predict', {method:'POST',body:fd});
                var res = JSON.parse(await response.text());
                if (res.error != null) {
                    alert(res.error.toString());
                    return;
                }
                else {
                    var breed = res.breed;
                    var confidence = res.confidence;
                    setMessage("The breed is " + breed);
                    setMessage2("with a " + confidence + "% of being accurate.");
                }
            }
            catch (error:any)
            {
                alert(error.toString());
                return;
            }

            // API call to update history
            const date = new Date();
            let userToken = localStorage.getItem("user_token");
            var obj = {date:date, breed:breed, confidence:confidence, userToken:userToken}; // TBD
            var js = JSON.stringify(obj);
            try {
                const response = await fetch('http://cop4331-11.com:5000/api/addhistory', {method:'POST',body:js,headers:{'Content-Type':'application/json'}});
                var res = JSON.parse(await response.text());
                if (res.expired == 'yes') {
                    setMessage('Login token has expired. Please login again.');
                    await timeout(3000);
                    window.location.href = "/";
                    return;
                }
                else if (res.error != '')
                {
                    alert(res.error.toString());
                    return;
                }
                else
                {
                    var newToken = res.userToken;
                    localStorage.setItem('user_token', newToken);
		    return;
                }
            }
            catch (error:any)
            {
                alert(error.toString());
                return;
            }
        }
    }

    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }


    return(
        <div id="catSearch">
            <input id="getFile" type="file" onChange={handleFileChange} /><br />
            <button type="button" id="uploadButton" className="buttons" onClick={uploadFile}> Upload File! </button><br />
            <span id="breedResult">{message}</span><br />
            <span id="confidenceResult">{message2}</span>
        </div>
    );
}

export default CatUI;