class Table {
  constructor() {
    let table = this;
    $(".color-picker").spectrum({
      type: "text",
      showInitial: true,
      showInput: true,
      showPalette: false,
      preferredFormat: "hex",
      appendTo: ".color-formats",

      change: function (color) {
        table.colorElement.style.backgroundColor = color.toLocaleString();
        table.colorElement.parentNode.querySelector(".color-text").innerText = color.toLocaleString();
      },
      move: function (color) {
        table.colorElement.style.backgroundColor = color.toLocaleString();
        table.colorElement.parentNode.querySelector(".color-text").innerText = color.toLocaleString();
      },
      hide: function (color) {
        table.colorElement.style.backgroundColor = color.toLocaleString();
        table.colorElement.parentNode.querySelector(".color-text").innerText = color.toLocaleString();
      },
    });

    this.tableWrapperNode = document.querySelector(".table-wrapper");
    this.tableNode = document.querySelector(".table tbody");
    this.rows = this.tableNode.getElementsByClassName("row");
    this.rowNode = document.querySelector(".empty-row");

    this.movingElement = false;
    this.previousMoving = false;
    this.colorElement = null;
    this.selectedElement = null;

    this.tableWrapperNode.querySelector(".color-formats select").addEventListener("change", () => {
      $(".color-picker").spectrum("option", "preferredFormat", this.tableWrapperNode.querySelector(".color-formats select").value);
    });

    this.tableWrapperNode.querySelector(".add-row").addEventListener("click", () => {
      this.addRow();
    });

    this.tableWrapperNode.querySelector(".save").addEventListener("click", () => {
      this.saveOnStorage();
    });

    this.tableWrapperNode.querySelector(".load").addEventListener("click", () => {
      this.tableWrapperNode.querySelector(".load-file").click();
    });

    this.tableWrapperNode.querySelector(".load-file").addEventListener("change", () => {
      this.readFromStorage(this.tableWrapperNode.querySelector(".load-file"));
    });

    document.addEventListener("mousemove", (event) => {
      if (this.movingElement === false) {
        return;
      }
      event.preventDefault();
      let rowHeight = parseInt(window.getComputedStyle(document.querySelector(".row")).height);
      let replaceNum = Math.round((event.pageY - this.tableNode.getBoundingClientRect().y) / rowHeight) - 1;
      if (replaceNum < 0) {
        replaceNum = 0;
      }
      if (replaceNum >= this.rows.length - 1) {
        replaceNum = this.rows.length - 1;
      }
      this.swapRow(replaceNum);
    });

    document.addEventListener("mouseup", () => {
      document.querySelector("body").classList.remove("grabbing");
      this.movingElement = false;
    });

    document.addEventListener("click", (event) => {
      if (this.tableNode.contains(event.target)) {
        return;
      }
      if (this.selectedElement) {
        this.selectedElement.classList.remove("selected");
        this.selectedElement = null;
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.code === "Delete") {
        this.removeRow(this.selectedElement);
      }
    });

    if (this.rows.length < 1) {
      for (let i = 0; i < 10; i++) {
        this.addRow();
      }
    }
  }

  addRow(row) {
    let element = this.rowNode.cloneNode(true);
    element.classList.remove("empty-row");
    element.classList.add("row");

    element.querySelector(".number").innerText = this.rows.length;
    element.querySelector(".number").addEventListener("mousedown", (event) => {
      this.movingElement = element;
      document.querySelector("body").classList.add("grabbing");
      if (this.selectedElement) {
        this.selectedElement.classList.remove("selected");
      }
      this.selectedElement = element;
      this.selectedElement.classList.add("selected");
      this.previousMoving = false;
      event.stopPropagation();
    });

    element.querySelector(".color").addEventListener("click", () => {
      this.colorPick(element.querySelector(".color"));
    });

    element.querySelector(".name").addEventListener("focus", () => {
      if (this.selectedElement) {
        this.selectedElement.classList.remove("selected");
      }
      this.selectedElement = null;
    });

    element.querySelector(".type").addEventListener("focus", () => {
      if (this.selectedElement) {
        this.selectedElement.classList.remove("selected");
      }
      this.selectedElement = null;
    });

    if (row !== undefined) {
      element.querySelector(".name").innerText = row.name;
      element.querySelector(".type").innerText = row.type;
      element.querySelector(".color").style.backgroundColor = row.color;
      element.querySelector(".color-text").innerText = row.color;
    }

    this.tableNode.appendChild(element);
  }

  removeRow(element) {
    try {
      this.tableNode.removeChild(element);
      this.reCount();
    } catch (e) {}
  }

  reCount() {
    let count = 0;
    this.tableNode.querySelectorAll(".row").forEach((element) => {
      element.querySelector(".number").innerText = count;
      count++;
    });
  }

  swapRow(num) {
    let currentNum = parseInt(this.movingElement.querySelector(".number").innerText); //Номер текущего элемента(с которым происходит обмен позициями)
    if (currentNum === num || num === this.previousMoving) {
      return;
    }
    let replaceNode = document.querySelectorAll(".row")[num];
    let repalceName = replaceNode.querySelector(".name").innerText;
    let repalceType = replaceNode.querySelector(".type").innerText;
    let repalceColor = replaceNode.querySelector(".color-text").innerText;

    replaceNode.querySelector(".name").innerText = this.movingElement.querySelector(".name").innerText;
    replaceNode.querySelector(".type").innerText = this.movingElement.querySelector(".type").innerText;
    replaceNode.querySelector(".color-text").innerText = this.movingElement.querySelector(".color-text").innerText;
    replaceNode.querySelector(".color").style.backgroundColor = this.movingElement.querySelector(".color-text").innerText;
    this.movingElement.querySelector(".name").innerText = repalceName;
    this.movingElement.querySelector(".type").innerText = repalceType;
    this.movingElement.querySelector(".color-text").innerText = repalceColor;
    this.movingElement.querySelector(".color").style.backgroundColor = repalceColor;
    this.previousMoving = num;
    this.movingElement.classList.remove("selected");
    this.movingElement = replaceNode;
    this.movingElement.classList.add("selected");
    this.selectedElement = this.movingElement;
  }

  colorPick(element) {
    this.colorElement = element;
    setTimeout(() => {
      $(".color-picker").spectrum("set", window.getComputedStyle(element).backgroundColor);
      $(".color-picker").spectrum("show");
      let pickerNode = document.querySelector(".sp-container");
      pickerNode.style.left = element.getBoundingClientRect().x - pickerNode.getBoundingClientRect().width - 2 + "px";
      pickerNode.style.top = element.getBoundingClientRect().y + element.getBoundingClientRect().height + 3 + "px";
    }, 1);
    event.stopPropagation();
  }

  saveOnStorage() {
    let data = new Array();
    for (let row of this.rows) {
      let obj = new Object();
      obj.name = row.querySelector(".name").innerText;
      obj.type = row.querySelector(".type").innerText;
      obj.color = row.querySelector(".color-text").innerText;
      data.push(obj);
    }
    let link = document.createElement("a");
    let text = JSON.stringify(data);
    let file = new Blob([text], { type: "text/plain" });
    link.setAttribute("href", URL.createObjectURL(file));
    link.setAttribute("download", "data.txt");
    link.click();
    return false;
  }

  readFromStorage(input) {
    var file = input.files[0];
    var reader = new FileReader();
    reader.addEventListener("load", () => {
      let removeNode = this.tableNode.querySelector(".row");
      while (removeNode) {
        this.tableNode.removeChild(removeNode);
        removeNode = this.tableNode.querySelector(".row");
      }

      let data = JSON.parse(reader.result);
      for (let row of data) {
        this.addRow(row);
      }
      input.value = "";
    });

    reader.readAsText(file);
  }
}

window.addEventListener("load", () => {
  let table = new Table();
});
