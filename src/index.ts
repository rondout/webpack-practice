import { reverse, sumFn } from "@/utils";
import "./style/main.less";
import contactBlackIcon from "@/assets/imgs/contact-black.png";
import videoUrl from "@/assets/videos/video.mp4";
import moment from "moment";

const count = sumFn(1, 25, 6, 9, 15, 54, 15);
console.log(reverse("Hello World!"), count, contactBlackIcon);

init();

function init() {
  console.log({ microApp: window.microApp });
  document.querySelector("h1").innerText = reverse(
    "123456789+" + count.toString()
  );

  document.querySelector("h2").innerText = moment().format();
  insertImg();
  insertVideo();
}

function insertImg() {
  const imgEl = document.createElement("img");
  imgEl.src = contactBlackIcon;
  document.body.appendChild(imgEl);
}

function insertVideo() {
  const imgEl = document.createElement("video");
  imgEl.src = videoUrl;
  imgEl.width = 500;
  document.body.appendChild(imgEl);
}
