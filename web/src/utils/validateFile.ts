export default async function validateFile(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    var video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      const size = file.size / 1024 / 1024;
      resolve(video.duration < 1 * 10 * 60 && size < 500);
    };

    video.src = URL.createObjectURL(file);
  });
}
