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

    avatarImg.src = node.typingImage;

    typeWriterEffect(node.text, 0, textElement, () => {
        avatarImg.src = node.gifImage;

        node.choices.forEach(choice => {
            const button = document.createElement("button");
            button.className = "dialogue-choice";
            button.innerText = `► ${choice.text}`;
            button.onclick = () => loadNode(choice.nextNode);
            optionsElement.appendChild(button);
        });
    });
}

window.onload = () => {
    loadNode('start');
};

async function fetchLatestPost() {
    try {
        // Fetches your journal file relative to your new site root
        const res = await fetch('/output/journal.json');
        if (!res.ok) throw new Error("No posts found yet!");
        
        const posts = await res.json();
        const latest = posts[0]; 
        const container = document.getElementById('latest-post-content');

        container.innerHTML = `
            <article class="post-card" style="width: 100%; margin: 0;">
                <div class="post-header" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <!-- Your new avatar path -->
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
    } catch (e) {
        console.error("Could not load latest post:", e);
        document.getElementById('latest-post-content').innerHTML = `
            <div style="text-align: center; color: hotpink; font-weight: bold; padding: 10px;">
                STATUS: WAITING FOR FIRST BROADCAST...
            </div>
        `;
    }
}

// Fire it off when the page loads
fetchLatestPost();

// Function to update the NSO-style stat blocks on the page
function updateMeters(stats) {
    const defaultStats = { stress: 20, affection: 50, darkness: 10 };
    const current = stats || defaultStats;

    // Direct element hook updates
    document.getElementById('meter-stress').style.width = `${current.stress}%`;
    document.getElementById('txt-stress').innerText = `${current.stress}%`;

    document.getElementById('meter-affection').style.width = `${current.affection}%`;
    document.getElementById('txt-affection').innerText = `${current.affection}%`;

    document.getElementById('meter-darkness').style.width = `${current.darkness}%`;
    document.getElementById('txt-darkness').innerText = `${current.darkness}%`;
}

// Example modified fetch logic to read your database file
async function loadSiteData() {
    try {
        const res = await fetch('https://raw.githubusercontent.com/SugarHyou/sugaroverdosed/main/output/journal.json');
        if (res.ok) {
            const data = await res.json();
            
            // 1. Handle Blog content array
            const posts = data.posts || [];
            const blogFeed = document.getElementById("latest-post-content");
            if (blogFeed && posts.length > 0) {
                blogFeed.innerHTML = `<strong>[${posts[0].date}] ${posts[0].title}</strong><br>${posts[0].content}`;
            }

            // 2. Handle System Stats update
            updateMeters(data.currentStats);
        }
    } catch (e) {
        console.error("Failed executing synchronization matrix.", e);
    }
}

// Trigger data injection grid on boot
window.addEventListener('DOMContentLoaded', () => {
    loadSiteData();
});