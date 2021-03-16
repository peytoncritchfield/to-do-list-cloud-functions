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

app.post('/task', async (req, res) => {
  try {
      let task = req.body;

      await admin.firestore().collection("items").add(task)
      .then((addedTask) => {
        admin.firestore().collection("items").doc(addedTask.id).update({
          id: addedTask.id
        })
      });

      return res.status(200).send('Task Added');
  } catch (error) {
      return res.status(500).send(error);
  }
});

app.get('/tasks', async (req, res) => {
  try {
      let tasks = await admin.firestore().collection("items").get();
      let snapshot = tasks.docs.map(doc => doc.data());
      return res.status(200).send(snapshot);
  } catch (error) {
      return res.status(500).send(error);
  }
});

app.get('/task', async (req, res) => {
  try {
      let id = req.query.id;
      let task = await admin.firestore().collection("items").doc(id).get();
      return res.status(200).send(task.data());
  } catch (error) {
      return res.status(500).send(error);
  }
});

app.delete('/task', async (req, res) => {
  try {
      let id = req.query.id;
      let task = await admin.firestore().collection("items").doc(id).delete();
      return res.status(200).send(task.data());
  } catch (error) {
      return res.status(500).send(error);
  }
});

app.patch('/task', async (req, res) => {
  try {
      let id = req.query.id;
      let updatedTask = req.body;

      let task = await admin.firestore().collection("items").doc(id).update(updatedTask);
      return res.status(200).send('success');
  } catch (error) {
      return res.status(500).send(error);
  }
});

exports.api = functions.https.onRequest(app);