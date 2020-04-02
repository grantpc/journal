import React, { useState, useEffect } from "react";
import { Paper, Typography, Button, TextField } from "@material-ui/core";
import BackgroundCard from "./BackgroundCard";
import { db, snapshotToArray, functions } from "./firebase";
import AddBGPhoto from "./AddBGPhoto";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

export default function Settings(props) {
  const [photoDialog, setPhotoDialog] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [number, setPhoneNumber] = useState("");
  const [message, setMessage] = useState(
    "Hey! Did you write in your journal this week? If not, check out this really cool digital journal app 👉 https://journal-3d62c.web.app"
  );
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [personalPhone, setPersonalPhone] = useState("");

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(props.user.uid)
      .collection("bg_images")
      .onSnapshot(snapshot => {
        const updated_photos = snapshotToArray(snapshot);
        setPhotos(updated_photos);
      });

    return unsubscribe;
  }, [props]);

  const handleSendInvite = () => {
    // Setting up connection to Firebase and importing function "sendInvite"
    const sendInvite = functions.httpsCallable("sendInvite");

    sendInvite({ number: number, message: message }).then(function(result) {
      setPhoneNumber("Message has been sent!");
      setMessage("");
    });
  };

  return (
    <div>
      <Paper style={{ width: "900px", marginTop: "50px", padding: "30px" }}>
        <Typography variant="h6" color="inherit">
          Select Your Background Image
        </Typography>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-evenly"
          }}
        >
          <BackgroundCard
            title2="Default Photo"
            title="Peaceful Valley"
            image="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1653&q=80"
          />
          <BackgroundCard
            title2="Default Photo"
            title="Misty Forest"
            image="https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2200&q=80"
          />
          <BackgroundCard
            title2="Default Photo"
            title="Fruit Market"
            image="https://images.unsplash.com/photo-1520451214409-ba3eed10dc52?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
          />
          {photos.map(p => {
            return (
              <BackgroundCard
                image={p.image}
                title2="Your uploaded photo"
                title={p.title}
              />
            );
          })}
        </div>
        <div>
          <Button
            variant="contained"
            color="inherit"
            style={{ marginTop: 20, marginLeft: 20 }}
            onClick={() => {
              setPhotoDialog(true);
            }}
            startIcon={<CloudUploadIcon />}
          >
            ADD PHOTO
          </Button>
          <AddBGPhoto
            open={photoDialog}
            onClose={() => {
              setPhotoDialog(false);
            }}
            user={props.user}
          />
        </div>
      </Paper>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between"
        }}
      >
        <Paper
          style={{
            width: "300px",
            marginTop: "50px",
            marginBottom: "50px",
            padding: "30px"
          }}
        >
          <Typography variant="h6">Invite User</Typography>
          <Typography style={{ marginTop: 20 }}>Phone Number</Typography>
          <TextField
            fullWidth
            value={number}
            onChange={e => setPhoneNumber(e.target.value)}
          />
          <Typography style={{ marginTop: 20 }}>Message:</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <Button
            onClick={handleSendInvite}
            variant="outlined"
            color="primary"
            style={{ marginTop: 20 }}
          >
            Send Message
          </Button>
        </Paper>
        <Paper
          style={{
            width: "500px",
            marginTop: "50px",
            marginBottom: "50px",
            padding: "30px"
          }}
        >
          <Typography variant="h6">Your Text Notifications</Typography>
          <Typography style={{ marginTop: 20 }}>
            What day would you like to receive text reminders to write in your
            journal?
          </Typography>
          <TextField
            fullWidth
            placeholder="Sunday, Monday, etc."
            value={day}
            onChange={e => setDay(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap"
            }}
          >
            <div>
              <Typography style={{ marginTop: 20 }}>
                What time of day?
              </Typography>
              <TextField
                placeholder="Military time"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
            <div style={{ marginLeft: 40 }}>
              <Typography style={{ marginTop: 20 }}>
                Your phone number
              </Typography>
              <TextField
                value={personalPhone}
                onChange={e => setPersonalPhone(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outlined" color="primary" style={{ marginTop: 20 }}>
            Save Preferences
          </Button>
        </Paper>
      </div>
    </div>
  );
}
