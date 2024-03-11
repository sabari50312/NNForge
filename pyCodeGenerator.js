function generateInput(input) {
  let inputShape = input["inputshape"].split(",").map(Number);
  let activation = input["activation"];
  let layer = input["layertype"];

  let code = `model.add(${layer}(shape=(${inputShape}), activation='${activation}')\n`;
  // console.log(code);
  return code;
}

function generateDense(dense) {
  let units = dense["units"];
  let activation = dense["activation"];
  let layer = dense["layertype"];

  let code = `model.add(${layer}(${units}, activation='${activation}'))\n`;
  // console.log(code);
  return code;
}

function generateConv2D(conv2D) {
  let filters = conv2D["filters"];
  let kernelSize = conv2D["kernelsize"].split(",").map(Number);
  let activation = conv2D["activation"];
  let layer = conv2D["layertype"];

  let code = `model.add(${layer}(filters=${filters}, kernel_size=(${kernelSize}), activation='${activation}')\n`;
  // console.log(code);
  return code;
}

function generateFlatten(flatten) {
  let code = `model.add(Flatten())\n`;
  // console.log(code);
  return code;
}
