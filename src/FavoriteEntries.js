import React, { useState, useEffect } from "react";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import Image from "material-ui-image";
import {
  Button,
  List,
  IconButton,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  ListItemIcon,
  Radio
} from "@material-ui/core";
import { db, storage } from "./firebase";
import moment from "moment";
import "./App.css";

export default function FavoriteEntries(props) {
  var strSize = 250;
  const [entries, setEntries] = useState([]);
  const [trashDialog, setTrashDialog] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [favorite, setFavorite] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState({});

  // get journal entries from database, put into an object
  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(props.user.uid)
      .collection("entries")
      .orderBy("date", "desc")
      .onSnapshot(snapshot => {
        const entries = snapshot.docs.map(doc => {
          const entry = {
            title: doc.data().title,
            date: new Date(doc.data().date.seconds * 1000),
            story: doc.data().story,
            image: doc.data().image,
            favorited: doc.data().favorited,
            id: doc.id
          };
          return entry;
        });
        setEntries(entries);
      });
  }, []);

  const handleDeleteStory = () => {
    // delete the story
    db.collection("users")
      .doc(props.user.uid)
      .collection("entries")
      .doc(selectedEntry.id)
      .delete()
      .then(() => {
        // close the dialog box
        setTrashDialog(false);
        setStoryOpen(false);
      });
  };

  // update the 'favorited' property of object to 1
  const handleStarClick2 = () => {
    db.collection("users")
      .doc(props.user.uid)
      .collection("entries")
      .doc(selectedEntry.id)
      .update({ favorited: false })
      .then(() => {
        setStoryOpen(false);
      });
  };

  return (
    <div>
      <Paper
        style={{
          width: "600px",
          marginTop: "50px",
          marginBottom: "50px",
          padding: "30px"
        }}
      >
        <Typography variant="h6" color="inherit">
          Favorited Journal Entries
        </Typography>
        <List>
          {entries
            .filter(entry => {
              return entry.favorited;
            })
            .map(entry => (
              <ListItem
                button
                onClick={() => {
                  setSelectedEntry(entry);
                  setStoryOpen(true);
                }}
              >
                <ListItemText
                  primary={`${moment(entry.date).format("M/D/YY")} - ${
                    entry.title
                  }`}
                  secondary={
                    entry.story.length >= strSize
                      ? entry.story.substring(0, strSize) + "..."
                      : entry.story
                  }
                />
              </ListItem>
            ))}
        </List>
      </Paper>
      <Dialog
        open={trashDialog}
        onClose={() => {
          setTrashDialog(false);
        }}
      >
        <DialogTitle>
          Are you sure you want to delete this journal entry?
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
              setTrashDialog(false);
            }}
          >
            Go Back
          </Button>
          <Button color="secondary" autoFocus onClick={handleDeleteStory}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        scroll="paper"
        open={storyOpen}
        onClose={() => {
          setStoryOpen(false);
        }}
      >
        <DialogTitle>{selectedEntry.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{selectedEntry.story}</DialogContentText>
          {selectedEntry.image ? (
            <Image src={selectedEntry.image} aspectRatio="1/1.5" />
          ) : (
            <div />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color="inherit"
            onClick={() => {
              setStoryOpen(false);
            }}
          >
            Back
          </Button>
          <Button autoFocus color="secondary" onClick={handleStarClick2}>
            Unfavorite
          </Button>
          <IconButton color="inherit">
            <EditOutlinedIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => {
              setTrashDialog(true);
            }}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
