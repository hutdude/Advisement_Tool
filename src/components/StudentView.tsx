import React from "react";
import Header from "./Header.tsx";
import Body from "./Body.tsx";
import Footer from "./Footer.tsx";
import "bootstrap/dist/css/bootstrap.css";
import "./StudentView.css";

function StudentView() {
  // temp data structure to hold student info
  let studentInfo = new Map();

  studentInfo.set("major", "Software Engineering");
  studentInfo.set("classification", "Senior");
  studentInfo.set("gpa", 2.5);
  studentInfo.set("hoursCompleted", 110);
  studentInfo.set("hoursNeeded", 444);

  return (
    <div className="container-fluid">
      <div className="row">
        <Header
          major={studentInfo.get("major")}
          classification={studentInfo.get("classification")}
        />

        <Body
          gpa={studentInfo.get("gpa")}
          hoursCompleted={studentInfo.get("hoursCompleted")}
          hoursNeeded={studentInfo.get("hoursNeeded")}
        />

        <Footer />
      </div>
    </div>
  );
}

export default StudentView;
