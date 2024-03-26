import React from "react";
import ProgressBar from "./widgets/ProgressBar.tsx";
import Calendar from "react-calendar";
import "./Body.css";

interface Props {
  gpa: number;
  hoursCompleted: number;
  hoursNeeded: number;
}

function Body(prop: Props) {
  return (
    <div id="Body" className="container text-center bg-secondary">
      <div className="row">
        <div className="col-5">
          <div className="row" style={{ height: "50%" }}>
            <Calendar />
            <div className="col-6">Quick Info Block</div>
          </div>
          <div className="row">
            <div className="col-12">List View</div>
          </div>
        </div>
        <div className="col-5">
          <div className="row" style={{ height: "50%" }}>
            <div className="col-6">Plan</div>
            <div className="col-6">Advisor</div>
          </div>
          <div className="row">
            <div className="col-6">Resources</div>
            <div className="col-6">Other Menu</div>
          </div>
        </div>
        <div className="col-2">
          <ProgressBar val={(prop.gpa / 4) * 100} text={"GPA: " + prop.gpa} />
          <ProgressBar
            val={
              (prop.hoursCompleted / (prop.hoursCompleted + prop.hoursNeeded)) *
              100
            }
            text={"Degree Progress"}
          />
        </div>
      </div>
    </div>
  );
}

export default Body;
