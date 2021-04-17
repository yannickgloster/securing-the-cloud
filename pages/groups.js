import React, { useState } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import PageLayout from "../src/PageLayout";
import GroupsTable from "../src/GroupsTable";

export default function Groups() {
  const [dialog, setDialog] = useState(false);
  const [groupName, setGroupName] = useState("");

  const openDialog = () => {
    setDialog(true);
  };

  const cancelDialog = () => {
    setGroupName("");
    setDialog(false);
  };

  const handleNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const addGroup = () => {
    setDialog(false);
    axios.post("/api/groups/Create", {
      name: groupName,
    });
    setGroupName("");
  };

  return (
    <PageLayout>
      <Box display="flex">
        <Box flexGrow={1}>
          <Typography variant="h3" component="h3">
            Groups
          </Typography>
        </Box>
        <Box>
          <Fab color="primary" aria-label="add">
            <AddIcon onClick={openDialog} />
          </Fab>
        </Box>
      </Box>
      <GroupsTable />

      <Dialog
        open={dialog}
        onClose={cancelDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create groups to share files securily with other users.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            onChange={handleNameChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={addGroup} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}
