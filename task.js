const $form = document.getElementById("form"),
  $table = document.getElementById("table"),
  $fragment = document.createDocumentFragment(),
  $tbody = $table.querySelector("tbody"),
  hidden = document.querySelector(".hidden"),
  title = document.querySelector(".title"),
  btn = $form.querySelector(".btn-e"),
  message = document.querySelector(".message");
let taskList = [];
const handleForm = (e) => {
  e.preventDefault();
  if (e.target === $form) {
    if (btn.value === "Enviar") {
      let nombre = e.target.name.value;
      createTask(nombre);
      e.target.name.value = "";
      showTask();
    } else {
      let id = btn.dataset.id;
      let nuevoNombre = e.target.name.value;
      let estado = e.target.estado.checked;
      hidden.classList.add("hidden");
      title.textContent = "Gestion de tareas";
      btn.value = "Enviar";
      e.target.name.value = "";
      btn.removeAttribute("data-id");
      updateTask(id, nuevoNombre, estado);
      showTask();
    }
  }
};
const handleButton = (e) => {
  if (e.target.matches(".delete")) {
    const id = parseInt(e.target.getAttribute("data-id"));
    deleteTask(id);
    showTask();
  }
  if (e.target.matches(".edit")) {
    const id = parseInt(e.target.getAttribute("data-id"));
    hidden.classList.remove("hidden");
    title.textContent = "Actualizar tarea";
    btn.value = "Actualizar";
    const task = getOneTask(id);
    console.log(task);
    $form.name.value = task.nombre;
    $form.estado.checked = task.completed;
    btn.setAttribute("data-id", id);
  }
};
const showTask = () => {
  $tbody.innerHTML = "";
  if (taskList.length === 0) {
    message.classList.remove("hidden");
    $table.classList.add("hidden");
  } else {
    message.classList.add("hidden");
    $table.classList.remove("hidden");
    taskList.forEach((task) => {
      let tr = document.createElement("tr");
      tr.innerHTML = `
            <td> ${task.nombre} </td>
            <td> ${task.completed ? "Tarea completa" : "Tarea incompleta"} </td>
            <td> <button class="edit" data-id="${
              task.id
            }">Editar</button> <button class="delete" data-id="${
        task.id
      }">Eliminar</button> </td>
          `;
      $fragment.appendChild(tr);
    });
    $tbody.appendChild($fragment);
    setTaskLocalS();
  }
};
const createTask = ($task) => {
  let item = {
    nombre: $task,
    completed: false,
    id: Date.now(),
  };
  taskList.push(item);
  setTaskLocalS();
};
const getTasks = () => {
  if (taskList.length !== 0) {
    taskList.forEach((task) => {
      console.log(
        `Id: ${task.id} -- Nombre de tarea: ${task.nombre} -- Estado: ${
          task.completed ? "Tarea completa" : "Tarea incompleta"
        }`
      );
    });
  }
};
const deleteTask = (id) => {
  let index = taskList.findIndex((el) => el.id === id);
  if (index !== -1) taskList.splice(index, 1);
  setTaskLocalS();
};
const updateTask = (id, nuevoNombre, estado) => {
  let $id = parseInt(id);
  const task = taskList.find((t) => t.id === $id);
  if (task) {
    task.nombre = nuevoNombre !== undefined ? nuevoNombre : task.nombre;
    task.completed = estado !== undefined ? estado : task.completed;
  }
  setTaskLocalS();
};
const getOneTask = (id) => taskList.find((t) => t.id === id);
const setTaskLocalS = () =>
  localStorage.setItem("taskList", JSON.stringify(taskList));
const getTaskLocalS = () => JSON.parse(localStorage.getItem("taskList")) || [];
const loadTask = (e) => {
  taskList = getTaskLocalS();
  showTask();
};
document.addEventListener("submit", handleForm);
document.addEventListener("click", handleButton);
document.addEventListener("DOMContentLoaded", loadTask);
