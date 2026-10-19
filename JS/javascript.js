
const countdownScreen = document.getElementById("countdown-screen");
const countdown = document.getElementById("countdown");

const passcodeScreen = document.getElementById("passcodeScreen");
const passcodeForm = document.getElementById("passcodeForm");
const passcodeInput = document.getElementById("passcodeInput");
const passcodeError = document.getElementById("passcodeError");

// Test deadline: October 17, 2026 at 8:22 PM Egypt time
// For the real deadline, change this to:
// new Date("2026-10-20T00:00:00+03:00").getTime()
const unlockTime = new Date("2026-10-10T00:00:00+03:00").getTime();

const correctPasscode = "20/10/2025";

let countdownInterval = null;

function showPasscodeScreen() {
    countdownScreen.classList.add("hidden");
    passcodeScreen.classList.remove("hidden");
    document.body.classList.add("locked");
}

function updateCountdown() {
    const remaining = unlockTime - Date.now();

    if (remaining <= 0) {
        clearInterval(countdownInterval);
        showPasscodeScreen();
        return;
    }

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    countdown.textContent =
        `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
}

// Initial screen setup
document.body.classList.add("locked");
passcodeScreen.classList.add("hidden");

if (Date.now() >= unlockTime) {
    showPasscodeScreen();
} else {
    countdownScreen.classList.remove("hidden");
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Passcode verification
passcodeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (passcodeInput.value.trim() === correctPasscode) {
        passcodeScreen.classList.add("hidden");
        document.body.classList.remove("locked");
        passcodeError.textContent = "";
        passcodeInput.value = "";
    } else {
        passcodeError.textContent =
            "أكبد بتهزري!! اكتبي تاريخ اليوم اللي اتكلمنا فيه dd/mm/yyyy";

        passcodeInput.value = "";
        passcodeInput.focus();
    }
});

// Envelope interaction
const envelope = document.getElementById("envelope");

if (envelope) {
    envelope.addEventListener("click", () => {
        envelope.classList.toggle("open");
    });
}

// Music player
const song = document.getElementById("our-song");
const musicBtn = document.getElementById("music-btn");

if (song && musicBtn) {
    musicBtn.addEventListener("click", async () => {
        if (song.paused) {
            try {
                await song.play();
                musicBtn.textContent = "⏸ Pause Our Song";
            } catch (error) {
                console.error("Unable to play the song:", error);
            }
        } else {
            song.pause();
            musicBtn.textContent = "▶ Play Our Song";
        }
    });

    song.addEventListener("ended", () => {
        musicBtn.textContent = "▶ Play Our Song";
    });
}

// Relationship counter
const startDate = new Date(2025, 9, 20, 0, 0, 0);

function updateCounter() {
    const now = new Date();

    if (now < startDate) {
        return;
    }

    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();

    let hours = now.getHours() - startDate.getHours();
    let minutes = now.getMinutes() - startDate.getMinutes();
    let seconds = now.getSeconds() - startDate.getSeconds();

    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }

    if (minutes < 0) {
        minutes += 60;
        hours--;
    }

    if (hours < 0) {
        hours += 24;
        days--;
    }

    if (days < 0) {
        months--;

        const previousMonthDays = new Date(
            now.getFullYear(),
            now.getMonth(),
            0
        ).getDate();

        days += previousMonthDays;
    }

    if (months < 0) {
        months += 12;
        years--;
    }

    document.getElementById("years").textContent = years;
    document.getElementById("months").textContent = months;
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}

updateCounter();
setInterval(updateCounter, 1000);

// Open memory images
const memoryImages = document.querySelectorAll(
    "#memories .memory-card img"
);

memoryImages.forEach((img) => {
    img.addEventListener("click", () => {
        const lightbox = document.createElement("div");
        lightbox.className = "image-lightbox";

        const largeImage = document.createElement("img");
        largeImage.src = img.src;
        largeImage.alt = img.alt || "Memory photo";

        lightbox.appendChild(largeImage);
        document.body.appendChild(lightbox);

        function closeLightbox() {
            lightbox.remove();
            document.removeEventListener("keydown", handleEscape);
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                closeLightbox();
            }
        }

        lightbox.addEventListener("click", closeLightbox);
        document.addEventListener("keydown", handleEscape);
    });
});

const galleryImages = [
    "IMGS/photo1.jpeg",
    "IMGS/photo2.jpeg",
    "IMGS/photo3.jpeg",
    "IMGS/photo4.jpeg",
    "IMGS/photo5.jpeg",
    "IMGS/photo6.jpeg",
    "IMGS/photo7.jpeg",
    "IMGS/photo8.jpeg",
    "IMGS/photo9.jpeg",
    "IMGS/photo10.jpeg",
    "IMGS/photo11.jpeg",
    "IMGS/photo12.jpeg"
];

let currentImage = 0;
let isChanging = false;

const galleryImage = document.getElementById("galleryImage");

function changeImage(direction) {
    if (isChanging) return;

    isChanging = true;
    galleryImage.classList.add("changing");

    setTimeout(() => {
        currentImage =
            (currentImage + direction + galleryImages.length) %
            galleryImages.length;

        galleryImage.onload = () => {
            galleryImage.classList.remove("changing");
            isChanging = false;
            galleryImage.onload = null;
        };

        galleryImage.onerror = () => {
            galleryImage.classList.remove("changing");
            isChanging = false;
            galleryImage.onerror = null;
            console.error("Image not found:", galleryImages[currentImage]);
        };

        galleryImage.src = galleryImages[currentImage];
    }, 250);
}

document.getElementById("nextImage").addEventListener("click", () => {
    changeImage(1);
});

document.getElementById("prevImage").addEventListener("click", () => {
    changeImage(-1);
});