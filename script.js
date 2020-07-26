class Table {
  constructor() {
    this.data = new Array();
    this.row = new Object();
    this.row.name = null;
    this.row.type = null;
    this.row.color = null;

    this.tableNode = document.querySelector(".table tbody");
    this.rowNode = document.querySelector(".empty-row");

    this.movingElement = false;
    this.previousMoving = false;

    document.querySelector(".add-row").addEventListener("click", () => {
      this.addRow();
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
      if (replaceNum >= this.data.length - 1) {
        replaceNum = this.data.length - 1;
      }
      console.log(replaceNum);
      this.swapRow(replaceNum);
    });

    document.addEventListener("mouseup", () => {
      this.movingElement = false;
    });
  }

  addRow() {
    let element = this.rowNode.cloneNode(true);
    element.classList.remove("empty-row");
    element.classList.add("row");

    element.querySelector(".number").innerText = this.data.length;
    element.querySelector(".delete").addEventListener("click", () => {
      this.removeRow(element);
    });

    element.querySelector(".number").addEventListener("mousedown", () => {
      this.movingElement = element;
      this.previousMoving = false;
    });

    this.tableNode.appendChild(element);

    this.data.push(this.row);
  }

  removeRow(element) {
    let num = parseInt(element.querySelector(".number").innerText);
    this.tableNode.removeChild(element);
    this.data.splice(num, 1);
    this.reCount();
  }

  reCount() {
    let count = 0;
    this.tableNode.querySelectorAll("tr").forEach((element) => {
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
    let repalceColor = replaceNode.querySelector(".color").innerText;

    replaceNode.querySelector(".name").innerText = this.movingElement.querySelector(".name").innerText;
    replaceNode.querySelector(".type").innerText = this.movingElement.querySelector(".type").innerText;
    replaceNode.querySelector(".color").innerText = this.movingElement.querySelector(".color").innerText;
    this.movingElement.querySelector(".name").innerText = repalceName;
    this.movingElement.querySelector(".type").innerText = repalceType;
    this.movingElement.querySelector(".color").innerText = repalceColor;

    let tempData = this.data[num];
    this.data[currentNum] = this.data[num];
    this.data[currentNum] = tempData;

    this.previousMoving = num;
    this.movingElement = replaceNode;
  }
}

window.addEventListener("load", () => {
  let table = new Table();
});
