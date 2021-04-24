import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Chip from "@material-ui/core/Chip";
import VisibilityIcon from "@material-ui/icons/Visibility";

import Link from "../src/Link";

const useStyles = makeStyles((theme) => ({
  emails: {
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function GroupsTable() {
  const classes = useStyles();
  const [session, loading] = useSession();
  const [groups, setGroups] = useState([]);
  const [addUser, setAddUser] = useState("");
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [groupSelected, setGroupSelected] = useState(null);
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    try {
      const groupsReq = await axios.get("/api/groups/all");
      setGroups(groupsReq.data);
    } catch (error) {
      console.log(error);
      setErrorStatus(true);
      setErrorMessage("Error getting groups.");
    }
  };

  const deleteGroup = async (group) => {
    try {
      const groupDel = await axios.delete("/api/groups/delete", {
        data: group,
      });
      getGroups();
    } catch (error) {
      console.log(error);
      setErrorStatus(true);
      setErrorMessage("Error deleting group.");
    }
  };

  const openAddUserDialog = (group) => {
    setGroupSelected(group);
    setAddUserDialog(true);
  };

  const handleEmailInput = (event) => {
    setAddUser(event.target.value);
  };

  const closeAddUser = () => {
    setAddUser("");
    setGroupSelected(null);
    setAddUserDialog(false);
  };

  const addUserToGroup = async () => {
    try {
      const groupAddUser = await axios
        .put("/api/groups/addUser", {
          group: groupSelected,
          userEmail: addUser,
        })
        .catch((error) => {
          if (error.response) {
            setErrorStatus(true);
            setErrorMessage(error.response.data);
          }
        });
      getGroups();
      closeAddUser();
    } catch (error) {
      console.log(error);
      setErrorStatus(true);
      setErrorMessage("Error adding user to group.");
    }
  };

  const handleErrorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorStatus(false);
  };

  const removeUser = async (user, group) => {
    try {
      const removeUser = await axios.delete("/api/groups/removeUser", {
        data: {
          user: user,
          group: group,
        },
      });
      getGroups();
    } catch (error) {
      console.log(error);
      setErrorStatus(true);
      setErrorMessage("Error removing user.");
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="Groups">
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="right">Users</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow
                key={group.id}
                // Get onhover vibe
              >
                <TableCell
                  align="left"
                  onClick={() => {
                    console.log("Clicked " + group.name);
                  }}
                >
                  {group.name}
                </TableCell>
                <TableCell align="right" className={classes.emails}>
                  {group.users.map((user, index) => (
                    <Chip
                      key={index}
                      label={user.email}
                      onDelete={
                        group.owner.id == user.id
                          ? null
                          : () => {
                              removeUser(user, group);
                            }
                      }
                      color="primary"
                    />
                  ))}
                </TableCell>
                <TableCell component="th" scope="row" padding="checkbox">
                  <Tooltip
                    title="Add User to Group"
                    aria-label="add user to group"
                  >
                    <IconButton
                      onClick={() =>
                        openAddUserDialog({
                          id: group.id,
                          folderID: group.folderID,
                        })
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell component="th" scope="row" padding="checkbox">
                  <Tooltip title="Delete" aria-label="delete">
                    <IconButton
                      onClick={() =>
                        deleteGroup({
                          id: group.id,
                          folderID: group.folderID,
                        })
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell component="th" scope="row" padding="checkbox">
                  <Tooltip title="View" aria-label="view">
                    <IconButton as={Link} href={"/group/" + group.id}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={addUserDialog}
        onClose={closeAddUser}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add User to Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a user by email to the group.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email"
            type="email"
            onChange={handleEmailInput}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddUser} color="primary">
            Cancel
          </Button>
          <Button onClick={addUserToGroup} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={errorStatus}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleErrorClose}
          severity="error"
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
