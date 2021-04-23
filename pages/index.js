import React, { useState } from "react";
import PageLayout from "../src/PageLayout";
import Typography from "@material-ui/core/Typography";

export default function Index() {
  return (
    <PageLayout>
      <Typography variant="h1" component="h2" gutterBottom>
        Homepage
      </Typography>
    </PageLayout>
  );
}
