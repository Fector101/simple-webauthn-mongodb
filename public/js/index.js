// const { startRegistration } = require("@simplewebauthn/browser");
const { startRegistration } = SimpleWebAuthnBrowser;
async function authenticateFingerprint(e){
    console.log(e)
    e.preventDefault();
    matric_no = document.querySelector('#matric').value;
    try{
        const response = await fetch("/api/authn/init-reg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matric_no })
        })
        const publicKey = await response.json();
        console.log(publicKey)
        // publicKey.challenge = Uint8Array.from(atob(publicKey.challenge), c => c.charCodeAt(0));
        // publicKey.user.id = Uint8Array.from(atob(publicKey.user.id), c => c.charCodeAt(0));


        // Create passkey
        const registationJSON =await startRegistration(publicKey)
    
        // save passkey
        const verify_response = await fetch("/api/authn/verify-reg", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({registationJSON, matric_no})
        })
        const verify = await verify_response.json();
        console.log(verify,'verification var')
        document.querySelector('#text').innerText = JSON.stringify(verify)
        // const credential = await navigator.credentials.create({publicKey})
            
        
}
catch(err){
document.querySelector('#text').innerText = err;
    
}
}

document.querySelector('#signupBtn').addEventListener('click', authenticateFingerprint);