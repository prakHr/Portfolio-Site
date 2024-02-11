// elements
const startBtn = document.querySelector("#start")
const stopBtn = document.querySelector("#stop")
const speakBtn = document.querySelector("#speak")
// sr setup
const SpeechRecognition = 
    window.SpeechRecognition || window.webkitSpeechRecognition

const recognition = new SpeechRecognition()

// sr start
recognition.onstart = function(){
    // console.log("VR active")
}

// sr result
recognition.onresult = function(event){
    // console.log(event);
    let current    = event.resultIndex
    let transcript = event.results[current][0].transcript
    transcript = transcript.toLowerCase()
    // console.log(transcript)
    if(transcript.includes("hi") || transcript.includes("hello")){
        readOut("hello sir")
    }
    let commands = [
        "portfolio",
        "metaverse",
        "certificate",
        "project",
        "technology",
        "company",
        "work",
        "resource",
        "contact",
        "google",
        "slack",
        "youtube",

    ];
    let urls = [
        "https://prakhr.github.io/Portfolio-Site/",
        "https://metaverse-portfolio-website.vercel.app/",
        "https://prakhr.github.io/Portfolio-Site/#certifications",
        "https://prakhr.github.io/Portfolio-Site/#projects",
        "https://prakhr.github.io/Portfolio-Site/#technologies",
        "https://prakhr.github.io/Portfolio-Site/#company",
        "https://prakhr.github.io/Portfolio-Site/#works",
        "https://prakhr.github.io/Portfolio-Site/#resources",
        "https://prakhr.github.io/Portfolio-Site/#contact",
        "https://www.google.com/",
        "https://slack.com/intl/en-in/",
        "https://www.youtube.com"

    ]
    for(var i=0;i<urls.length;i++){
        if(transcript.includes(commands[i])){
            readOut("opening "+ commands[i] + " sir")
            window.open(urls[i])
        }
    
    }
    if(transcript.includes("play")){
        readOut("playing youtube video for you sir")
        let input = transcript
        input = input.split(" ")
        inputs = ""
        for(let i=1;i<input.length;i++){
            if(i!=input.length-1)
                inputs+=input[i]+" "
            else inputs+=input[i]
        }
        input = inputs
        window.open(`https://www.youtube.com/search?q=${input}`)
        
    }
    if(transcript.includes("search for")){
        readOut("here's the searches for you")
        let input = transcript
        // input.splice(0,11)
        // input.pop();
        // console.log(input)
        // input=input.join("").split(" ").join("+")
        input = input.split(" ")
        inputs = ""
        for(let i=2;i<input.length;i++)
            inputs+=input[i]+" "
        input = inputs
        // console.log(input)
        // window.open(`https://www.google.com/search?q=${input}`)
        window.open(`${urls[urls.length-1]}/search?q=${input}`)
    }

    
    // console.log(transcript)
    // readOut(transcript)
};
// sr stop
recognition.onend = function(event){
     
    // console.log("VR deactive")
}

// sr continous
// recognition.continuous = true;
startBtn.addEventListener("click",()=>{
    recognition.start()
})

stopBtn.addEventListener("click",()=>{
    recognition.stop()
})

// friday speech
function readOut(message){
    const speech = new SpeechSynthesisUtterance()
    // different voices
    const allVoices = speechSynthesis.getVoices();

    speech.voice = allVoices[2]
    speech.text = message
    speech.volume = 1
    window.speechSynthesis.speak(speech)
    // console.log("speaking out")

}
speakBtn.addEventListener("click",()=>{
    readOut("Welcome to my website, it contains our services to help you...")
    
})
window.onload = function(){
    readOut(" ");
}