import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/client";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import fileDownload from "js-file-download";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CircularProgress from "@material-ui/core/CircularProgress";

import PageLayout from "../../src/PageLayout";

const group = () => {
  const router = useRouter();
  const { groupID } = router.query;
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [groupName, setGroupName] = useState(null);
  const [session, loading] = useSession();
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const interval = setInterval(getFiles, 1000);
    return () => clearInterval(interval);
  }, [groupID]);

  const getFiles = async () => {
    try {
      const path = "/api/getFiles/" + groupID;
      const filesReq = await axios.get(path);
      setFiles(filesReq.data.files);
      setGroupName(filesReq.data.name);
      if (firstLoad) setFirstLoad(false);
    } catch (error) {
      console.log(error);
      setErrorStatus(true);
      setErrorMessage("Error getting files.");
    }
  };

  const deleteFile = async (id) => {
    try {
      const filesReq = await axios.delete("/api/deleteFile", {
        data: { id: id },
      });
    } catch (error) {
      console.log(error);
      setErrorStatus(true);
      setErrorMessage("Error deleting files.");
    }
  };

  const downloadFile = async (id) => {
    try {
      const downloadFile = await axios.get(
        "/api/download/" + groupID + "/" + id,
        {
          responseType: "blob",
        }
      );
      fileDownload(downloadFile.data, downloadFile.headers.name);
    } catch (error) {
      console.log(error);
      setErrorStatus(true);
      setErrorMessage("Error downloading files.");
    }
  };

  const selectFile = (event) => {
    setFile(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("/api/uploadFile", formData, {
        headers: {
          "content-type": "multipart/form-data",
          groupID: groupID,
        },
      });
    } catch (error) {
      console.log(error);
      setErrorStatus(true);
      setErrorMessage("Error uploading files.");
    }
  };

  const handleErrorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorStatus(false);
  };

  return (
    <PageLayout>
      {firstLoad && (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box paddingTop={5}>
            <CircularProgress />
          </Box>
        </Box>
      )}
      {!firstLoad && (
        <>
          <Typography variant="h3" component="h3">
            {groupName ? groupName : "Group Name"}
          </Typography>
          <Box m={1} display="flex" alignItems="center">
            <Box m={1}>
              <Typography variant="button">
                {file ? file.name : "No File Chosen"}
              </Typography>
            </Box>
            <Box m={1}>
              <input
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={selectFile}
              />
              <label htmlFor="raised-button-file">
                <Button color="secondary" component="span" variant="contained">
                  Select File
                </Button>
              </label>
            </Box>
            <Box m={1}>
              <Button
                color="secondary"
                component="span"
                variant="contained"
                onClick={uploadFile}
              >
                <CloudUploadIcon style={{ marginRight: "2px" }} />
                <Typography variant="button">Upload</Typography>
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table aria-label="Files">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right">Name</TableCell>
                  <TableCell align="right">Type</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell component="th" scope="row">
                      <InsertDriveFileIcon />
                    </TableCell>
                    <TableCell align="right">{file.name}</TableCell>
                    <TableCell align="right">{file.mimeType}</TableCell>
                    <TableCell component="th" scope="row" padding="checkbox">
                      <Tooltip title="Delete File" aria-label="delete">
                        <IconButton onClick={() => deleteFile(file.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell component="th" scope="row" padding="checkbox">
                      <Tooltip title="Download File" aria-label="download">
                        <IconButton
                          onClick={() => {
                            downloadFile(file.id);
                          }}
                        >
                          <GetAppIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>{" "}
        </>
      )}
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
    </PageLayout>
  );
};

export default group;
