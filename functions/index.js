const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");

admin.initializeApp();

const db = admin.firestore();

/**
 * Creates a document with ID -> uid in the `Users` collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
const createProfile = (userRecord, context) => {
  const { email, uid } = userRecord;

  return db
    .collection("users")
    .doc(uid)
    .set({ email })
    .catch(console.error);
};

// setting up Twilio
const accountSid = "ACef88ba0c6c61e73e82ca24cc11a712ce";
const authToken = "4286c0a0f587f07c88233ed9b8f5dd2c";
const client = new twilio(accountSid, authToken);

// function for sending SMS
const sendSMS = (to, body) => {
  client.messages.create({
    body: body,
    to: "+1" + to,
    from: "+12243990594"
  });
};

module.exports = {
  authOnCreate: functions.auth.user().onCreate(createProfile),
  sendReminder: functions.pubsub
    .schedule("every Sunday 12:00")
    .onRun(context => {
      sendSMS(
        "6822092305",
        "Did you write in your journal this week? https://journal-3d62c.web.app"
      );
      return null;
    }),
  sendInvite: functions.https.onCall((data, context) => {
    sendSMS(data.number, data.message);
    return "Invite has been sent!";
  })
};
