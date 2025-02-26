const { startRegistration,startAuthentication} = SimpleWebAuthnBrowser;
function displayHint(hint) {
    document.querySelector('#text').innerText = hint
}

async function loginInWithfingerprint(e){
    e.preventDefault();
    matric_no = document.querySelector('#matric').value
    console.log(matric_no)
    try{
        if(localStorage.getItem('gc1fab_matric_no') && localStorage.getItem('gc1fab_matric_no') !== matric_no){
            displayHint(`${localStorage.getItem('gc1fab_stuname') || localStorage.getItem('gc1fab_matric_no')} device already registered`)
            return
        }
        // Get challenge from server, challenge is used to verify the response from the client
        const response = await fetch("/api/authn/init-auth", 
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matric_no}),
            credentials: "include"
        })

        // Parse JSON response
        const initResponse = await response.json()

        if(initResponse.error){
            displayHint('Connection Timeout')
            // displayHint('This device is not supported authentication')
            return
        }
        else if(initResponse.exists == false){
            displayHint('Student doesn\'t exists')
            return
        }
        else if(initResponse.msg === 'xxx'){
            displayHint(JSON.stringify(initResponse))
            return
        }

        console.log('Getting passkey')
        // Get passkey
        let authJSON;
        try{
            authJSON =await startAuthentication(initResponse)
        }
        catch(err){
            displayHint('This device is not supported authentication')
            return
        }
        console.log(authJSON,'authJSON var')
        
        // Verify passkey with DB
        const verify_response = await fetch("/api/authn/verify-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({authJSON, matric_no}),
            credentials: "include"
        })
        displayHint(JSON.stringify(verify_response.json))
        // const verifyResponse = await verify_response.json();

        // if(verifyResponse.error){
        //     displayHint('Connection Timeout')
        //     // displayHint(JSON.stringify(initResponse))
        //     return
        // }
        // // else{
        // //     displayHint('Login Successful')
        // //     // redirect to dashboard page frm server with matric_no
        // // }
        // console.log(verifyResponse,'verification var')
            
        
    }
    catch(err){
    document.querySelector('#text').innerText = err;
    }
}

document.querySelector('#loginBtn').addEventListener('click', loginInWithfingerprint);