// I am using Tensorflow Mobilenet model for the predictoin of the image recognition

import { useEffect, useState } from "react";
import React from "react";
import Image from "./Image";

function ImageModel() {
  const [isModelLoading, setModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const mobilenet = require("@tensorflow-models/mobilenet");

  // loading the model from @tensorflow-models/mobilenet

  const loadModel = async () => {
    setModelLoading(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setModelLoading(false);
    } catch (error) {
      console.log(console.error);
      setModelLoading(false);
    }
  };
  // calling the loadmodel fucntion defined above
  useEffect(() => {
    loadModel();
  }, []);
  console.log(model);

  return (
    <div>
      {isModelLoading && <h2>Model is Loading...</h2>}
      <Image model={model} />
    </div>
  );
}

export default ImageModel;
