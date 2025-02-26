const { startRegistration,startAuthentication} = SimpleWebAuthnBrowser;
function displayHint(hint) {
    document.querySelector('#text').innerText = hint
}

async function signUpfingerprint(e){
    e.preventDefault();
    let matric_no = document.querySelector('#matric').value
    let student_name = document.querySelector('#name').value
    try{
        if(localStorage.getItem('gc1fab_matric_no')){
            displayHint(`${localStorage.getItem('gc1fab_stuname') || localStorage.getItem('gc1fab_matric_no')} device already registered`)
            const is_stud_response = await fetch("/api/authn/is-student", 
                {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ matric_no }),
                credentials: "include"
            })
            const res_ = await is_stud_response.json()
            if(res_.exists && !res_.error){
                return
            }
        }

        
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
            displayHint('Connection Timeout')
            return
        }
        
        else if(initResponse.exists){
            displayHint(`${initResponse.student_name} already registered`)
            return
        }
        else if(initResponse.msg === 'xxx'){
            displayHint(JSON.stringify(initResponse))
            return
        }

        // Create passkey
        let registationJSON;
        try{
            registationJSON =await startRegistration(initResponse)
        }catch(err){
            displayHint('This device is not supported authentication')
            // displayHint(err)
            return
        }
        
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
            displayHint('Connection Timeout')
            // displayHint(JSON.stringify(initResponse))
            return
        }
        else if(verifyResponse.already_reg_device){
            displayHint(`${verifyResponse.student_name} device already registered`)
            return
        }
        else{
            displayHint('Student Registered successfully')
            localStorage.setItem('gc1fab_matric_no',matric_no)
            localStorage.setItem('gc1fab_stuname',verifyResponse.student_name)
            // redirect to dashboard page frm server with matric_no
        }
        console.log(verifyResponse,'verification var')
            
        
    }
    catch(err){
    document.querySelector('#text').innerText = err;
        
    }
}

document.querySelector('#signupBtn').addEventListener('click', signUpfingerprint);

