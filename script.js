const bgMusic=document.getElementById("bgMusic");
const musicBtn=document.getElementById("musicBtn");

let musicPlaying=false;

function playMusic(){

    if(musicPlaying)return;

    bgMusic.volume=.6;

    bgMusic.play().then(()=>{

        musicPlaying=true;
        musicBtn.textContent="❚❚";

    }).catch(()=>{

        musicBtn.textContent="❚❚";

    });

}

musicBtn.addEventListener("click",()=>{

    if(bgMusic.paused){

        bgMusic.play();
        musicBtn.textContent="❚❚";

    }else{

        bgMusic.pause();
        musicBtn.textContent="▶";

    }

});

/*=========================
LOCK SCREEN
=========================*/

const PASSWORD="200602"; //Ganti Password Disini

const lockScreen=document.getElementById("lockScreen");
const mainWebsite=document.getElementById("mainWebsite");

const pinDisplay=document.getElementById("pinDisplay");
const deleteBtn=document.getElementById("deleteBtn");
const okBtn=document.getElementById("okBtn");
const numberButtons=document.querySelectorAll(".key");

let pin="";

function updateDisplay(){
    pinDisplay.textContent="•".repeat(pin.length);
}

function shakeLock(){
    lockScreen.animate([
        {transform:"translateX(-10px)"},
        {transform:"translateX(10px)"},
        {transform:"translateX(-6px)"},
        {transform:"translateX(6px)"},
        {transform:"translateX(0)"}
    ],{
        duration:300
    });
}

numberButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        if(pin.length>=20)return;
        pin+=button.textContent;
        updateDisplay();
    });
});

deleteBtn.addEventListener("click",()=>{
    pin=pin.slice(0,-1);
    updateDisplay();
});

okBtn.addEventListener("click",()=>{

    if(pin===PASSWORD){

        lockScreen.classList.add("hide");

        setTimeout(()=>{

            mainWebsite.classList.add("show");
            
                playMusic();

            document.body.style.overflow="hidden";

        },300);

    }else{

        shakeLock();

        pin="";

        updateDisplay();

    }

});

updateDisplay();

/*=========================
PERPINDAHAN HALAMAN
=========================*/

function nextScreen(screenId){

    document.querySelectorAll(".screen,.screen-game3,#screen-final").forEach(screen=>{
        screen.classList.remove("active");
    });

    document.getElementById(screenId).classList.add("active");

    switch(screenId){

        case "screen-game1":
            score=0;
            document.getElementById("score").innerText="Hati: 0 / 10";
            document.getElementById("game-container").innerHTML="";
            startGame1();
        break;

        case "screen-game2":
            currentQuestion=0;
            startGame2();
        break;

        case "screen-game3":
            startGame3();
        break;

    }

}

/*=========================
PERMAINAN 1
TANGKAP HATI
=========================*/

let score=0;

const words=[
    "Selalu bikin aku senyum",
    "Manis banget",
    "Lucu",
    "Perhatian",
    "Penyayang",
    "Menenangkan",
    "Menggemaskan",
    "Spesial buatku",
    "Terbaik",
    "AKU SAYANG KAMU"
];

function startGame1(){

    score=0;

    document.getElementById("score").innerText="Hati: 0 / 10";

    const container=document.getElementById("game-container");

    container.innerHTML="";

    for(let i=0;i<10;i++){

        setTimeout(()=>{

            createHeart(container);

        },i*800);

    }

}

function createHeart(container){

    const heart=document.createElement("div");

    heart.classList.add("heart");
    heart.innerHTML="❤️";

    const margin=60;
    const maxWidth=container.clientWidth-(margin*2);
    const maxHeight=container.clientHeight-(margin*2);

    const randomX=margin+(Math.random()*maxWidth);
    const randomY=margin+(Math.random()*maxHeight);

    heart.style.left=randomX+"px";
    heart.style.top=randomY+"px";

    heart.onclick=()=>{

        score++;

        document.getElementById("score").innerText=`Hati: ${score} / 10`;

        const text=document.createElement("div");
        text.className="heart-explosion";
        text.textContent=words[score-1];

        container.appendChild(text);

        const padding=10;

        const textWidth=text.offsetWidth;
        const textHeight=text.offsetHeight;

        let x=randomX;
        let y=randomY;

        if(x-textWidth/2<padding){
            x=textWidth/2+padding;
        }

        if(x+textWidth/2>container.clientWidth-padding){
            x=container.clientWidth-textWidth/2-padding;
        }

        if(y-textHeight/2<padding){
            y=textHeight/2+padding;
        }

        if(y+textHeight/2>container.clientHeight-padding){
            y=container.clientHeight-textHeight/2-padding;
        }

        text.style.left=x+"px";
        text.style.top=y+"px";

        heart.remove();

        setTimeout(()=>{
            text.remove();
        },1200);

        if(score===10){

            document.querySelectorAll(".heart").forEach(h=>h.remove());

            setTimeout(()=>{
                nextScreen("screen-game2");
            },1200);

        }

    };

    container.appendChild(heart);

}

/*=========================
PERMAINAN 2
KUIS
=========================*/

const triviaQuestions=[
{
    q:"Apa makanan favoritku?",
    options:[
        "🍜 Bakso",
        "🍗 Masakanmu",
        "🍛 Mie Ayam",
        "🍕 Sate"
    ],
    correct:1
},
{
    q:"Apa minuman yang paling sering kupesan?",
    options:[
        "🧋 Es Teh",
        "☕ Kopi",
        "🥤 Air Putih",
        "🥛 Susu"
    ],
    correct:2
},
{
    q:"Apa panggilan yang paling sering kupakai buat kamu?",
    options:[
        "💖 Sayang",
        "🌸 Cantik",
        "😊 Salma",
        "🥰 Incess"
    ],
    correct:0
}
];

let currentQuestion=0;

function startGame2(){
    showQuestion();
}

function showQuestion(){

    const screen=document.getElementById("screen-game2");

    screen.classList.remove("question-show");
    void screen.offsetWidth;
    screen.classList.add("question-show");

    const questionData=triviaQuestions[currentQuestion];

    document.getElementById("question-text").innerText=questionData.q;

    const optionsContainer=document.getElementById("options");

    optionsContainer.innerHTML="";

    questionData.options.forEach((option,index)=>{

        const button=document.createElement("button");

        button.classList.add("option-btn");

        button.innerText=option;

        button.onclick=()=>{
            checkAnswer(index);
        };

        optionsContainer.appendChild(button);

    });

}

function checkAnswer(selectedIndex){

    const questionData=triviaQuestions[currentQuestion];

    if(selectedIndex===questionData.correct){

        currentQuestion++;

        if(currentQuestion<triviaQuestions.length){
            showQuestion();
        }else{
            startGame3();
            nextScreen("screen-game3");
        }

    }else{

        alert("Jawaban belum tepat. Coba lagi ya 😊");

    }

}

/*=========================
GAME 3
LOVE MEMORY
=========================*/

const board=document.getElementById("board");
const pairCount=document.getElementById("pairCount");
const timer=document.getElementById("timer");
const popup=document.getElementById("popup");
const finishTime=document.getElementById("finishTime");
const nextButton=document.getElementById("nextButton");

const game3Emojis=[
    "🌹","🧸","🎂","💌","⭐","🎁",
    "🌹","🧸","🎂","💌","⭐","🎁"
];

let firstCard=null;
let secondCard=null;
let lockBoard=false;
let pairs=0;
let started=false;
let seconds=0;
let timerInterval=null;

function startGame3(){

    firstCard=null;
    secondCard=null;
    lockBoard=false;
    pairs=0;
    started=false;
    seconds=0;

    pairCount.textContent="0";
    timer.textContent="00:00";
    finishTime.textContent="00:00";

    popup.classList.remove("show");

    clearInterval(timerInterval);

    shuffle(game3Emojis);

    createBoard();

    timerInterval=setInterval(()=>{

        if(!started)return;

        seconds++;

        const m=String(Math.floor(seconds/60)).padStart(2,"0");
        const s=String(seconds%60).padStart(2,"0");

        timer.textContent=`${m}:${s}`;

    },1000);

}

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]]=[array[j],array[i]];

    }

}

function createBoard(){

    board.innerHTML="";

    game3Emojis.forEach(value=>{

        const card=document.createElement("div");

        card.className="game-card";

        card.dataset.value=value;

        card.innerHTML=`
            <div class="card-inner">
                <div class="card-front">❤</div>
                <div class="card-back">${value}</div>
            </div>
        `;

        card.addEventListener("click",flipCard);

        board.appendChild(card);

    });

}

function flipCard(){

    if(lockBoard)return;
    if(this===firstCard)return;
    if(this.classList.contains("matched"))return;

    started=true;

    this.classList.add("flip");

    if(!firstCard){

        firstCard=this;

        return;

    }

    secondCard=this;

    lockBoard=true;

    if(firstCard.dataset.value===secondCard.dataset.value){

        matchCards();

    }else{

        setTimeout(()=>{

            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");

            resetBoard();

        },700);

    }

}

function matchCards(){

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    createGame3Heart(firstCard);

    pairs++;

    pairCount.textContent=pairs;

    resetBoard();

    if(pairs===6){

        clearInterval(timerInterval);

        finishTime.textContent=timer.textContent;

        setTimeout(()=>{

            popup.classList.add("show");

        },500);

    }

}

function resetBoard(){

    firstCard=null;
    secondCard=null;
    lockBoard=false;

}

nextButton.addEventListener("click",()=>{

    popup.classList.remove("show");

    const game=document.getElementById("screen-game3");

    game.style.transition="opacity .6s ease, transform .6s ease";
    game.style.opacity="0";
    game.style.transform="scale(.96)";

    setTimeout(()=>{

        game.classList.remove("active");
        game.style.opacity="";
        game.style.transform="";

        nextScreen("screen-gallery");

    },600);

});

function createGame3Heart(card){

    const rect=card.getBoundingClientRect();

    for(let i=0;i<12;i++){

        const heart=document.createElement("div");

        heart.className="heart-effect";

        heart.textContent="💖";

        heart.style.left=rect.left+rect.width/2+"px";
        heart.style.top=rect.top+rect.height/2+"px";

        heart.style.transform=`translate(0,0) scale(${.6+Math.random()})`;

        document.body.appendChild(heart);

        requestAnimationFrame(()=>{

            const x=(Math.random()-.5)*120;
            const y=-(50+Math.random()*70);

            heart.style.transform=`translate(${x}px,${y}px) scale(${.8+Math.random()})`;

            heart.style.opacity="0";

        });

        setTimeout(()=>{

            heart.remove();

        },800);

    }

}


/*=========================
MEMBUAT CONFETTI
=========================*/

function createConfetti(){

    const colors=[
        "#CBE896",
        "#AAC0AA",
        "#FCDFA6",
        "#F4B886"
    ];

    for(let i=0;i<50;i++){

        const confetti=document.createElement("div");

        confetti.classList.add("confetti");

        confetti.style.left=Math.random()*100+"vw";

        confetti.style.backgroundColor=
            colors[Math.floor(Math.random()*colors.length)];

        confetti.style.animationDuration=
            (Math.random()*2+2)+"s";

        confetti.style.opacity=Math.random();

        document.body.appendChild(confetti);

        setTimeout(()=>{
            confetti.remove();
        },4000);

    }

}

/*=========================
PREVIEW GALLERY
=========================*/

const preview=document.getElementById("photoPreview");
const previewImage=document.getElementById("previewImage");

document.querySelectorAll(".polaroid img").forEach(img=>{

    img.addEventListener("click",()=>{

        previewImage.src=img.src;
        preview.classList.add("show");

    });

});

preview.addEventListener("click",()=>{

    preview.classList.remove("show");

});

/*=========================
HALAMAN AKHIR
BUKA SURAT
=========================*/

const finalMessage=`Selamat bertambah usia, sayangkuu 💖

Di usia kamu yang sekarang, aku harap kamu selalu dikelilingi hal-hal baik, dipermudah setiap langkahnya, dan diberi kebahagiaan yang tiada habisnya.

Terimakasih sudah hadir di kehidupanku, sudah jadi orang yang selalu ada di saat senang maupun susah. Cara kamu tertawa, cara kamu peduli, bahkan hal-hal kecil tentang kamu itu selalu berhasil bikin hari-hariku jadi lebih baik.

Aku berharap di umur kamu yang baru ini, semua yang kamu impikan bisa satu per satu terwujud. Semoga kamu selalu kuat menjalani apapun, tetap jadi diri kamu yang baik, dan jangan pernah kehilangan semangat kamu ya.`;

let typingTimeout=null;


/*=========================
HEART TRANSITION
=========================*/

function openLetter(){

    const letterPage=document.getElementById("letterPage");
    const letter=document.getElementById("letter");
    const title=document.querySelector(".letter-title");

    letterPage.classList.add("show");
    letter.style.display="block";

    title.classList.remove("show");
    void title.offsetWidth;

    setTimeout(()=>{
        title.classList.add("show");
    },100);

    setTimeout(()=>{
        startTypeWriter();
    },1600);

}

function startTypeWriter(){

    clearTimeout(typingTimeout);

    const signature=document.querySelector(".letter-signature");
    signature.classList.remove("show");

    const gift=document.getElementById("giftBox");
    gift.classList.remove("show","open");

    const letterName=document.getElementById("letterName");
    const letterNameCursor=document.getElementById("letterNameCursor");

    const text=document.getElementById("letterText");
    const cursor=document.getElementById("letterCursor");

    // Reset isi
    letterName.innerHTML="";
    text.textContent="";

    // Sembunyikan semua cursor dulu
    letterNameCursor.style.display="none";
    cursor.style.display="none";

    const intro="For the most special person,\nSalma Salsabilla ❤️";

    let introIndex=0;
    let index=0;

    function typeIntro(){

        letterNameCursor.style.display="inline-block";

        if(introIndex>=intro.length){

            letterNameCursor.style.display="none";

            // Jeda sebelum mulai isi surat
            typingTimeout=setTimeout(()=>{

                cursor.style.display="inline-block";
                type();

            },1000);

            return;

        }

        const char=intro.charAt(introIndex);

        if(char==="\n"){
            letterName.innerHTML+="<br>";
        }else{
            letterName.innerHTML+=char;
        }

        introIndex++;

        let delay=30+Math.random()*20;

        if(char===","||char===".")
            delay=180;

        if(char==="!"||char==="?"||char==="❤️")
            delay=250;

        typingTimeout=setTimeout(typeIntro,delay);

    }

    function type(){

        if(index>=finalMessage.length){

            cursor.style.display="none";
            signature.classList.add("show");

            // 1 detik setelah signature muncul, tampilkan kado
            setTimeout(()=>{

                gift.classList.add("show");

            },1000);

            return;

        }

        const char=finalMessage.charAt(index);

        text.textContent+=char;

        index++;

        let delay=30+Math.random()*20;

        if(char===","||char===".")
            delay=180;

        if(char==="!"||char==="?"||char==="💖")
            delay=250;

        if(char==="\n")
            delay=300;

        typingTimeout=setTimeout(type,delay);

    }

    // Mulai mengetik nama setelah animasi judul selesai
    typingTimeout=setTimeout(typeIntro,200);

}

/* =========================
   GIFT & INFINITE CONFETTI
========================= */

const giftCanvas=document.getElementById("giftCanvas");
const giftCtx=giftCanvas.getContext("2d");

function resizeGiftCanvas(){
    giftCanvas.width=innerWidth;
    giftCanvas.height=innerHeight;
}
resizeGiftCanvas();
window.addEventListener("resize",resizeGiftCanvas);

const giftColors=[
"#ff4d6d","#ff006e","#ffbe0b","#ffd166",
"#3a86ff","#00c2ff","#06d6a0","#43aa8b",
"#8338ec","#fb5607"
];

const giftParticles=[];
const giftEmojis=[];

function resetGiftEmojis(){

    giftEmojis.length=0;

    ["🍰","🎁","🎂","🎈","🎉","🎊","🎆","🧁","💖","🌼","🌸"].forEach(e=>{
        for(let i=0;i<3;i++)giftEmojis.push(e);
    });

    giftEmojis.sort(()=>Math.random()-0.5);

}

resetGiftEmojis();

let giftPlaying=false;
let animationId=null;
let frame=0;

document.getElementById("giftBox").addEventListener("click",toggleGift);

function toggleGift(){

    const gift=document.getElementById("giftBox");

    if(giftPlaying){

        giftPlaying=false;

        cancelAnimationFrame(animationId);

        giftParticles.length=0;
        giftCtx.clearRect(0,0,giftCanvas.width,giftCanvas.height);

        resetGiftEmojis();

        gift.classList.remove("open");

        return;

    }

    gift.classList.remove("open");
    void gift.offsetWidth;
    gift.classList.add("open");

    giftParticles.length=0;
    resetGiftEmojis();

    frame=0;
    giftPlaying=true;

    animationId=requestAnimationFrame(loopGift);

}

function spawnConfetti(){

    const rect=document.getElementById("giftBox").getBoundingClientRect();

    const ox=rect.left+rect.width/2;
    const oy=rect.top+rect.height*.35;

    const angle=-Math.PI/2+(Math.random()-0.5)*0.55;

    giftParticles.push({

        type:"c",

        x:ox,
        y:oy,

        vx:Math.cos(angle)*(12+Math.random()*3),
        vy:Math.sin(angle)*(12+Math.random()*3),

        g:.16,

        r:Math.random()*Math.PI*2,
        vr:(Math.random()-.5)*.35,

        color:giftColors[Math.random()*giftColors.length|0]

    });

}

function spawnEmoji(){

    if(!giftEmojis.length){
        resetGiftEmojis();
    }

    const rect=document.getElementById("giftBox").getBoundingClientRect();

    const ox=rect.left+rect.width/2;
    const oy=rect.top+rect.height*.55;

    const angle=-Math.PI/2+(Math.random()-0.5)*0.5;

    giftParticles.push({

        type:"e",

        emoji:giftEmojis.shift(),

        x:ox,
        y:oy,

        vx:Math.cos(angle)*(13+Math.random()*4),
        vy:Math.sin(angle)*(13+Math.random()*4),

        g:.15,

        size:20+Math.random()*8,

        r:Math.random()*Math.PI*2,
        vr:(Math.random()-.5)*.15

    });

}

function drawGift(){

    giftCtx.clearRect(0,0,giftCanvas.width,giftCanvas.height);

    for(const p of giftParticles){

        p.vy+=p.g;

        p.x+=p.vx;
        p.y+=p.vy;

        p.r+=p.vr;

        giftCtx.save();

        giftCtx.translate(p.x,p.y);
        giftCtx.rotate(p.r);

        if(p.type==="c"){

            giftCtx.fillStyle=p.color;
            giftCtx.fillRect(-2,-5,4,10);

        }else{

            giftCtx.font=p.size+"px serif";
            giftCtx.textAlign="center";
            giftCtx.textBaseline="middle";
            giftCtx.fillText(p.emoji,0,0);

        }

        giftCtx.restore();

    }

    for(let i=giftParticles.length-1;i>=0;i--){

        if(giftParticles[i].y>giftCanvas.height+80){

            giftParticles.splice(i,1);

        }

    }

}

function loopGift(){

    if(!giftPlaying)return;

    for(let i=0;i<10;i++){
        spawnConfetti();
    }

    if(frame%9===0){
        spawnEmoji();
    }

    frame++;

    drawGift();

    animationId=requestAnimationFrame(loopGift);

}