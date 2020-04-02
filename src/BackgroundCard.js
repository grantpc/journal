import React, { useState, useEffect } from "react";
import { Paper, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import { db, storage } from "./firebase";

export default function BackgroundCard(props) {
  var body = document.getElementById("body");

  function setBackground() {
    localStorage.setItem("bg", props.image);
    body.style.backgroundImage = `url(${props.image})`;
  }

  // using Local storage to store background image
  useEffect(() => {
    const img = localStorage.getItem("bg");
    if (img) {
      body.style.backgroundImage = `url(${img})`;
    }
  }, []);

  return (
    <Card style={{ maxWidth: 275, marginTop: 10 }}>
      <CardActionArea>
        <CardMedia
          width="300px"
          component="img"
          image={props.image}
          title={props.title2}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              id="bgImg"
              variant="contained"
              style={{ marginTop: 10 }}
              onClick={setBackground}
            >
              Select
            </Button>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
