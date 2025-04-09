// currentScene should come from main.js
import { delay } from './util.js';

function moveElement(move, before) {
    const elToMove = document.getElementById(move);
    const elBefore = document.getElementById(before);
    elBefore.parentNode.insertBefore(elToMove, elBefore);
}

document.body.addEventListener("keydown", (e) => {
    if (e.key === 'ArrowRight') {
        flip(currentSceneIndex+1, "right")
    }

    if (e.key === 'ArrowLeft') {
        flip(currentSceneIndex-1, "left")
    }

    if (e.ctrlKey){
        flip(0, "left")
    }
})

// window.onload = moveElement(1,0);
console.log(scenes)
async function flip(newSceneIndex, direction = "right"){

    let newScene = scenes[newSceneIndex];
    let rightScene, leftScene;
    switch (direction){
        case "right":{
            document.getElementById(newSceneIndex).style.float = "right";
            document.getElementById(currentSceneIndex).style.float = "left";
            // moveElement(currentSceneIndex, newSceneIndex)
            
            document.getElementById(currentSceneIndex).style.width = "100vw"
            document.getElementById(newSceneIndex).style.width = "0vw"     
            rightScene = document.getElementById(newSceneIndex);
            leftScene = document.getElementById(currentSceneIndex);
            break
        }
        case "left":{
            document.getElementById(newSceneIndex).style.float = "left";
            document.getElementById(currentSceneIndex).style.float = "right";
            // moveElement(newSceneIndex, currentSceneIndex)
            
            document.getElementById(currentSceneIndex).style.width = "0vw"
            document.getElementById(newSceneIndex).style.width = "100vw"     
            rightScene = document.getElementById(newSceneIndex);
            leftScene = document.getElementById(currentSceneIndex);
            break
        }
        default: {
            alert(direction)
        }
    }

    let currentSize = 100;

    console.log(rightScene, leftScene)

    while (currentSize > 0){
        currentSize -= 1;

        leftScene.style.width = currentSize+"vw"
        rightScene.style.width = (100 - currentSize)+"vw"
        await delay(1)
    }
    currentSceneIndex = newSceneIndex;
}