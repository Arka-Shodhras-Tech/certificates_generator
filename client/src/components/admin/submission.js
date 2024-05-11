import { useToast } from "@chakra-ui/react";
import axios from 'axios';
import jsPDF from 'jspdf';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../student/student.css';
const Submission = ({ display, stop }) => {
  const nav = useNavigate();
  const [check, SetCheck] = useState("");
  const [file, sfile] = useState()
  const [name, SetName] = useState("");
  const [regd, SetRegd] = useState("");
  const [year, SetYear] = useState("");
  const [branch, Setbranch] = useState("");
  const [email, SetEmail] = useState("");
  const [generatedPDF, setGeneratedPDF] = useState()
  const [num, snum] = useState(0);
  const toast = useToast();
  const Handleclick = async () => {
    try {
      const formData = new FormData();
      const pdf = new jsPDF();
      const name = "John Doe";
      const course = "JavaScript Programming";
      const date = "May 10, 2024";

      pdf.setFontSize(16);
      pdf.text('Certificate of Completion', 105, 10, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`This is to certify that ${name} has completed the course ${course}`, 20, 30);
      pdf.text(`Date of Approval: ${date}`, 20, 50);
      const certificateBlob = pdf.output('blob');
      const certificateUrl = URL.createObjectURL(certificateBlob);
      window.open(certificateUrl, '_blank');

      const pdf1 = pdf.output('blob')
      console.log(pdf1)
      if (pdf1) {
        formData.append("file", pdf1);
        await axios.post(process.env.REACT_APP_database + "/storepdf", formData)
          .then((res) => console.log(res)).catch((e) => console.log(e))
      }
      else {
        alert("pdf error")
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };
  const Stop = () => {
    stop("true");
  }

  return (
    display &&
    <div className="register-body">
      <div className="register-container">
        <div className="register-header">
          <h2>Certificate Generation Form</h2>
        </div>
        <div className="form-group">
          <h6><b><marquee>{check}</marquee></b></h6>
        </div>
        <div className="register-form">
          {/* <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              name="name"
              value={name}
              onChange={(e) => SetName(e.target.value.toUpperCase())}
            />
          </div> */}
          {/* <div className="form-group">
            <label htmlFor="email">Course</label>
            <input
              type="text"
              id="course"
              placeholder="Course"
              name="Course"
              value={email}
              onChange={(e) => SetEmail(e.target.value)}
            />
          </div> */}
          <div>
            <input type="file" accept="pdf" onChange={(e) => sfile(e.target.files[0])} />
          </div>
          <div className="form-group" style={{ display: "flex", justifyContent: "space-evenly" }}>
            {/* <button type="button" onClick={Stop}>
              <b>Back</b>
            </button> */}
            <button type="button" onClick={Handleclick}>
              <b>Generate</b>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submission;
