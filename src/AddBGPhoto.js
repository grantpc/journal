import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { db, storage } from "./firebase";
// import uuid from "node-uuid";

export default function AddBGPhoto(props) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSavePhoto = () => {
    // save the file to Firebase storage
    setSaving(true);
    storage
      .ref("photos/" + file)
      .put(file)
      // get the download url
      .then(snapshot => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
          // save the title and download url to firebase
          db.collection("users")
            .doc(props.user.uid)
            .collection("bg_images")
            .add({ title: title, image: downloadURL })
            .then(() => {
              // close the dialog box when done
              setTitle("");
              setFile(null);
              setSaving(false);
              props.onClose();
            });
        });
      });
  };

  const handleFile = e => {
    const file = e.target.files[0];
    setFile(file);
  };

  return (
    <Dialog open={props.open} maxWidth="sm" fullWidth onClose={props.onClose}>
      <DialogTitle>Add a Background Photo</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth="true"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
          }}
        ></TextField>
        <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
          {file && (
            <Typography style={{ marginRight: 20 }}>{file.name}</Typography>
          )}
          <Button variant="contained" component="label">
            Upload a File
            <input
              type="file"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={props.onClose}>
          Cancel
        </Button>
        <div style={{ position: "relative" }}>
          <Button
            color="primary"
            variant="contained"
            autoFocus
            onClick={handleSavePhoto}
          >
            Save
          </Button>
          {saving && (
            <CircularProgress
              color="secondary"
              size={24}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: -12,
                marginLeft: -12
              }}
            />
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
}
