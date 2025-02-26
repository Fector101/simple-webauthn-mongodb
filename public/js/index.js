const { startRegistration,startAuthentication} = SimpleWebAuthnBrowser;
function displayHint(hint) {
    document.querySelector('#text').innerText = hint
}

async function signUpfingerprint(e){
    e.preventDefault();
    matric_no = document.querySelector('#matric').value
    student_name = document.querySelector('#name').value
    try{

        // Get challenge from server, challenge is used to verify the response from the client
        const response = await fetch("/api/authn/init-reg", 
            {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matric_no,student_name }),
            credentials: "include"
        })

        // Parse JSON response
        const initResponse = await response.json()

        if(initResponse.error){
            displayHint(JSON.stringify(initResponse))
            return
        }
        else if(initResponse.exists){
            displayHint(`${initResponse.student_name} already exists`)
            return
        }
        else if(initResponse.msg === 'xxx'){
            displayHint('This device is not supported authentication')
            return
        }

        // Create passkey
        const registationJSON =await startRegistration(initResponse)
        
        console.log(registationJSON,'registationJSON var')
        
        // Save and verify passkey with server
        const verify_response = await fetch("/api/authn/verify-reg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({registationJSON, matric_no,student_name}),
            credentials: "include"
        })
        const verifyResponse = await verify_response.json();

        if(verifyResponse.error){
            displayHint(JSON.stringify(initResponse))
            return
        }
        else{
            displayHint('Student Registered successfully')
            // redirect to dashboard page frm server with matric_no
        }
        console.log(verifyResponse,'verification var')
            
        
    }
    catch(err){
    document.querySelector('#text').innerText = err;
        
    }
}


async function loginInWithfingerprint(e){
    e.preventDefault();
    matric_no = document.querySelector('#matric').value
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
            displayHint(`${initResponse.student_name} already exists`)
            return
        }
        else if(initResponse.msg === 'xxx'){
            displayHint('This device is not supported authentication')
            return
        }

        // Create passkey
        const authJSON =await startAuthentication(initResponse)
        
        console.log(registationJSON,'authJSON var')
        
        // Save and verify passkey with server
        const verify_response = await fetch("/api/authn/verify-auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({registationJSON, matric_no,student_name}),
            credentials: "include"
        })
        const verifyResponse = await verify_response.json();

        if(verifyResponse.error){
            displayHint(JSON.stringify(initResponse))
            return
        }
        else{
            // displayHint('Successfully Marked')
            // redirect to dashboard page frm server with matric_no
        }
        console.log(verifyResponse,'verification var')
            
        
    }
    catch(err){
    document.querySelector('#text').innerText = err;
    }
}

document.querySelector('#signupBtn').addEventListener('click', loginInWithfingerprint);

document.querySelector('#signupBtn').addEventListener('click', signUpfingerprint);

