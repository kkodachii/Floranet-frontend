import React from "react";

export default function WasteCollection() {
  // Mock data - in a real app this would come from props or API
  const collectionTime = "7:30am";
  const collectionDate = "04/07/2025";

  // Add styles to body to prevent scrolling
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        fontFamily: "Roboto, Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          border: "2px solid rgba(0, 0, 0, 0.12)",
          textAlign: "center",
          maxWidth: "600px",
          width: "90%",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "300",
            textTransform: "uppercase",
            margin: "0 0 16px 0",
            color: "rgba(0, 0, 0, 0.87)",
            lineHeight: 1.167,
          }}
        >
          Garbage collector is on its way
        </h1>

        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "400",
            color: "rgba(0, 0, 0, 0.6)",
            margin: "0",
            lineHeight: 1.334,
          }}
        >
          {collectionTime}
        </h2>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "400",
            color: "rgba(0, 0, 0, 0.6)",
            margin: "0 0 16px 0",
            lineHeight: 1.334,
          }}
        >
          {collectionDate}
        </h2>

        <button
          style={{
            backgroundColor: "#d32f2f",
            padding: "20px 60px",
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginTop: "24px",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            textTransform: "uppercase",
            transition: "background-color 0.3s ease",
            boxShadow: "none",
            fontFamily: "Roboto, Arial, sans-serif",
            letterSpacing: "0.02857em",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#b71c1c")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#d32f2f")}
        >
          ALERT
        </button>
      </div>
    </div>
  );
}