import React, { useState, useEffect } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import BarChartIcon from "@material-ui/icons/BarChart";
import LibraryBooksOutlinedIcon from "@material-ui/icons/LibraryBooksOutlined";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography
} from "@material-ui/core";
import { Link, Route } from "react-router-dom";
import { auth } from "./firebase";
import AddNewEntry from "./AddNewEntry";
import RecentEntries from "./RecentEntries";
import Entries from "./Entries";
import Statistics from "./Statistics";
import Settings from "./Settings";
import "./App.css";

export function App(props) {
  const [drawer_open, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  var body = document.getElementById("body");

  // catching auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        props.history.push("/");
      }
    });

    return unsubscribe;
  }, [props.history]);

  // using Local Storage for background image
  useEffect(() => {
    const img = localStorage.getItem("bg");
    if (img) {
      body.style.backgroundImage = `url(${img})`;
    } else {
      body.style.backgroundImage =
        "url('https://images.unsplash.com/photo-1520451214409-ba3eed10dc52?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80')";
    }
  }, []);

  // user signing out
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        alert(error.message);
      });
  };

  // catch user trying to get into app without signing in
  if (!user) {
    return <div />;
  }

  return (
    <div>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            id="app-bar-home"
            variant="h6"
            color="inherit"
            style={{ flexGrow: 1, marginLeft: "30px" }}
            onClick={() => {
              props.history.push("/app/home");
            }}
          >
            My Journal
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => {
              props.history.push("/app/home");
            }}
          >
            <HomeOutlinedIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => {
              props.history.push("/app/entries");
            }}
          >
            <LibraryBooksOutlinedIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => {
              props.history.push("/app/statistics");
            }}
          >
            <BarChartIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => {
              props.history.push("/app/settings");
            }}
          >
            <SettingsIcon />
          </IconButton>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        open={drawer_open}
        onClose={() => {
          setDrawerOpen(false);
        }}
      >
        <List>
          <ListItem
            button
            onClick={() => {
              props.history.push("/app/home");
              setDrawerOpen(false);
            }}
          >
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              props.history.push("/app/entries");
              setDrawerOpen(false);
            }}
          >
            <ListItemText primary="All of My Entries" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              props.history.push("/app/statistics");
              setDrawerOpen(false);
            }}
          >
            <ListItemText primary="My Statistics" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              props.history.push("/app/settings");
              setDrawerOpen(false);
            }}
          >
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>
      <div
        style={{
          display: "flex",
          flexWrap: "inline",
          justifyContent: "space-evenly"
        }}
      >
        <Route path="/app/home">
          <RecentEntries user={user} />
          <AddNewEntry user={user} />
        </Route>
        <Route path="/app/entries">
          <Entries user={user} />
        </Route>
        <Route path="/app/statistics">
          <Statistics user={user} />
        </Route>
        <Route path="/app/settings">
          <Settings user={user} />
        </Route>
      </div>
    </div>
  );
}
