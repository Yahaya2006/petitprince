/* === Sélecteurs === */
const text = document.getElementById("text");
const photo = document.getElementById("photo");
const video = document.getElementById("video");
const caption = document.getElementById("caption");
const btn = document.getElementById("nextBtn");
const secret = document.getElementById("secret");
const music = document.getElementById("bgMusic");
const introBox = document.getElementById("introStars");
const bouquet = document.getElementById("bouquet");
const twinkles = document.getElementById("twinkles");
const embersCv = document.getElementById("embersCanvas");
const frame = document.getElementById("mediaFrame");
const endingLine = document.getElementById("endingLine");
const persistentEnding = "Toujours, je te choisis. 🤍";



/* === Contenus === */
const introTexts = [
    "Poussin, j’ai du mal à dormir ces temps-ci.",
    "Au lieu de regarder passivement le plafond,",
    "j’ai décidé de faire l’une des choses que je sais bien faire : coder.",
    "Juste pour te rappeler à quel point je t’aime, mon amour,",
    "même si je suis compliquée parfois 🤍"
];

const finalTexts = [
    "Si l’amour avait une adresse…",
    "elle commencerait par ton prénom.",
    "Ce site n’est pas un cadeau.",
    "C’est un battement de mon cœur.",
    "Chaque jour à tes côtés est une évidence.",
    "Je t’aime 🤍"
];

const videoCaption = "Ferme les yeux, écoute… Je suis là, avec toi 🤍";

const images = Array.from({ length: 12 }, (_, i) => `christopher/image${i + 1}.jpeg`);
const imageCaptions = [
    "Souvenir 1/12 — Mon cœur va vers toi.",
    "Souvenir 2/12 — Je souris en te revoyant.",
    "Souvenir 3/12 — Tu es ma douceur.",
    "Souvenir 4/12 — Je n’oublie rien.",
    "Souvenir 5/12 — Merci d’exister.",
    "Souvenir 6/12 — Tes yeux, mon ciel.",
    "Souvenir 7/12 — Chaque instant compte.",
    "Souvenir 8/12 — Tu es mon évidence.",
    "Souvenir 9/12 — Mon âme te reconnaît.",
    "Souvenir 10/12 — Ensemble, toujours.",
    "Souvenir 11/12 — Tout simplement toi.",
    "Souvenir 12/12 — Je t’aime, infiniment."
];

const secretMessage =
    "Et si je devais refaire ce choix mille fois…\nje te choisirais mille fois toi 🤍";

/* === États === */
let phase = "intro"; // intro → video → images → final → bouquet
let step = 0;
let introTimer = null;

/* === Helpers === */
function show(el) { el.classList.add("show"); }
function hide(el) { el.classList.remove("show"); }

function showText(content, { fantasy = false } = {}) {
    hide(text);
    setTimeout(() => {
        text.textContent = content;
        if (fantasy) {
            text.classList.add("fantasy");
        } else {
            text.classList.remove("fantasy");
        }
        show(text);
    }, 200);
}

async function tryPlayMusic() { try { await music.play(); } catch { } }

/* ==== Intro: étoiles visibles, tous côtés ==== */
function startIntroStars() {
    stopIntroStars();
    introTimer = setInterval(() => {
        const s = document.createElement("span");
        s.className = "tiny-star";
        // formes plus visibles
        const shapes = ["✦", "✧", "✩", "•", "·", "⁂"];
        s.textContent = shapes[(Math.random() * shapes.length) | 0];

        // taille plus grande
        const size = 12 + Math.random() * 14; // 12–26px
        s.style.fontSize = size + "px";

        // direction aléatoire
        const dirs = ["up", "leftUp", "rightUp", "diag"];
        const dir = dirs[(Math.random() * dirs.length) | 0];

        // position de départ selon la direction
        if (dir === "up") {
            s.style.left = (Math.random() * 100) + "%";
            s.style.bottom = "-8%";
            s.style.animationName = "riseUp";
        } else if (dir === "leftUp") {
            s.style.left = "-6%";
            s.style.top = (60 + Math.random() * 40) + "%"; // moitié basse
            s.style.animationName = "flyRightUp";
        } else if (dir === "rightUp") {
            s.style.left = "106%";
            s.style.top = (60 + Math.random() * 40) + "%";
            s.style.animationName = "flyLeftUp";
        } else {
            // diag depuis bas côtés
            s.style.left = (Math.random() < 0.5 ? "-4%" : "104%");
            s.style.bottom = "-6%";
            s.style.animationName = "flyDiagUp";
        }

        // durée / délai pour variété
        const dur = 5 + Math.random() * 5;   // 5–10s
        const delay = Math.random() * 1.2;    // 0–1.2s
        s.style.animationDuration = dur + "s";
        s.style.animationDelay = delay + "s";
        s.style.animationTimingFunction = "linear";
        s.style.animationFillMode = "forwards";

        introBox.appendChild(s);
        // nettoyage
        setTimeout(() => s.remove(), (dur + delay + 0.3) * 1000);
    }, 220); // cadence un peu plus dense
}
function stopIntroStars() {
    if (introTimer) { clearInterval(introTimer); introTimer = null; }
    introBox.innerHTML = "";
}

/* ==== Twinkles discrets (bouquet) ==== */
function spawnTwinkles(count = 42) {
    twinkles.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const t = document.createElement("span");
        t.className = "twinkle";
        t.textContent = Math.random() < 0.6 ? "✧" : "✩";
        t.style.left = Math.random() * 100 + "vw";
        t.style.top = Math.random() * 100 + "vh";
        t.style.animationDelay = (Math.random() * 2.2) + "s";
        twinkles.appendChild(t);
    }
}

/* ==== Embers (brandons/poussières) ==== */
function startEmbers(durationMs = 16000) {
    const ctx = embersCv.getContext("2d");
    let W, H, running = true;

    function resize() {
        W = embersCv.width = window.innerWidth;
        H = embersCv.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const count = Math.round((W * H) / 22000) + 40;
    const particles = Array.from({ length: count }).map(() => makeParticle());

    function makeParticle() {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.08 + Math.random() * 0.22;
        const size = 0.8 + Math.random() * 1.8;
        const x = Math.random() * W;
        const y = Math.random() * H;
        const life = 0.5 + Math.random() * 0.5;
        const colors = ["#cfc7b0", "#b3ab95", "#8d8778", "#ffffff"];
        const color = colors[(Math.random() * colors.length) | 0];
        return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed * 0.6 - 0.02, size, life, alpha: 0, color };
    }

    function loop() {
        if (!running) return;
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(0, 0, W, H);

        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < -10) p.x = W + 10;
            if (p.x > W + 10) p.x = -10;
            if (p.y < -10) p.y = H + 10;
            if (p.y > H + 10) p.y = -10;

            p.alpha = Math.min(0.9, (p.alpha + 0.005));

            ctx.save();
            ctx.globalAlpha = p.alpha * p.life * 0.9;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            if (Math.random() < 0.03) {
                ctx.globalAlpha *= 0.35;
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - p.vx * 6, p.y - p.vy * 6);
                ctx.stroke();
            }
            ctx.restore();

            p.life *= 0.999;
            if (p.life < 0.35 && Math.random() < 0.003) {
                Object.assign(p, makeParticle());
            }
        }
        requestAnimationFrame(loop);
    }
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, W, H);
    requestAnimationFrame(loop);

    setTimeout(() => { running = false; }, durationMs);
}

/* ==== Secret tapé ==== */
function typeSecret(textToType, speed = 28) {
    secret.textContent = "";
    secret.setAttribute("aria-hidden", "false");
    show(secret);
    let i = 0;
    const timer = setInterval(() => {
        secret.textContent += textToType[i] || "";
        i++;
        if (i >= textToType.length) clearInterval(timer);
    }, speed);
}

/* ===== Bouton principal (séquence) ===== */
btn.addEventListener("click", async () => {
    await tryPlayMusic();

    if (phase === "intro") {
        if (step < introTexts.length) {
            showText(introTexts[step++]);
        } else {
            // Passage à la vidéo
            phase = "video";
            // ne plus arrêter les intro stars => retirer stopIntroStars()
            hide(text);
            text.classList.remove("fantasy"); // pas de shimmer pendant la vidéo
            show(frame);
            show(video);
            caption.textContent = videoCaption;
            step = 0;
        }
        return;
    }

    if (phase === "video") {
        hide(video);
        caption.textContent = "";
        phase = "images";
        step = 0;
        show(photo);
        caption.textContent = imageCaptions[step];
        photo.src = images[step];
        step++;
        return;
    }

    if (phase === "images") {
        if (step < images.length) {
            photo.src = images[step];
            caption.textContent = imageCaptions[step];
            step++;
        } else {
            // fin des images → textes finaux
            hide(photo);
            hide(frame);
            caption.textContent = "";
            phase = "final";
            step = 0;
            // le final doit être plus “fantastique”
            text.classList.add("fantasy");
        }
        return;
    }

    if (phase === "final") {
        if (step < finalTexts.length) {
            showText(finalTexts[step++], { fantasy: true });
        } else {
            // Afficher la phrase finale persistante
            const endingEl = document.getElementById("endingLine");
            endingEl.textContent = "Et même dans le silence, mon cœur reste auprès du tien. 🤍";
            endingEl.classList.add("show");

            btn.style.display = "none";
            startMelancholicBouquet();
            phase = "bouquet";
        }
    }
});

/* ===== Horloge ===== */
const clock = document.getElementById("clock");
function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    clock.textContent = `Il est ${hh}:${mm}… et je pense à toi.`;
}
updateClock();
setInterval(updateClock, 60000);

/* ===== Lancement ===== */
showText(introTexts[0]);
step = 1;
startIntroStars();
show(clock); // afficher l'horloge dès le départ
images.forEach(src => { const img = new Image(); img.src = src; });


/* ===== Bouquet mélancolique & fantastique (sans feu d’artifice) ===== */
function startMelancholicBouquet() {
    bouquet.classList.add("show");
    spawnTwinkles(42);
    startEmbers(18000);
    setTimeout(() => typeSecret(secretMessage, 28), 1200);

    // 🔽 AJOUTE CES 2 LIGNES :
    endingLine.textContent = "Et même dans le silence, mon cœur reste auprès du tien. 🤍";
    endingLine.classList.add("show");

    // respiration lente du fond (nostalgie)
    const stars = document.querySelector(".stars");
    stars.style.transition = "transform 18s ease-in-out";
    stars.style.transform = "scale(1.05)";
    setTimeout(() => { stars.style.transform = "scale(1)"; }, 18000);
}


/* Adapter le ratio de la photo selon orientation (mobile) */
function adjustPhotoRatio() {
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    const el = document.querySelector(".photo");
    if (!el) return;
    el.style.aspectRatio = isLandscape ? "4 / 3" : "3 / 4";
}
adjustPhotoRatio();
window.addEventListener("resize", adjustPhotoRatio);


