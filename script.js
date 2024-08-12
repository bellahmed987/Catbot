const input = document.querySelector(".inputbox input");
const send = document.querySelector(".inputbox .submit");
const speak = document.querySelector(".inputbox .speak");
const display = document.querySelector(".chat");

let keys = "AIzaSyD-62awcLO1FpkMEMd5BcVio-D9T621ANQ";
let apiurl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${keys}`;

// Initialize Speech Recognition
const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechRecognition = new recognition();

speechRecognition.continuous = false;
speechRecognition.interimResults = false;
speechRecognition.lang = 'en-US';

speak.onclick = () => {
    speechRecognition.start();
};

speechRecognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
};

speechRecognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
};

send.onclick = async function() {
    let userInput = input.value;
    if (userInput) {
        const usermsg = `<div class="user">
            <div class="userdetails"><img src="user.jpg"><span>${userInput}</span></div>
        </div>`;
       
        display.insertAdjacentHTML("beforeend", usermsg);

        setTimeout(async () => {
            try {
                const response = await fetch(apiurl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: [{
                            role: "user",
                            parts: [{ text: userInput }],
                        }]
                    })
                });
                const data = await response.json();
                const reply = data?.candidates[0].content.parts[0].text;
                const cpresponse = `<div class="bot">
                <div class="botdetails"><img src="cat.jpg"><span>${reply}</span></div>
            </div>`;
            display.insertAdjacentHTML("beforeend", cpresponse);
                
            } catch (error) {
                console.error(error);
            }
        }, 100);
    }
};
