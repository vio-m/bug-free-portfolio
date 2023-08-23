// ADD | EDIT | DELETE PROJECT

const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const deleteButton = document.getElementById("delete-button");

const addForm = document.getElementById("add-form");
const editForm = document.getElementById("edit-form");
const deleteForm = document.getElementById("delete-form");

addButton.addEventListener("click", () => {
    addForm.style.display = "block";
    editForm.style.display = "none";
    deleteForm.style.display = "none";
});

editButton.addEventListener("click", () => {
    addForm.style.display = "none";
    editForm.style.display = "block";
    deleteForm.style.display = "none";
});

deleteButton.addEventListener("click", () => {
    addForm.style.display = "none";
    editForm.style.display = "none";
    deleteForm.style.display = "block";
});

// EDIT EXISTING PROJECT

const projectSelect = document.getElementById("project-select");
const editTitleInput = document.getElementById("edit-title");
const editDescriptionInput = document.getElementById("edit-description");
const editImageInput = document.getElementById("edit-image");
const editProjectImage = document.getElementById("edit-project-image");
const editTechnologiesInput = document.getElementById("edit-technologies");
const editGithubInput = document.getElementById("edit-github");
const editDemoInput = document.getElementById("edit-demo");

projectSelect.addEventListener("change", () => {
    const selectedOption = projectSelect.options[projectSelect.selectedIndex];
    const selectedProjectTitle = selectedOption.getAttribute("data-title");
    const selectedProjectDescription = selectedOption.getAttribute("data-description");
    const selectedProjectImage = selectedOption.getAttribute("data-image");
    const selectedProjectTechnologies = selectedOption.getAttribute("data-technologies");
    const selectedProjectGithub = selectedOption.getAttribute("data-github");
    const selectedProjectDemo = selectedOption.getAttribute("data-demo");

    editTitleInput.value = selectedProjectTitle;
    editDescriptionInput.value = selectedProjectDescription;
    editImageInput.value = selectedProjectImage;
    editProjectImage.src = selectedProjectImage;
    editTechnologiesInput.value = selectedProjectTechnologies;
    editGithubInput.value = selectedProjectGithub;
    editDemoInput.value = selectedProjectDemo;
});

// DELETE PROJECT

function confirmDelete() {
    return confirm("Are you sure you want to delete this project?");
}


