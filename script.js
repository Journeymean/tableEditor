class Table {
  constructor() {
    this.tableWrapperNode = document.querySelector(".table-wrapper");
    this.tableNode = document.querySelector(".table tbody");
    this.rows = this.tableNode.getElementsByClassName("row");
    this.rowNode = document.querySelector(".empty-row");
    this.colorNode = document.querySelector(".color-picker");

    this.movingElement = false;
    this.previousMoving = false;
    this.colorElement = null;

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
      this.movingElement = false;
    });

    document.addEventListener("click", () => {
      this.colorNode.classList.add("hide");
    });
  }

  addRow(row) {
    let element = this.rowNode.cloneNode(true);
    element.classList.remove("empty-row");
    element.classList.add("row");

    element.querySelector(".number").innerText = this.rows.length;
    element.querySelector(".delete").addEventListener("click", () => {
      this.removeRow(element);
    });

    element.querySelector(".number").addEventListener("mousedown", () => {
      this.movingElement = element;
      this.previousMoving = false;
    });

    element.querySelector(".color").addEventListener("click", () => {
      this.colorPick(element.querySelector(".color"));
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
    this.tableNode.removeChild(element);
    this.reCount();
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
    this.movingElement = replaceNode;
  }

  colorPick(element) {
    this.colorNode.style.left = element.getBoundingClientRect().x + "px";
    this.colorNode.style.top = element.getBoundingClientRect().y + element.getBoundingClientRect().height + "px";
    this.colorNode.classList.remove("hide");
    this.colorElement = element;
    setTimeout(() => {
      $(".color-picker").spectrum("set", window.getComputedStyle(element).backgroundColor);
      $(".color-picker").spectrum("show");
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
  $(".color-picker").spectrum({
    type: "text",
    showInitial: "true",
    showPalette: false,
    change: function (color) {
      table.colorElement.style.backgroundColor = color.toLocaleString();
      table.colorElement.parentNode.querySelector(".color-text").innerText = color.toLocaleString();
      table.colorNode.classList.add("hide");
    },
  });
});
