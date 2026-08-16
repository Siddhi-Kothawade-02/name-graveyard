// ==========================================
// FIREBASE IMPORTS
// ==========================================

import { initializeApp }
    from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
}
    from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ==========================================
// YOUR FIREBASE CONFIGURATION
// ==========================================

// PASTE YOUR FIREBASE CONFIG HERE

const firebaseConfig = {

    apiKey: "AIzaSyChYCGIxJXBriDjHhTFA1klTEpt_ksC8sM",

    authDomain:
        "name-graveyard.firebaseapp.com",

    projectId:
        "name-graveyard",

    storageBucket:
        "name-graveyard.firebasestorage.app",

    messagingSenderId:
        "373414008055",

    appId:
        "1:373414008055:web:e512f38c6bedbbe53b2ff2"

};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


// ==========================================
// HORROR INTRO
// ==========================================

const enterBtn =
    document.getElementById("enterBtn");

const introScreen =
    document.getElementById("introScreen");

const mainWebsite =
    document.getElementById("mainWebsite");

const horrorSound =
    document.getElementById("horrorSound");


enterBtn.addEventListener("click", () => {

    // Start horror sound

    horrorSound.currentTime = 0;

    horrorSound.play().catch(() => {

        console.log(
            "Audio could not start."
        );

    });


    // Screen shake

    document.body.classList.add("shake");


    // Fade intro

    introScreen.style.opacity = "0";


    setTimeout(() => {

        introScreen.style.visibility =
            "hidden";

        introScreen.style.display =
            "none";

        mainWebsite.classList.remove(
            "hidden"
        );

        document.body.classList.remove(
            "shake"
        );

    }, 700);

});


// ==========================================
// FIRESTORE COLLECTION
// ==========================================

const namesCollection =
    collection(db, "funnyNames");


// ==========================================
// TEST FIRESTORE CONNECTION
// ==========================================

console.log(
    "🔥 Firebase connected successfully!"
);

console.log(
    "☁️ Firestore is ready!"
);
// ==========================================
// NAME SUBMISSION
// ==========================================

const nameForm =
    document.getElementById("nameForm");

const personNameInput =
    document.getElementById("personName");

const funnyNameInput =
    document.getElementById("funnyName");

const formMessage =
    document.getElementById("formMessage");


nameForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const personName =
        personNameInput.value.trim();

    const funnyName =
        funnyNameInput.value.trim();


    // Basic validation

    if (!personName || !funnyName) {

        formMessage.textContent =
            "👻 Please fill both fields!";

        return;

    }


    // Button state

    const buryBtn =
        document.getElementById("buryBtn");

    buryBtn.disabled = true;

    buryBtn.textContent =
        "⚰️ BURYING...";


    try {

        // Add name to Firestore

        await addDoc(
            namesCollection,
            {
                personName: personName,
                funnyName: funnyName,
                createdAt:
                    serverTimestamp()
            }
        );


        // Success

        formMessage.textContent =
            "💀 NAME SUCCESSFULLY BURIED! 😂";


        formMessage.style.color =
            "#c45bd8";


        // Clear inputs

        nameForm.reset();


    } catch (error) {

        console.error(
            "Error adding name:",
            error
        );


        formMessage.textContent =
            "👻 Something went wrong. Try again.";


        formMessage.style.color =
            "#ff6b6b";


    }


    buryBtn.disabled = false;

    buryBtn.textContent =
        "🪦 BURY THIS NAME";

});
// ==========================================
// DISPLAY NAMES FROM FIRESTORE
// ==========================================

const namesContainer =
    document.getElementById("namesContainer");


const namesQuery = query(
    namesCollection,
    orderBy("createdAt", "desc")
);


onSnapshot(namesQuery, (snapshot) => {

    namesContainer.innerHTML = "";


    if (snapshot.empty) {

        namesContainer.innerHTML = `
            <div class="loading">
                🪦 No names have been buried yet...
                <br>
                Be the first one! 😂
            </div>
        `;

        return;
    }


    snapshot.forEach((doc) => {

        const data = doc.data();


        const card =
            document.createElement("div");

        card.className = "name-card";


        card.innerHTML = `

            <div class="real-name">
                👤 ${escapeHTML(data.personName)}
            </div>

            <div class="funny-name">
                ${escapeHTML(data.funnyName)}
            </div>

            <div class="name-date">
                💀 Permanently buried
            </div>

        `;


        namesContainer.appendChild(card);

    });

});
// ==========================================
// SAFE TEXT DISPLAY
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}
// ==========================================
// FUNNY NAME CHARACTER COUNTER
// ==========================================

const funnyCount =
    document.getElementById("funnyCount");

funnyNameInput.addEventListener("input", () => {

    funnyCount.textContent =
        `${funnyNameInput.value.length}/50`;

});