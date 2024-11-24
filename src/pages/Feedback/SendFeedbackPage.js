import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Thay useHistory bằng useNavigate

const SendFeedbackPage = () => {
  const [rating] = useState(5);
  const [comment, setComment] = useState("");
  const navigate = useNavigate(); // Sử dụng useNavigate thay cho useHistory

  const handleSendFeedback = () => {
    axios
      .post("https://bms-fs-api.azurewebsites.net/api/Feedback/send-feedback", {
        rating: rating,
        comment: comment,
      })
      .then((response) => {
        console.log("Feedback sent successfully", response.data);
        navigate("/"); // Điều hướng trở lại trang chủ sau khi gửi feedback thành công
      })
      .catch((error) => {
        console.error("Error sending feedback", error);
      });
  };

  return (
    <div className="send-feedback-page">
      <h1>Send Your Feedback</h1>
      <div className="feedback-form">
        <label>
          Comment:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </label>
        <button onClick={handleSendFeedback}>Submit Feedback</button>
      </div>

      <style>{`
        .send-feedback-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 20px;
        }
        .feedback-form {
          display: flex;
          flex-direction: column;
          width: 300px;
        }
        .feedback-form label {
          margin-bottom: 10px;
        }
        .feedback-form input, .feedback-form textarea {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border-radius: 5px;
          border: 1px solid #ddd;
        }
        button {
          padding: 10px;
          background-color: #00cc69;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #00994c;
        }
      `}</style>
    </div>
  );
};

export default SendFeedbackPage;
