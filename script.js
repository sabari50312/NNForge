document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector(".container");
  let choiceLayers = document.querySelectorAll(".choices");

  const sortable = new Sortable(list, {
    animation: 300,
    ghostClass: "sortable-ghost", // Class name for the drop placeholder
    chosenClass: "sortable-chosen", // Class name for the chosen item
    dragClass: "sortable-drag", // Class name for dragging item
    // onUpdate: () => {
    //   getList();
    // },
  });

  refreshArchitecture();

  // Add popup to input parameters in layer choices (INPUTS NOT ARCHITECTURE OUTPUT)
  choiceLayers.forEach((ele, idx) => {
    let propertiesDiv = ele.querySelector(".popup");
    // console.log(propertiesDiv);

    // Only if clicked on the parent div and outside the child div, close it
    ele.addEventListener("click", function (e) {
      if (
        e.target.classList.contains("choices") &
        e.target.classList.contains("layer")
      ) {
        if (propertiesDiv.style.display === "block") {
          propertiesDiv.style.display = "none";
          propertiesDiv.style.opacity = 0;
        } else {
          propertiesDiv.style.display = "block";
          void propertiesDiv.offsetWidth;
          propertiesDiv.style.opacity = 1;
        }
      }
    });
    // console.log(ele, idx);
    // ele.appendChild(propertiesDiv);
  });
});

function addToArchitecture(layer) {
  let architectureLayers = document.querySelector(".container");
  architectureLayers.appendChild(layer);
  refreshArchitecture();
}

function refreshArchitecture() {
  // Refreshes the architecture by adding properties to an invisible div and appending it to the architecture layer.

  let architectureLayers = document.querySelectorAll(".list-items");
  let ele = architectureLayers[architectureLayers.length - 1];

  // console.log(ele);

  // Gets all the attributes
  let data = Object.entries(ele.dataset);
  let text = "";

  // If attributes exist then add them in invisible div
  if (data.length > 0) {
    // Converts attributes to string
    data.forEach(([key, value]) => {
      text += key + ":" + value + "\n";
    });

    // Add the properties to invisible div
    let propertiesDiv = document.createElement("p");
    propertiesDiv.textContent = text;
    propertiesDiv.classList.add("popup");
    propertiesDiv.style.display = "none";
    propertiesDiv.style.opacity = 0;

    // Toggle attributes onClick
    ele.addEventListener("click", function (e) {
      if (
        e.target.classList.contains("list-items") &
        e.target.classList.contains("layer")
      ) {
        if (propertiesDiv.style.display === "block") {
          propertiesDiv.style.display = "none";
          propertiesDiv.style.opacity = 0;
        } else {
          propertiesDiv.style.display = "block";
          void propertiesDiv.offsetWidth;
          propertiesDiv.style.opacity = 1;
        }
      }
    });
    ele.appendChild(propertiesDiv);
  }

  // Add delete button
  let delButton = document.createElement("button");
  // delButton.textContent = "Delete";
  delButton.ariaLabel = "Close";
  delButton.classList.add(["btn-close"]);

  // Add delete function
  delButton.addEventListener("click", deleteLayer);

  ele.appendChild(delButton);
}

function addInput(ele) {
  ele = ele.parentNode;
  let inputShape = ele.querySelector("#input-shape").value;
  let activation = ele.querySelector("#input-activation").value;

  let inputLayer = document.createElement("li");

  inputLayer.innerText = "Input";
  inputLayer.classList.add("list-items", "layer", "btn", "btn-light");
  inputLayer.setAttribute("data-inputShape", inputShape);
  inputLayer.setAttribute("data-activation", activation);
  inputLayer.setAttribute("data-layerType", "Input");

  addToArchitecture(inputLayer);
}

function addDense(ele) {
  ele = ele.parentNode;
  let units = ele.querySelector("#dense-units").value;
  let activation = ele.querySelector("#dense-activation").value;

  let denseLayer = document.createElement("li");

  denseLayer.innerText = "Dense";
  denseLayer.classList.add("list-items", "layer", "btn", "btn-light");
  denseLayer.setAttribute("data-units", units);
  denseLayer.setAttribute("data-activation", activation);
  denseLayer.setAttribute("data-layerType", "Dense");

  addToArchitecture(denseLayer);
}
function addConv2D(ele) {
  ele = ele.parentNode;
  let filters = ele.querySelector("#conv2d-filters").value;
  let kernelSize = ele.querySelector("#conv2d-kernel").value;
  let activation = ele.querySelector("#conv2d-activation").value;

  let conv2dLayer = document.createElement("li");

  conv2dLayer.innerText = "Conv2D";
  conv2dLayer.classList.add("list-items", "layer", "btn", "btn-light");
  conv2dLayer.setAttribute("data-filters", filters);
  conv2dLayer.setAttribute("data-kernelSize", kernelSize);
  conv2dLayer.setAttribute("data-activation", activation);
  conv2dLayer.setAttribute("data-layerType", "Conv2D");

  addToArchitecture(conv2dLayer);
}
function addFlatten(ele) {
  ele = ele.parentNode;

  let flattenLayer = document.createElement("li");

  flattenLayer.innerText = "Flatten";
  flattenLayer.classList.add("list-items", "layer", "btn", "btn-light");
  flattenLayer.setAttribute("data-layerType", "Flatten");

  addToArchitecture(flattenLayer);
}

function deleteLayer(e) {
  e.target.parentNode.remove();
}

function generatePythonCode() {
  let architecture = document.querySelectorAll(".architecture > ul > li");
  let code =
    "import tensorflow as tf\nfrom tensorflow.keras.models import Sequential\nfrom tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense\n\n# Initialize the model\nmodel = Sequential()\n\n";
  architecture.forEach((layer) => {
    let layerData = layer.dataset;
    switch (layerData["layertype"]) {
      case "Input":
        code += generateInput(layerData);
        break;
      case "Dense":
        code += generateDense(layerData);
        break;
      case "Conv2D":
        code += generateConv2D(layerData);
        break;
      case "Flatten":
        code += generateFlatten(layerData);
        break;
    }
  });
  code += "\nmodel.summary()\n";
  document.querySelector("#code-content").textContent = code;
  console.log(code);
}

const copyToClipboard = async () => {
  try {
    const element = document.querySelector("#code-content");
    await navigator.clipboard.writeText(element.textContent);
    console.log("Text copied to clipboard!");
    // Optional: Display a success message to the user
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    // Optional: Display an error message to the user
  }
};
