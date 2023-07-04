import React, { useState, useRef, useEffect } from "react";

function Image({ model }) {
  const [imageURL, setImageURL] = useState(null);
  const [previousImg, setPreviousImg] = useState([]);
  const [results, setResults] = useState([]);

  const imageRef = useRef(0); // for the reference of image URL
  const textRef = useRef(0); // for the reference of user inserted image URL
  const uploadRef = useRef(); // for the reference of uploading the image

  // making the imported image URL and setting the state
  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const iURL = URL.createObjectURL(files[0]);
      setImageURL(iURL);
    } else {
      setImageURL(null);
    }
  };
  //   console.log(imageURL);

  // this is the main function which is going to classify the image
  const identifyTheImage = async () => {
    textRef.current.value = "";
    const results = await model.classify(imageRef.current);
    setResults(results);
  };

  const handleImage = (e) => {
    setImageURL(e.target.value);
    setResults([]);
  };

  const upLoadTheImage = () => {
    uploadRef.current.click();
    setResults([]);
  };

  //caching the previous images here so we dont need to upload it again
  useEffect(() => {
    if (imageURL) {
      setPreviousImg([imageURL, ...previousImg]);
    }
  }, [imageURL]);

  return (
    <div className="inputImage">
      <input
        type="file"
        accept="image/*"
        capture="camera"
        className="uploadInput"
        onChange={uploadImage}
        ref={uploadRef}
      />
      <button className="uploadImage" onClick={upLoadTheImage}>
        Upload the Image
      </button>
      <span className="or">Or Please </span>
      <input
        type="text"
        placeholder="Enter the Image URL"
        ref={textRef}
        onChange={handleImage}
      />
      <div className="imageWrapper">
        <div className="imageContent">
          <div className="imageHolder">
            {imageURL && (
              <img
                src={imageURL}
                alt="Preview"
                crossOrigin="anonymous"
                ref={imageRef}
              />
            )}
          </div>
          {imageURL && results.length > 0 && (
            <div className="resultsHolder">
              <span className="resultHeader">Model Predictions</span>
              {results.map((result, index) => {
                return (
                  <div className="result" key={result.className}>
                    <span className="classheader">Classname - </span>
                    <span className="name">{`${result.className}`}</span>
                    <span className="confidence">
                      Confidence Score: {(result.probability * 100).toFixed(2)}%{" "}
                      {index === 0 && (
                        <span className="bestGuess">Best Prediction</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {imageURL && (
          <button className="button" onClick={identifyTheImage}>
            Recognize the Image
          </button>
        )}
      </div>
      {previousImg.length > 0 && previousImg.length < 10 && (
        <div className="recentPredictions">
          <h2>Recent Images</h2>
          <div className="recentImages">
            {previousImg.map((image, index) => {
              return (
                <div className="recentPrediction" key={`${image}${index}`}>
                  <img
                    src={image}
                    alt="Recent prediction"
                    onClick={() => {
                      setImageURL(image);
                      setResults([]);
                    }}
                  ></img>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Image;
