async function authenticateFingerprint(e){
    console.log(e)
    e.preventDefault();
    try{

    const publicKeyCredentialCreationOptions = {
    challenge: Uint8Array.from([0,12,3,4,5,6]),
    rp: {
        name: "Duo Security",
        // id: "duosecurity.com",
    },
    user: {
        id: new Uint8Array(16),
        name: "lee@webauthn.guide",
        displayName: "Lee",
    },
    pubKeyCredParams: [{alg: -7, type: "public-key"}],
    authenticatorSelection: {
        authenticatorAttachment: "cross-platform",
        userVerification: "preferred" 
    },
    timeout: 60000,
    attestation: "direct"
    };

    const credential = await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions
    });
}
catch(err){
document.querySelector('#text').innerText = err;
    
}
}

document.querySelector('#signupBtn').addEventListener('click', authenticateFingerprint);