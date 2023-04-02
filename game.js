$(function () {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
  let numRows = 20;
  let numCols = 40;
  let squareSize = 25;
  let maxRows = 30;
  let maxCols = 60;
  let clicked = false;
  const arr = new Array(maxRows);
  for (let i = 0; i < maxRows; i++) arr[i] = new Array(maxCols).fill(0);
  const changeArr = new Array(maxRows);
  for (let i = 0; i < maxRows; i++) changeArr[i] = new Array(maxCols).fill(0);
  let container = $(".container-fluid");
  let row;
  let pos;
  let speed = 300;
  let titlePos;
  let num = 0;
  let lifePos = 550;

  start(num);

  function start(num) {
    for (let i = 0; i < numRows; i++) {
      container.append("<div class='row justify-content-center'></div>");
      row = $(".row:last");
      for (let j = 0; j < numCols; j++) {
        row.append("<div class='square'></div>");
        pos = "r" + (i < 10 ? "0" + i : i) + "c" + (j < 10 ? "0" + j : j) + num;
        row.find(".square:last").attr("id", pos);
        row.find(".square:last").css("width", squareSize);
        row.find(".square:last").css("height", squareSize);
        row.find(".square:last").css("padding", 0);
      }
    }
    titlePos = $("#r00c00" + num).offset().left;
    $(".title").css("padding-left", titlePos);
    $(".img7").css("left", titlePos + 282);
    $(".square").click(function () {
      $(this).toggleClass("clicked");
      let row, col;
      row = parseInt($(this).attr("id").slice(1, 3));
      col = parseInt($(this).attr("id").slice(4, 6));
      arr[row][col] = !arr[row][col];
    });
    if (numRows == 10) $(".minus").prop("disabled", true);
    else $(".minus").prop("disabled", false);
    if (numRows == maxRows) $(".plus").prop("disabled", true);
    else $(".plus").prop("disabled", false);
  }

  $("#range").mouseup(function () {
    if (clicked) {
      $(".btn:first").trigger("click");
      setTimeout(function () {
        $(".btn:first").trigger("click");
      }, 4);
    }
    speed = 910 - $("#range").val();
  });

  $(".btn:first").click(function () {
    clicked = !clicked;
    $(this).find("i").toggleClass("fa-play");
    $(this).find("i").toggleClass("fa-pause");
    if (clicked) {
      let stop = setInterval(function () {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            if (
              arr[i][j] == 1 &&
              (numOfNeighbors(i, j) < 2 || numOfNeighbors(i, j) > 3)
            )
              changeArr[i][j] = 1;
            else if (arr[i][j] == 0 && numOfNeighbors(i, j) == 3)
              changeArr[i][j] = 1;
          }
        }
        change();
        reset(changeArr);
        $(".btn:first").click(function () {
          clearInterval(stop);
        });
      }, speed);
    }
  });

  $(".restart").click(function () {
    if (clicked) {
      $(".btn:first").trigger("click");
    }
    for (let i = 0; i < numRows; i++)
      for (let j = 0; j < numCols; j++)
        if (arr[i][j] == 1) {
          rc =
            "#r" + (i < 10 ? "0" + i : i) + "c" + (j < 10 ? "0" + j : j) + num;
          $(rc).removeClass("clicked");
        }
    reset(arr);
    reset(changeArr);
    clicked = false;
  });

  $(".minus").click(function () {
    $(".restart").trigger("click");
    container.empty();
    if (numRows == maxRows) squareSize = 15;
    numRows -= 5;
    numCols -= 10;
    squareSize += 5;
    num++;
    start(num);
  });

  $(".plus").click(function () {
    $(".restart").trigger("click");
    container.empty();
    numRows += 5;
    numCols += 10;
    squareSize -= 5;
    if (numRows == maxRows) squareSize = 17;
    num++;
    start(num);
  });

  function numOfNeighbors(x, y) {
    let count = 0;
    let temp1, temp2;
    for (let i = x - 1; i <= x + 1; i++)
      for (let j = y - 1; j <= y + 1; j++) {
        temp1 = i;
        temp2 = j;
        if (i == numRows) i = 0;
        if (j == numCols) j = 0;
        if (i == -1) i = numRows - 1;
        if (j == -1) j = numCols - 1;
        if (!(i == x && j == y) && arr[i][j] == 1) count++;
        i = temp1;
        j = temp2;
      }
    return count;
  }

  function change() {
    for (let i = 0; i < numRows; i++)
      for (let j = 0; j < numCols; j++)
        if (changeArr[i][j] == 1) {
          arr[i][j] = !arr[i][j];
          rc =
            "#r" + (i < 10 ? "0" + i : i) + "c" + (j < 10 ? "0" + j : j) + num;
          $(rc).toggleClass("clicked");
        }
  }

  function reset(arr) {
    for (let i = 0; i < numRows; i++)
      for (let j = 0; j < numCols; j++) arr[i][j] = 0;
  }
});
