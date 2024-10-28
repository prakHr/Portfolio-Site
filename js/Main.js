document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const checkpoints = gsap.utils.toArray(".Checkpoint");
    checkpoints.forEach(checkpoint=>{
        gsap.from(checkpoint.firstElementChild,{
            height:0,
            scrollTrigger:{
                trigger:checkpoint,
                start:"center center",
                end:"bottom+=340 center",
                scrub: true,
            }
        });
    });
    const checkpointTexts = gsap.utils.toArray(".Text");

    checkpointTexts.forEach(text => {
        gsap.from(text,{
            opacity:0,
            x:100,
            ease:"power2.inOut",
            scrollTrigger:{
                trigger:text.parentElement,
                start:"top+=200 center",
                end:"bottom+=340 center",
                toggleActions: "restart none none reverse",
            }
        })
    });
    const images = document.querySelectorAll(".Images img");
    images.forEach((img,i)=>{
        const adjacentCheckpoint = img.parentElement.nextElementSibling.children[i];
        gsap.from(img,{
            opacity:0,
            scrollTrigger:{
                trigger:adjacentCheckpoint,
                start:"top+=200 center",
                end:"bottom+=340 center",
                toggleActions:"restart none none reverse"
            }
        })
    });    
});
