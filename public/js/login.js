const { startRegistration,startAuthentication} = SimpleWebAuthnBrowser;
function displayHint(hint) {
    document.querySelector('#text').innerText = hint
}

async function loginInWithfingerprint(e){
    e.preventDefault();
    matric_no = document.querySelector('#matric').value
    console.log(matric_no)
    try{

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
            displayHint(JSON.stringify(initResponse))
            return
        }
        else if(initResponse.exists){
            displayHint('Student doesn\'t already exists')
            return
        }
        else if(initResponse.msg === 'xxx'){
            displayHint('This device is not supported authentication')
            return
        }

        // Get passkey
        const authJSON =await startAuthentication(initResponse)
        
        console.log(authJSON,'authJSON var')
        
        // Verify passkey with DB
        const verify_response = await fetch("/api/authn/verify-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({authJSON, matric_no,student_name}),
            credentials: "include"
        })
        const verifyResponse = await verify_response.json();

        if(verifyResponse.error){
            displayHint(JSON.stringify(initResponse))
            return
        }
        else{
            displayHint('Login Successful')
            // redirect to dashboard page frm server with matric_no
        }
        console.log(verifyResponse,'verification var')
            
        
    }
    catch(err){
    document.querySelector('#text').innerText = err;
    }
}

document.querySelector('#loginBtn').addEventListener('click', loginInWithfingerprint);