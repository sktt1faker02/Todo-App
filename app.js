const themeEl = document.querySelector(".theme");
const theme = document.querySelector("html");
const header = document.querySelector("header");
const todoInput = document.querySelector(".todo-input input");
const body = document.querySelector("body");

class ToDo {
  constructor() {
    // this.userTheme = userTheme;
    this.taskArr = [
      {
        userTheme: "light",
        tasks: [],
      },
    ];

    if (localStorage.getItem("todos")) {
      this.taskArr = JSON.parse(localStorage.getItem("todos"));
      // this.selectTheme(todoArr[0].userTheme);
      // console.log(this.taskArr);
    } else {
      localStorage.setItem("todos", JSON.stringify(this.taskArr));
    }
  }

  selectTheme(userTheme) {
    const elements = [body, theme, header, todoInput];

    // Retrieve userTheme from localStorage if available
    const storedTheme = JSON.parse(localStorage.getItem("todos"))[0].userTheme;
    // console.log(storedTheme);
    if (storedTheme === "dark" || storedTheme === "light") {
      userTheme = storedTheme;
    } else {
      // Set light as the default theme
      userTheme = "light";
    }

    elements.forEach((element) => {
      // Remove the previously applied theme class
      element.classList.remove("dark", "light");
      // Add the new userTheme class
      element.classList.add(userTheme);
    });

    themeEl.src = `./images/icon-${body.classList.contains("dark") ? "sun" : "moon"}.svg`;

    themeEl.addEventListener("click", () => {
      userTheme = userTheme === "light" ? "dark" : "light";
      this.taskArr[0].userTheme = userTheme;
      localStorage.setItem("todos", JSON.stringify(this.taskArr));

      elements.forEach((element) => {
        // Remove the previously applied theme class
        element.classList.remove("dark", "light");
        // Add the new userTheme class
        element.classList.add(userTheme);
      });

      themeEl.src = `./images/icon-${body.classList.contains("dark") ? "sun" : "moon"}.svg`;
    });
  }

  remove() {
    const removeEl = document.querySelectorAll(".remove");
    removeEl.forEach((e, i) => {
      e.addEventListener("click", () => {
        const taskID = e.closest("li").querySelector(".text-id").innerText;

        this.taskArr[0].tasks = this.taskArr[0].tasks.filter((task) => task.id !== +taskID);
        localStorage.setItem("todos", JSON.stringify(this.taskArr));
        e.closest("li").remove();
        this.itemLeft();
        this.fixPadding();

        // console.log(this.taskArr);
        this.filter();
      });
    });
  }

  listChecked() {
    const checkboxes = document.querySelectorAll(".checkbox");

    checkboxes.forEach((c, i) => {
      c.addEventListener("change", () => {
        if (c.checked) {
          // console.log("Checkmate", c.nextElementSibling.textContent, i);
          this.taskArr[0].tasks[i].active = true;
          // console.log(this.taskArr);
        }
      });
    });
  }

  insert() {
    const todoInputTxt = document.getElementById("todo-input");

    todoInputTxt.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (!todoInputTxt.value) return;
        this.taskArr[0].tasks.push({ id: Date.now(), task: `${todoInputTxt.value}`, active: false });
        localStorage.setItem("todos", JSON.stringify(this.taskArr));
        // console.log(this.taskArr);

        const todoList = document.querySelector(".todo-list");
        todoList.replaceChildren();
        this.displayTodos();
        // document.querySelector(".todo-list").replaceChildren();

        // const listEl = document.createElement("li");
        if (this.taskArr[0].tasks.length > 0) document.querySelector(".todo-list-wrapper").style.paddingTop = "1.2rem";

        todoInputTxt.value = "";

        this.itemLeft();
        this.remove();
        this.filter();
      }
    });
  }

  itemLeft() {
    const remaining = document.querySelector(".remaining-task");
    remaining.innerText = `${this.taskArr[0].tasks.length} ${this.taskArr[0].tasks.length < 2 ? "item" : "items"} left`;
    // console.log(this.taskArr[0].tasks.length);
  }

  filter() {
    const filterBtn = document.querySelectorAll('input[type="radio"]');
    const todoList = document.querySelectorAll(".todo-list li");

    filterBtn.forEach((f) => {
      f.addEventListener("change", () => {
        todoList.forEach((list) => {
          const checkedList = list.querySelector(".checkbox");

          if (f.id === "all") {
            list.style.display = "";
          }

          if (f.id === "active") {
            if (!checkedList.checked) {
              list.style.display = "";
            } else {
              list.style.display = "none";
            }
          }

          if (f.id === "completed") {
            if (checkedList.checked) {
              list.style.display = "";
            } else {
              list.style.display = "none";
            }
          }
        });
      });
    });
  }

  clearCompleted() {
    const clearBtn = document.querySelector(".clear");
    clearBtn.addEventListener("click", () => {
      // console.log("Clear Completed");
      const lists = document.querySelectorAll(".todo-list li");

      if (!lists.length) return;

      // console.log(this.taskArr[0].tasks);
      this.taskArr[0].tasks = this.taskArr[0].tasks.filter((task) => task.active !== true);
      localStorage.setItem("todos", JSON.stringify(this.taskArr));
      // console.log(this.taskArr);

      document.querySelector(".todo-list").replaceChildren();
      this.displayTodos();

      this.itemLeft();
      this.fixPadding();
      this.remove();
      this.filter();
    });
  }

  displayTodos(todos) {
    todos = JSON.parse(localStorage.getItem("todos"))[0].tasks;

    this.fixPadding();
    // else document.querySelector(".todo-list-wrapper").style.paddingTop = "1.2rem";
    todos.map((todo) => {
      const listEl = document.createElement("li");
      listEl.innerHTML = `
        <label class="list">
          <input class="checkbox" type="checkbox" ${todo.active === true ? "checked" : ""} />
          <span class="text">${todo.task}</span>
          <span class="text-id">${todo.id}</span>
        </label>
        <span class="remove"><img src="./images/icon-cross.svg" alt="icon-cross" /></span>
      `;
      document.querySelector(".todo-list").appendChild(listEl);
    });

    this.itemLeft();
    this.listChecked();
  }

  fixPadding() {
    if (this.taskArr[0].tasks.length === 0) document.querySelector(".todo-list-wrapper").style.paddingTop = "0";
  }

  sortable() {
    const simpleList = document.querySelector(".todo-list");
    Sortable.create(simpleList);
  }

  init() {
    todo.selectTheme();
    todo.insert();
    todo.displayTodos();
    todo.remove();
    todo.clearCompleted();
    todo.filter();
    todo.sortable();
  }
}

const todo = new ToDo();
todo.init();
// TODO: Clear Completed Functionality
