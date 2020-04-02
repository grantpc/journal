import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { db, storage } from "./firebase";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

export default function AddNewEntry(props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [story, setStory] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const handleSaveEntry = () => {
    // save the file to Firebase storage
    setSaving(true);
    setConfirmationOpen(false);
    if (file) {
      storage
        .ref("photos/" + file)
        .put(file)
        // get the download url
        .then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            db.collection("users")
              .doc(props.user.uid)
              .collection("entries")
              // add the title, date, story, and img to the entries collection
              .add({
                title: title,
                date: new Date(),
                story: story,
                image: downloadURL,
                favorited: false
              })
              .then(() => {
                // clear the box when done
                setTitle("");
                setDate("");
                setStory("");
                setFile(null);
                setSaving(false);
              });
          });
        });
    } else {
      console.log("you have no picture");
      db.collection("users")
        .doc(props.user.uid)
        .collection("entries")
        // add the title, date, story, and img to the entries collection
        .add({
          title: title,
          date: new Date(),
          story: story,
          image: null,
          favorited: 0
        })
        .then(() => {
          // clear the box when done
          setTitle("");
          setDate("");
          setStory("");
          setFile(null);
          setSaving(false);
        });
    }
  };

  const handleFile = e => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleClear = () => {
    setTitle("");
    setDate("");
    setStory("");
    setFile(null);
    setSaving(false);
    setDialogOpen(false);
  };

  return (
    <div>
      <Paper
        style={{
          width: "580px",
          marginTop: "50px",
          marginBottom: "50px",
          padding: "30px"
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "inline",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography variant="h6" color="inherit">
            Create a New Journal Entry
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            Clear Journal Entry
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ width: "60%" }}>
            <TextField
              style={{ marginTop: 30 }}
              placeholder={"Title"}
              fullWidth={true}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div>
            <TextField
              style={{ marginTop: 30 }}
              label="Today's Date"
              InputLabelProps={{
                shrink: true
              }}
              type="date"
              value={date}
              onChange={e => {
                setDate(e.target.value);
              }}
            />
          </div>
        </div>
        <TextField
          style={{ marginTop: 30 }}
          placeholder={"Dear Diary,"}
          fullWidth={true}
          value={story}
          multiline={true}
          rows={3}
          rowsMax={30}
          onChange={e => {
            setStory(e.target.value);
          }}
        />
        <div
          style={{
            display: "flex",
            flexWrap: "inline",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
            {file && (
              <Typography style={{ marginRight: 20 }}>{file.name}</Typography>
            )}
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload a photo
              <input
                type="file"
                onChange={handleFile}
                style={{ display: "none" }}
              />
            </Button>
          </div>
          <div style={{ position: "relative" }}>
            <Button
              style={{ marginTop: 20 }}
              color="primary"
              variant="contained"
              autoFocus
              onClick={() => {
                setConfirmationOpen(true);
              }}
            >
              Save Entry
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
        </div>
      </Paper>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
      >
        <DialogTitle>
          Are you sure you want to delete your masterpiece?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you delete the content then you won't be able to get it back. Do
            you still want to procede with this action?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color="inherit"
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            Go Back
          </Button>
          <Button color="secondary" autoFocus onClick={handleClear}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmationOpen}
        onClose={() => {
          setConfirmationOpen(false);
        }}
      >
        <DialogTitle>Are you ready to submit your masterpiece?</DialogTitle>
        <DialogActions>
          <Button
            autoFocus
            color="inherit"
            onClick={() => {
              setConfirmationOpen(false);
            }}
          >
            Go Back
          </Button>
          <Button color="primary" autoFocus onClick={handleSaveEntry}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
