const dialogueTree = {
    start: {
        text: "HIIII!!! Welcome! I'm Sugar. I like breakcore, hyperpop, alt fashion and Nintendo games!",
        typingImage: "/assets/art/Sugar-(Jul-3-2026).png", 
        gifImage: "/assets/art/Sugar-2-(Jul-3-2026).gif",    
        choices: [
            { text: "Breakcore?", nextNode: "breakcore" },
            { text: "Alt fashion?", nextNode: "altFashion" },
            { text: "Nintendo games?", nextNode: "nintendoGames" },
        ]
    },
    breakcore: {
        text: "Uhhhh, I don't really know how to explain it... I think the best way to put it is to give a 12-year-old unlimited access to Bandcamp LOL! That's basically Breakcore.",
        typingImage: "sugar_angry.png",
        gifImage: "/assets/art/Sugar-(Jul-3-2026).gif",
        choices: [
            { text: "Oh, ok!", nextNode: "start" }
        ]
    }, 
    altFashion: {
        text: "You don't know!? Or-wait-maybe you do know. Oops. Well, either way, yeah! Decora, Manba, anything colorful, I wear it!",
        typingImage: "sugar_angry.png",
        gifImage: "/assets/art/Sugar-(Jul-3-2026).gif",
        choices: [
            { text: "Oh, ok!", nextNode: "start" }
        ]
    },
    nintendoGames: {
        text: "Yeah! Like, Splatoon and Pokemon 'n shit. My favorite game right now is probz Splat 3.",
        typingImage: "sugar_hyped.png",
        gifImage: "/assets/art/Sugar-(Jul-3-2026).gif",
        choices: [
            { text: "Nice!", nextNode: "start" }
        ]
    },
};

let currentTypingTimer = null;

function typeWriterEffect(text, index, element, callback) {
    if (index < text.length) {
        element.innerHTML += text.charAt(index);
        currentTypingTimer = setTimeout(() => {
            typeWriterEffect(text, index + 1, element, callback);
        }, 25);
    } else if (callback) {
        callback();
    }
}

function loadNode(nodeKey) {
    const node = dialogueTree[nodeKey];
    const textElement = document.getElementById("dialogue-box");
    const optionsElement = document.getElementById("options-box");
    const avatarImg = document.getElementById("sugar-avatar");

    clearTimeout(currentTypingTimer);
    textElement.innerHTML = "";
    optionsElement.innerHTML = "";

    if (avatarImg) avatarImg.src = node.typingImage;

    typeWriterEffect(node.text, 0, textElement, () => {
        if (avatarImg) avatarImg.src = node.gifImage;

        node.choices.forEach(choice => {
            const button = document.createElement("button");
            button.className = "dialogue-choice";
            button.innerText = `► ${choice.text}`;
            button.onclick = () => loadNode(choice.nextNode);
            optionsElement.appendChild(button);
        });
    });
}

// Function to update the NSO-style stat blocks on the page
function updateMeters(stats) {
    const defaultStats = { stress: 20, affection: 50, darkness: 10 };
    const current = stats || defaultStats;

    // Direct element hook updates
    const stressMeter = document.getElementById('meter-stress');
    const affectionMeter = document.getElementById('meter-affection');
    const darknessMeter = document.getElementById('meter-darkness');

    if (stressMeter) {
        stressMeter.style.width = `${current.stress}%`;
        document.getElementById('txt-stress').innerText = `${current.stress}%`;
    }
    if (affectionMeter) {
        affectionMeter.style.width = `${current.affection}%`;
        document.getElementById('txt-affection').innerText = `${current.affection}%`;
    }
    if (darknessMeter) {
        darknessMeter.style.width = `${current.darkness}%`;
        document.getElementById('txt-darkness').innerText = `${current.darkness}%`;
    }
}

// THE UNIFIED FETCH MATRIX: Gets your stats AND your gorgeous blog layouts
async function loadSiteData() {
    try {
        // Fetch from raw github file so it updates immediately when you use your dashboard panel
        const res = await fetch('https://raw.githubusercontent.com/SugarHyou/sugaroverdosed/main/output/journal.json');
        
        if (!res.ok) throw new Error("Could not download database core.");
        
        const data = await res.json();
        
        // 1. Update the NSO Sliders
        updateMeters(data.currentStats);

        // 2. Build the Beautiful Blog Post Display
        const posts = data.posts || [];
        const container = document.getElementById('latest-post-content');

        if (container) {
            if (posts.length > 0) {
                const latest = posts[0]; // Gets the most recent entry from the object's post array
                container.innerHTML = `
                    <article class="post-card" style="width: 100%; margin: 0;">
                        <div class="post-header" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <img src="/assets/art/Sugar-3-(Jul-4-2026).png" style="width: 40px; height: 40px; border: 1px solid red;" alt="PFP">
                            <div class="post-meta" style="display: flex; flex-direction: column;">
                                <span class="username" style="font-weight: 900; color: var(--hot-pink);">Sugar</span>
                                <span class="date" style="font-size: 0.8rem; color: dodgerblue; opacity: 0.8;">${latest.date}</span>
                            </div>
                        </div>
                        ${latest.title ? `<h3 class="post-title" style="margin: 5px 0;">${latest.title}</h3>` : ''}
                        <div class="post-content" style="font-size: 0.95rem; line-height: 1.3;">
                            <p style="margin: 0; white-space: pre-wrap;">${latest.content}</p>
                        </div>
                    </article>
                `;
            } else {
                container.innerHTML = `
                    <div style="text-align: center; color: hotpink; font-weight: bold; padding: 10px;">
                        STATUS: WAITING FOR FIRST BROADCAST...
                    </div>
                `;
            }
        }
    } catch (e) {
        console.error("Failed executing synchronization matrix:", e);
        const container = document.getElementById('latest-post-content');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; color: red; font-weight: bold; padding: 10px;">
                    ERROR SYNCING SYSTEM DATABASE CORE...
                </div>
            `;
        }
    }
}

// Combining window triggers into a single unified initialization loop
window.addEventListener('DOMContentLoaded', () => {
    loadNode('start');
    loadSiteData();
});