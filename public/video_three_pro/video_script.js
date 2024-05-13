var player = videojs("my-video", {
  playbackRates: [0.5, 1, 1.5, 2],
  disablePictureInPicture: true,
});

document.addEventListener("DOMContentLoaded", function () {
  // Получаем элемент видео
  var videoElement = document.getElementById("my-video");

  // Получаем путь к видео из атрибута src
  var videoPath = videoElement.getAttribute("src");
  console.log("Путь к видео:", videoPath);

  var url = new URL(window.location.href);
  var videoCode = url.searchParams.get("videoCode");

  console.log(videoCode);
});
