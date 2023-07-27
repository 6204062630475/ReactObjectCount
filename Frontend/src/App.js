// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";
import axios from "axios";
import { Button } from '@mui/material';
import Navbar from "./components/Navbar"
import History from "./components/History/History";


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [a, seta] = useState(10);
  const [page, setPage] = useState("home");
  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);


      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
      // Draw text on canvas
      ctx.font = "20px Arial";
      ctx.fillStyle = "white";
      //ctx.fillText("Object Count: " + obj.length, 10, 30);
      seta(obj.length);
    }
  };

  ///
  //handleปุ่มนับกับปุ่มย้อนกลับ
  const handleChangePage = () => {
    if (page == "home") {  //กดปุ่มนับที่หน้าhome
      setPage("otherPage");  //ไปที่หน้าแสดงจำนวน
      // เรียกใช้ API เพื่อบันทึกข้อมูล
      axios
        .post("http://localhost:3001/save-data", { count: a })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error("เกิดข้อผิดพลาดในการเรียกใช้ API:", error);
        });
    }
    else {
      setPage("home");  //หากอยู่ที่หน้าแสดงจำนวนกดปุ่มเพื่อกลับไปหน้าhome
    }

  };
  ///
  //handleปุ่มบน Navbar
  const getHistory = () => {
    setPage("history");
  };
  const getHome = () => {
    setPage("home");
  };
  

  useEffect(() => { runCoco() }, []);

  return (

    <div className="App">
      <Navbar ButtonHome={getHome} ButtonHistory={getHistory}/>
      {/* หน้าแรก */}
      {page === "home" && (
        <header className="App-header">

          <Webcam
            ref={webcamRef}
            muted={true}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: 640,
              height: 480,
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 8,
              width: 640,
              height: 480,
            }}
          />
          <Button
            variant="outlined"
            style={{
              position: "absolute",
              marginTop: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
            }}
            onClick={handleChangePage}
          >
            Count
          </Button>
        </header>
      )}
      {/* หน้านับ */}
      {page === "otherPage" && (
        <div className="OtherPage">
          <h1>Count Page</h1>
          <p>Object Count: {a}</p>
          <Button
            variant="outlined"
            onClick={handleChangePage}
          >
            Go Back
          </Button>
        </div>
      )}
      {/* หน้าประวัติการนับ */}
      {page === "history" && (
        <div className="History">
          <History/>
        </div>
      )}
    </div>
  );
}

export default App;
