const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require("./to-do-list-peyton-firebase-adminsdk-r65k3-e786ec7616.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://to-do-list-peyton.firebaseio.com",
  storageBucket: "to-do-list-peyton.appspot.com"
});
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true }));

app.post('/user', async (req, res) => {
  try {
      let user = req.body;
      await admin.firestore().collection("items").add(user);
      return res.status(200).send('User Added');
  } catch (error) {
      return res.status(500).send(error);
  }
});

app.get('/users', async (req, res) => {
  try {
      let users = await admin.firestore().collection("items").get();
      let snapshot = users.docs.map(doc => doc.data());
      return res.status(200).send(snapshot);
  } catch (error) {
      return res.status(500).send(error);
  }
  
});

exports.api = functions.https.onRequest(app);