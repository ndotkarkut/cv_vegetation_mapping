const admin = require("firebase-admin");
const firebaseApp = require("./firebase-config");
const db = admin.firestore();
const collection = db.collection("panoramas");

const axios = require("axios");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});

app.use(express.json());
app.use(cors('*'));

app.get("/allPanos", async (req, res, next) => {
  const panoCollectionRef = await collection.get();

  //   console.log(panoCollectionRef);

  const panoramas = [];
  panoCollectionRef.forEach((doc) => {
    console.log(doc.id);
    panoramas.push(doc.id);
  });

  return res.status(200).json({
    panoramas,
  });
});

// Create a document in firebase corresponding to the panoId if it does not exist already
app.post("/:panoId", async (req, res, next) => {
  const panoId = req.params.panoId;
  const {
    data: { location },
  } = await axios.get(
    `https://maps.googleapis.com/maps/api/streetview/metadata?pano=${"ge0i7dZ5V5xR3cu9s2o3mg"}&key=${
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    }`
  );
  console.log(location);

  const pano = await collection.doc(panoId).get();

  if (pano.exists) {
    return res.status(200).json({
      message: "Panorama already exists. No action taken.",
    });
  }

  const onCreation = await pano.ref.create({});
  console.log(onCreation);

  return res.status(200).json({
    message: "Panorama created.",
  });
});

// Getting pano locations
app.get("/:panoId", async (req, res, next) => {
  const panoId = req.params.panoId;

  const pano = await collection.doc(panoId).get();
  const panoData = pano.data();

  if (!pano.exists) {
    return res.status(404).json({
      message: "Pano not found",
    });
  }

  if (!panoData.location) {
    const {
      data: { location },
    } = await axios.get(
      `https://maps.googleapis.com/maps/api/streetview/metadata?pano=${panoId}&key=${
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      }`
    );
    console.log(location);

    const updatedDoc = await pano.ref.update({ location });
    console.log(updatedDoc);

    console.log("Posting new information to database");
    return res.status(200).json({ location });
  }

  console.log("Retrieving data that is already there.");
  return res.status(200).json({
    location: panoData.location,
  });
});

// Update pano locations based on user submitting from dragging in client
app.put("/:panoId", async (req, res, next) => {
  const panoId = req.params.panoId;

  const { location } = req.body;

  const pano = await collection.doc(panoId).get();

  if (!pano.exists) {
    return res.status(404).json({
      message: "Pano not found",
    });
  }

  const updatedDoc = await pano.ref.update({ location });
  console.log(updatedDoc);

  console.log("Updating panoLocation by given user input");
  return res.status(200).json({ location });
});
