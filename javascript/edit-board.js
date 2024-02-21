// NOT FINISHED YET
async function editTask(taskId) {
    console.log(taskId);
    const task = boardTasks.find((task) => task.taskId === taskId);

    const dialog = document.getElementById("dialog");
    dialog.setAttribute("w3-include-html", "./edit-task.html");
    await includeHTML();
    dialog.showModal();
    setupCloseDialogMechanism();
    document.getElementById("title-task").value = task.title;
    document.getElementById("description-task").value = task.description;
    document.getElementById("date-date-task").value = task.date;
    document.getElementById("category").value = task.heading;
    
    // document.getElementById("subtask-display").value =
    displaySubtasksForEditing(task.taskId);
    setPrioritySelection(task.priority);
}
function setPrioritySelection(priority) {
    // Zuerst entfernen Sie alle vorhandenen Prioritätsklassen
    document.getElementById("Urgent").classList.remove("prioUrgent");
    document.getElementById("Medium").classList.remove("prioMedium");
    document.getElementById("Low").classList.remove("prioLow");

    // Setzen Sie die Standardbilder für alle Prioritäten zurück
    let lowImg = document.getElementById("low-img");
    let mediumImg = document.getElementById("medium-img");
    let urgentImg = document.getElementById("urgent-img");

    lowImg.src = "./img/low.png";
    mediumImg.src = "./img/medium-prio.png";
    urgentImg.src = "./img/urgent-red-arrows.png";

    // Aktualisieren Sie die Prioritätsklasse und das Bild basierend auf der ausgewählten Priorität
    const priorityElement = document.getElementById(priority);
    if (priorityElement) {
        priorityElement.classList.add(`prio${priority}`);
        switch (priority) {
            case "Urgent":
                urgentImg.src = "./img/urgent-white-arrows.png";
                break;
            case "Medium":
                mediumImg.src = "./img/medium.png";
                break;
            case "Low":
                lowImg.src = "./img/low-white-arrows.png";
                break;
        }
    }
}
function displaySubtasksForEditing(taskId) {
    const task = boardTasks.find(t => t.taskId === taskId);
    if (!task) {
        console.error("Task not found");
        return;
    }

    const subtaskDisplayElement = document.getElementById("subtask-display");
    subtaskDisplayElement.innerHTML = ""; // Bereinigen Sie das Element zuerst

    task.subtasks.forEach(subtask => {
        const subtaskHtml = `
            <span contenteditable="true" class="span-container" id="sub-span-${subtask.subtaskId}">
                <div class="subtask-preview" id="preview-${subtask.subtaskId}" onclick="toggleSubtaskFocus(${taskId}, ${subtask.subtaskId}, true)">
                    <div class="list-item" id="list-item-${subtask.subtaskId}"></div>
                    <p id="sub-content-${subtask.subtaskId}">${subtask.subtasksText}</p>
                </div>
                <div class="subtask-icon-container" id="icon-container-${subtask.subtaskId}">
                    <img src="./img/edit-contacts.png" alt="edit-icon" class="hover" onclick="toggleSubtaskFocus(${taskId}, ${subtask.subtaskId}, true)">
                    <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
                    <img src="./img/delete.png" alt="delete-icon" class="hover" onclick="deleteSubtaskFromEditing(${taskId}, ${subtask.subtaskId})">
                </div>
            </span>
        `;
        subtaskDisplayElement.innerHTML += subtaskHtml;
    });
}


// function displaySubtasksForEditing(taskId) {
//     const task = boardTasks.find((t) => t.taskId === taskId);
//     if (!task) {
//         console.error("Task not found");
//         return;
//     }

//     const subtaskDisplayElement = document.getElementById("subtask-display");
//     subtaskDisplayElement.innerHTML = ""; // Bereinigen Sie das Element zuerst

//     task.subtasks.forEach((subtask, index) => {
//         const subtaskHtml = `
//             <span contenteditable="true" class="span-container" id="sub-span-${index}">
//                 <div class="subtask-preview" id="preview-${index}" onclick="toggleSubtaskFocus(${taskId},${subtask.subtaskId}, true)">
//                     <div class="list-item" id="list-item-${index}"></div>
//                     <p id="sub-content-${index}">${subtask.subtasksText}</p>
//                 </div>
//                 <div class="subtask-icon-container" id="icon-container-${index}">
//                     <img src="./img/edit-contacts.png" alt="edit-icon" class="hover" onclick="toggleSubtaskFocus(${taskId},${subtask.subtaskId}, true)">
//                     <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
//                     <img src="./img/delete.png" alt="delete-icon" class="hover" onclick="deleteSubtaskFromEditing(${taskId}, ${subtask.subtaskId})">
//                 </div>
//             </span>
//         `;
//         subtaskDisplayElement.innerHTML += subtaskHtml;
//     });
// }
function updateSubtaskText(taskId, subtaskId, newText) {
    const task = boardTasks.find((t) => t.taskId === taskId);
    const subtask = task.subtasks.find((st) => st.subtaskId === subtaskId);
    subtask.subtasksText = newText;
    // Speichern Sie die aktualisierten boardTasks Daten
    // Zum Beispiel: setItem("boardTasks", JSON.stringify(boardTasks));
}

// function deleteSubtaskFromEditing(taskId, subtaskId) {
//     const taskIndex = boardTasks.findIndex((t) => t.taskId === taskId);
//     if (taskIndex > -1) {
//         const subtaskIndex = boardTasks[taskIndex].subtasks.findIndex((st) => st.subtaskId === subtaskId);
//         if (subtaskIndex > -1) {
//             boardTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
//             // Aktualisieren Sie die Anzeige der Subtasks
//             displaySubtasksForEditing(taskId);
//             // Speichern Sie die aktualisierten Daten
//             // Beispiel: setItem("boardTasks", JSON.stringify(boardTasks));
//         }
//     }
// }

function deleteSubtaskFromEditing(taskId, subtaskId) {
    const taskIndex = boardTasks.findIndex(t => t.taskId === taskId);
    if (taskIndex > -1) {
        const subtaskIndex = boardTasks[taskIndex].subtasks.findIndex(st => st.subtaskId === subtaskId);
        if (subtaskIndex > -1) {
            boardTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
            displaySubtasksForEditing(taskId); // Aktualisieren Sie die Anzeige der Subtasks
        }
    }
}

function initializeSubtaskEditing() {
    const subtaskInputField = document.getElementById("subtask");
    const addSubtaskIcon = document.getElementById("icon-hold");

    // Anpassung des Layouts für die Eingabe
    addSubtaskIcon.innerHTML = `
            <img src="./img/cancel.png" alt="cancel-icon" class="hover" onclick="cancelSubtaskEdit()">
            <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
            <img src="./img/done.png" alt="add-icon" class="hover" onclick="addNewSubtaskForEditing()">
        `;
    cancelSubtaskEditSafety();
}


function addNewSubtaskForEditing() {
    const subtaskInputValue = document.getElementById("subtask").value.trim();
    const subtaskDisplayElement = document.getElementById("subtask-display");

    if (subtaskInputValue !== "") {
        // Hier könnten Sie eine eindeutige ID für das neue Subtask generieren
        const newSubtaskId = Date.now();

        subtaskDisplayElement.innerHTML += `
            <span contenteditable="true" class="span-container" id="sub-span-${newSubtaskId}">
                <div class="subtask-preview" id="preview-${newSubtaskId}">
                    <div class="list-item" id="list-item-${newSubtaskId}"></div>
                    <p id="sub-content-${newSubtaskId}">${subtaskInputValue}</p>
                </div>
                <div class="subtask-icon-container" id="icon-container-${newSubtaskId}">
                    <img src="./img/edit-contacts.png" alt="edit-icon" class="hover">
                    <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
                    <img src="./img/delete.png" alt="delete-icon" class="hover" onclick="deleteSubtask('${newSubtaskId}')">
                </div>
            </span>
        `;
        // Zurücksetzen des Eingabefelds
        document.getElementById("subtask").value = "";
        resetSubtaskIcons();
    }
}
function cancelSubtaskEditSafety() {
    document.addEventListener("click", function (event) {
        let subtaskForm = document.getElementById("subtask-form");
        let subtaskInput = document.getElementById("subtask");

        // Check if the clicked element is not the subtask input field or its parent
        // and if the input field is empty

        if (event.target !== subtaskInput && !subtaskForm.contains(event.target) && subtaskInput.value === "") {
            cancelSubtaskEdit();
        }
    });
}
function cancelSubtaskEdit(event) {
    if (event) event.stopPropagation();
    // Logik zum Zurücksetzen des Eingabefelds und Icons
    document.getElementById("subtask").value = "";
    resetSubtaskIcons();
}

function resetSubtaskIcons() {
    const addSubtaskIcon = document.getElementById("icon-hold");
    addSubtaskIcon.innerHTML = `
        <img src="./img/subtask.png" alt="add-icon" class="hover add-hover" onclick="initializeSubtaskEditing()">
    `;
}


// function toggleSubtaskFocus(taskId, subtaskId, isFocusing) {
//     const task = boardTasks.find(t => t.taskId === taskId);
//     const subtask = task.subtasks[i];
//     let subTaskSpan = document.getElementById(`sub-span-${i}`);
//     let listItem = document.getElementById(`list-item-${i}`);
//     let preview = document.getElementById(`preview-${i}`);
//     let editIcon = document.getElementById(`icon-container-${i}`);
//     let subtaskContent = document.getElementById(`sub-content-${i}`);

//     // Wenn der Subtask fokussiert wird
//     if (isFocusing) {
//         subTaskSpan.classList.add("focus-input");
//         listItem.classList.add("focus-list-item");
//         preview.classList.add("focus-preview");

//         editIcon.innerHTML = `
//           <img src="./img/delete.png" alt="delete-icon" class="hover" onclick="toggleSubtaskFocus(${i}, false)">
//           <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
//           <img src="./img/done.png" alt="done-icon" class="hover" onclick="toggleSubtaskFocus(${i}, false)">
//         `;
//     } else {
//         // Wenn der Subtask nicht mehr fokussiert wird
//         let currentSubtaskValue = subtaskContent.innerText.trim();
//         let originalSubtaskValue = subtask['subtasksText'].trim();

//         if (currentSubtaskValue !== originalSubtaskValue) {
//             subtasks[i]['subtasksText'] = currentSubtaskValue;
//             // Speichern oder Aktualisieren der Subtask-Informationen hier, falls nötig
//         }

//         subTaskSpan.classList.remove("focus-input");
//         listItem.classList.remove("focus-list-item");
//         preview.classList.remove("focus-preview");

//         editIcon.innerHTML = `
//           <img src="./img/edit-contacts.png" alt="edit-icon" class="hover" onclick="toggleSubtaskFocus(${i}, true)">
//           <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
//           <img src="./img/delete.png" alt="delete-icon" class="hover" onclick="deleteSubtask(${i})">
//         `;
//     }
// }


function toggleSubtaskFocus(taskId, subtaskId, isFocusing) {
    // Zugriff auf das Task-Objekt basierend auf taskId
    const task = boardTasks.find(t => t.taskId === taskId);
    if (!task) {
        console.error("Task nicht gefunden.");
        return;
    }

    // Finden des spezifischen Subtasks innerhalb des Task-Objekts anhand der subtaskId
    const subtask = task.subtasks.find(st => st.subtaskId === subtaskId);
    if (!subtask) {
        console.error("Subtask nicht gefunden.");
        return;
    }

    // Referenzen zu den UI-Elementen des Subtasks
    const subTaskSpan = document.getElementById(`sub-span-${subtaskId}`);
    const editIcon = document.getElementById(`icon-container-${subtaskId}`);
    const subtaskContentElement = document.getElementById(`sub-content-${subtaskId}`);

    let listItem = document.getElementById(`list-item-${subtaskId}`);
    let preview = document.getElementById(`preview-${subtaskId}`);

    if (isFocusing) {
        // Wenn der Subtask fokussiert wird, aktivieren Sie den Bearbeitungsmodus
        subTaskSpan.classList.add("focus-input");
        listItem.classList.add("focus-list-item");
        preview.classList.add("focus-preview");
        
        // Aktualisieren Sie die Icons für den Bearbeitungsmodus
        editIcon.innerHTML = `
            <img src="./img/delete.png" alt="delete-icon" class="hover" onclick="deleteSubtaskFromEditing(${taskId}, ${subtaskId})">
            <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
            <img src="./img/done.png" alt="done-icon" class="hover" onclick="toggleSubtaskFocus(${taskId}, ${subtaskId}, false)">
        `;
    } else {
        // Wenn der Fokus verloren geht, speichern Sie die Änderungen und verlassen Sie den Bearbeitungsmodus
        let currentSubtaskValue = subtaskContentElement.innerText.trim();

        // Optional: Aktualisieren Sie den Wert des Subtasks im Task-Objekt
        subtask.subtasksText = currentSubtaskValue;

        // Entfernen Sie die Bearbeitungsklassen
        subTaskSpan.classList.remove("focus-input");
        listItem.classList.remove("focus-list-item");
        preview.classList.remove("focus-preview");
        
        // Setzen Sie die Icons auf den Standardzustand zurück
        editIcon.innerHTML = `
            <img src="./img/edit-contacts.png" alt="edit-icon" class="hover" onclick="toggleSubtaskFocus(${taskId}, ${subtaskId}, true)">
            <img src="./img/divider-subtask.png" alt="divider" class="divider-subtask-icon">
            <img src="./img/delete.png" alt="delete-icon" class="hover" onclick="deleteSubtaskFromEditing(${taskId}, ${subtaskId})">
        `;
        
        // Optional: Speichern Sie die aktualisierten Task- und Subtask-Daten, z.B. in einem lokalen Speicher oder durch Senden an einen Server
    }
}
