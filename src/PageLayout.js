import React from "react";

import Container from "@material-ui/core/Container";

import NavBar from "../src/NavBar";

export default function PageLayout(props) {
  return (
    <>
      <NavBar />
      <Container maxWidth="md" style={{ padding: 5 }}>
        {props.children}
      </Container>
    </>
  );
}
