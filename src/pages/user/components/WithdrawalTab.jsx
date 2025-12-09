import React from "react";

const WithdrawalTab = () => {
  return (
    <section
      style={{
        padding: "20px",
        backgroundColor: "#f9fafc",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        maxWidth: "500px",
        margin: "20px auto",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#0b2f5a", marginBottom: "16px" }}>
        Withdrawal Request
      </h2>

      <p style={{ marginBottom: "16px", color: "#333" }}>
        Enter your UPI ID below to simulate a withdrawal request.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const upi = e.target.upi.value.trim();
          if (!upi) {
            alert("Please enter your UPI ID!");
            return;
          }

          const randomAmount = (Math.random() * (500 - 50) + 50).toFixed(2);
          alert(
            `Withdrawal request of ₹${randomAmount} received for UPI ID: ${upi}\n\nNote: This is a demo — no actual transaction will be made.`
          );
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          name="upi"
          placeholder="Enter your UPI ID (e.g., name@upi)"
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "300px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#0b2f5a",
            color: "white",
            fontWeight: 600,
            borderRadius: "4px",
            padding: "10px 16px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Withdraw Now
        </button>
      </form>
    </section>
  );
};

export default WithdrawalTab;

