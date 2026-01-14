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


/* ========== Gate (mot de passe) ========== */
(function setupGate() {
    // ⚠️ Met ton mot de passe ICI :
    const PASSWORD = "DIA,dia.1";   // ← remplace par le tien

    const gate = document.getElementById("gate");
    const form = document.getElementById("gateForm");
    const input = document.getElementById("gateInput");
    const error = document.getElementById("gateError");

    if (!gate || !form || !input || !error || !music) return;

    // Si déjà déverrouillé cette session, saute la gate
    if (sessionStorage.getItem("unlocked") === "1") {
        document.body.classList.add("unlocked");
        // On ne lance pas auto la musique ici (certaines politiques d'autoplay la bloqueraient)
    } else {
        // Focus auto sur le champ à l'ouverture
        setTimeout(() => input.focus(), 200);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const val = (input.value || "").trim();

        if (!val) {
            error.textContent = "Entre le mot de passe.";
            input.focus();
            return;
        }

        if (val === PASSWORD) {
            // Déverrouille
            document.body.classList.add("unlocked");
            sessionStorage.setItem("unlocked", "1");
            error.textContent = "";

            // Lance la musique immédiatement (déclenchement via geste utilisateur)
            try { await music.play(); } catch { }

            // Nettoyage du champ (au cas où)
            input.value = "";
        } else {
            error.textContent = "Mot de passe incorrect.";
            input.select();
        }
    });
})();



/* === Contenus === */
const introTexts = [
    "Poussin, j’ai du mal à dormir ces temps-ci. Je te jure j'essaie 😅",
    "Au lieu de regarder passivement le plafond,",
    "j’ai décidé de faire l’une des choses que je sais bien faire : coder.",
    "Juste pour te rappeler à quel point je t’aime, mon amour,",
    "même si je suis compliquée parfois 🤍"
];

const finalTexts = [
    "à la base, je ne crois pas aux contes de fées…",
    "mais avec toi, tout semble possible.",
    "tu me manques aussi, on doit se voir ce vendredi !",
    "je pense à toi tout le temps.",
    "bisous làbas  😘",
    "Je t’aime 🤍"
];

const videoCaption = "L'homme qui va faire le ménage, la cuisine, la vaiselle... 😂";

const images = Array.from({ length: 12 }, (_, i) => `christopher/image${i + 1}.jpeg`);
const imageCaptions = [
    "tu fais genre t'aimes pas les photos — moi j'aime etre avec toi 📸",
    "mate le charisme 😂 — Je souris en te revoyant mon poussin.",
    "j'aime ta tendresse envers moi 🤍 ",
    "Je n’oublie rien.",
    "Merci d’exister.",
    "Tes yeux, mon ciel.",
    "Chaque instant compte.",
    "Tu es mon évidence.",
    "Mon âme te reconnaît.",
    "Ensemble, toujours.",
    "Tout simplement toi. Moi meme je vais te demander en mariage un jour.",
    "Je t’aime, infiniment."
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
            hide(text);
            endingLine.textContent = persistentEnding;
            endingLine.classList.add("show");

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


    // Afficher IMMÉDIATEMENT la phrase finale
    endingLine.textContent = persistentEnding;
    endingLine.style.display = "block";
    endingLine.style.opacity = "1";
    endingLine.style.visibility = "visible";
    endingLine.classList.add("show");

    // Afficher le secret tapé après 1.2s
    setTimeout(() => {
        typeSecret(secretMessage, 28);
        secret.style.display = "block";
        secret.style.opacity = "1";
        secret.style.visibility = "visible";
        secret.classList.add("show");
    }, 1200);

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


