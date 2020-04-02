import React, { useState, useEffect } from "react";
import "./App.css";
import FavoriteEntries from "./FavoriteEntries";
import AllEntries from "./AllEntries";

export default function Entries(props) {
  return (
    <div>
      <FavoriteEntries user={props.user} />
      <AllEntries user={props.user} />
    </div>
  );
}
