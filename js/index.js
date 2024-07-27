function parseLrc() {
  var lines = lrc.split("\n");
  var results = [];
  for (var item of lines) {
    var parts = item.split("]");
    var obj = {
      //   time: parts[0].replace("[", ""),
      time: parseTime(parts[0].substring(1)),
      words: parts[1],
    };
    results.push(obj);
  }
  return results;
}

function parseTime(timeStr) {
  var parts = timeStr.split(":");
  return +parts[0] * 60 + +parts[1];
}

const lrcData = parseLrc();

// console.log(lrcData);

var doms = {
  audio: document.querySelector("audio"),
  ul: document.querySelector("ul"),
  container: document.querySelector(".container"),
};

function findIndex() {
  // 播放器当前播放时间
  var currentTime = doms.audio.currentTime;
  for (var i = 0; i < lrcData.length; i++) {
    if (currentTime < lrcData[i].time) {
      return i - 1;
    }
  }
  // 循环完毕没有找到，说明播放完毕
  return lrcData.length - 1;
}

/**
 * 创建歌词元素 li
 */
function createLrcElements() {
  var frag = document.createDocumentFragment(); // 文档片段
  for (var i = 0; i < lrcData.length; i++) {
    var li = document.createElement("li");
    li.textContent = lrcData[i].words;
    frag.appendChild(li);
  }
  doms.ul.appendChild(frag);
}

createLrcElements();

// 容器高度
var containerHeight = doms.container.clientHeight;
var liHeight = doms.ul.children[0].clientHeight;
var maxOffset = doms.ul.clientHeight - containerHeight;

/**
 * 设置ul元素的偏移量
 */
function setOffset() {
  var index = findIndex();
  var offset = liHeight * index + liHeight / 2 - containerHeight / 2;
  // if (offset < 0) {
  //   offset = -containerHeight / 2 + liHeight * index + liHeight / 2;
  // }
  if (offset > maxOffset && offset != -containerHeight / 2) {
    offset = maxOffset;
  }
  doms.ul.style.transform = "translateY(" + -offset + "px)";
  // 去掉之前的active样式
  var li = doms.ul.querySelector(".active");
  if (li) {
    li.classList.remove("active");
  }
  li = doms.ul.children[index];
  if (li) {
    li.classList.add("active");
  }
  //   console.log(liHeight * index + liHeight / 2 - containerHeight / 2);
}

setOffset();

doms.audio.addEventListener("timeupdate", setOffset);
