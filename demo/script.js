const submitBtn = document.getElementById("submit-btn");
const loading = document.getElementById("loader-span");
const btnText = document.getElementById("btn-text");

const visualizeDetection = (image, outputs) => {
  const boxes = outputs.bbox;
  const labels = outputs.class;
  const confi = outputs.confidence;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  ctx.strokeStyle = "red";
  ctx.lineWidth = 4;
  ctx.font = "30px Arial";

  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    const x1 = box[0];
    const y1 = box[1];
    const x2 = box[2];
    const y2 = box[3];
    const label = labels[i] + " " + confi[i].toFixed(2);

    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

    ctx.fillStyle = "red";
    ctx.fillRect(x1 - 2, y1 - 38, ctx.measureText(label).width + 10, 40);
    ctx.fillStyle = "white";
    ctx.fillText(label, x1, y1 - 8);
  }

  const imgElement = document.createElement("img");
  imgElement.src = canvas.toDataURL();
  imgElement.classList.add("responsive");
  document.getElementById("output").appendChild(imgElement);
};

const predict = () => {
  const img = document.querySelector("#customFile").files[0];
  if (!img) return alert("Please select an image");
  document.getElementById("output").innerHTML = "";

  submitBtn.disabled = true;
  loading.style.display = "block";
  btnText.style.display = "none";

  const formData = new FormData();
  formData.append("img", img);
  fetch("https://predict-ebi2uybfrq-el.a.run.app/", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.error || result.bbox.length == 0) {
        loading.style.display = "none";
        btnText.style.display = "block";
        submitBtn.disabled = false;
        return alert("No animal from trained class detected");
      }
      const image = new Image();
      image.classList.add("responsive");
      image.src = URL.createObjectURL(img);
      image.onload = () => {
        loading.style.display = "none";
        btnText.style.display = "block";
        submitBtn.disabled = false;
        visualizeDetection(image, result);
      };
    })
    .catch((error) => {
      console.error(error);
    });
};
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
});
submitBtn.addEventListener("click", predict);
