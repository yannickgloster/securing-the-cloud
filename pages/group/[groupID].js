import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/client";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
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

import PageLayout from "../../src/PageLayout";

const group = () => {
  const router = useRouter();
  const { groupID } = router.query;
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [groupName, setGroupName] = useState(null);
  const [session, loading] = useSession();

  useEffect(() => {
    const interval = setInterval(getFiles, 1000);
    return () => clearInterval(interval);
  }, [groupID]);

  const getFiles = async () => {
    try {
      const path = "/api/GetFiles/" + groupID;
      const filesReq = await axios.get(path);
      setFiles(filesReq.data.files);
      setGroupName(filesReq.data.name);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFile = async (id) => {
    try {
      const filesReq = await axios.delete("/api/DeleteFile", {
        data: { id: id },
      });
    } catch (error) {
      console.log(error);
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
    }
  };

  const selectFile = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("/api/UploadFiles", formData, {
        headers: {
          "content-type": "multipart/form-data",
          groupID: groupID,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PageLayout>
      <Typography variant="h3" component="h3">
        {groupName ? groupName : "Group Name"}
      </Typography>
      <input
        style={{ display: "none" }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={selectFile}
      />
      <label htmlFor="raised-button-file">
        <Button color="secondary" component="span" variant="contained">
          Select
        </Button>
      </label>
      <Button
        color="secondary"
        component="span"
        variant="contained"
        onClick={uploadFile}
      >
        Test Upload
      </Button>
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
                  <IconButton onClick={() => deleteFile(file.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" padding="checkbox">
                  <IconButton
                    onClick={() => {
                      downloadFile(file.id);
                    }}
                  >
                    <GetAppIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageLayout>
  );
};

export default group;
