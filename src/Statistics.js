import React, { useState, useEffect } from "react";
import MenuIcon from "@material-ui/icons/Menu";
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
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { db, storage } from "./firebase";
import { Line } from "react-chartjs-2";
import moment from "moment";

export default function Statistics(props) {
  const [entries, setEntries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [dataSets, setDataSets] = useState([]);
  const [avgSet, setAvgSet] = useState([]);

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
            id: doc.id
          };
          return entry;
        });
        setEntries(entries);
      });
  }, []);

  // make datasets for line graph
  useEffect(() => {
    //get and display labels
    const lbls = entries.map(entry => {
      return moment(entry.date).format("M/DD/YY");
    });
    setLabels(lbls);

    //create Holder for Data Sets
    const sets = [];

    //create Words object
    const words = {
      label: "Word Count",
      data: entries.map(e => WordCount(e.story)),
      borderColor: "red",
      borderWidth: 1,
      id: "y-axis-1"
    };
    sets.push(words);

    //set State variable
    setDataSets(sets);
  }, [entries]);

  // make array of word count to take the average
  useEffect(() => {
    const avgSet = [];
    entries.map(entry => {
      const elem = WordCount(entry.story);
      avgSet.push(elem);
    });
  }, [entries]);

  function WordCount(str) {
    if (str) {
      return str.split(" ").length;
    } else {
      return 0;
    }
  }

  return (
    <div>
      <Paper style={{ width: "600px", marginTop: "50px", padding: "30px" }}>
        <Typography variant="h6" color="inherit">
          Your Word Count Trend
        </Typography>
        <Line
          data={{
            labels: labels,
            datasets: dataSets
          }}
        />
        <Typography variant="h6" color="inherit">
          {`Average Word Count per Entry: ${"idk"}`}
        </Typography>
      </Paper>

      <Paper
        style={{
          width: "600px",
          marginTop: "50px",
          marginBottom: "50px",
          padding: "30px"
        }}
      >
        <Typography variant="h6" color="inherit">
          Your Data
        </Typography>
        <TableContainer
          component={Paper}
          style={{
            width: "100%",
            maxWidth: 600,
            marginTop: 30,
            marginBottom: 30
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="left">Day of the Week</TableCell>
                <TableCell align="left">Time of Day</TableCell>
                <TableCell align="left">Word Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map(row => (
                <TableRow>
                  <TableCell>{moment(row.date).format("M/D/YY")}</TableCell>
                  <TableCell align="left">
                    {moment(row.date).format("dddd")}
                  </TableCell>
                  <TableCell align="left">
                    {moment(row.date).format("h:mm a")}
                  </TableCell>
                  <TableCell align="left">{WordCount(row.story)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
