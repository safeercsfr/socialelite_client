import { Button } from "@mui/material";
import React from "react";
import { Link, NavLink } from "react-router-dom";

const ErrorPage = () => {
  return (
    <>
      <div className="container">
        <div
          style={{
            minHeight: "85vh",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="https://www.dinersclub.pe/establecimientos/images/404.jpeg"
            alt="error"
            style={{ width: "500px", marginBottom: 20 }}
          />
          {/* <h1 className="mb-3">404 ERROR </h1> */}
          <h2 className="mb-3">PAGE NOT FOUND</h2>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button
              sx={{ marginTop: "10px" }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Back to Home page
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
