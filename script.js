const dialogueTree = {
    start: {
        text: "HIIII!!! Welcome to my desktop space! Did you remember to play some Amen Breaks before entering? >:3CCC",
        typingImage: "/assets/art/Andy-(Jul-3-2026).png", 
        gifImage: "/assets/art/Sugar-(Jul-3-2026).gif",    
        choices: [
            { text: "Yes, loud and glitchy!", nextNode: "happyResponse" },
            { text: "No, it's completely quiet...", nextNode: "madResponse" }
        ]
    },
    happyResponse: {
        text: "YAAAS! Absolute optimization! Let's overload the network with infinite colors together!!! ✨💖⚡",
        typingImage: "sugar_hyped.png",
        gifImage: "/assets/art/Sugar-(Jul-3-2026).gif",
        choices: [
            { text: "Keep blasting tracks!", nextNode: "start" }
        ]
    },
    madResponse: {
        text: "CRITICAL SYSTEM ERROR!!! How dare you browse my neon reality in silence?! Go turn on some Sewerslvt right now! 💢⚡🌀",
        typingImage: "sugar_angry.png",
        gifImage: "/assets/art/Sugar-(Jul-3-2026).gif",
        choices: [
            { text: "Sorry! I'm putting it on now!", nextNode: "start" }
        ]
    }
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