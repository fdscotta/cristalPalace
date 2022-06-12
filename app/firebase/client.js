import * as firebase from "firebase"

const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG)

!firebase.apps.length && firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

const mapUserFromFirebaseAuthToUser = (user) => {
  const { displayName, email, photoURL, uid } = user

  return {
    avatar: photoURL,
    username: displayName,
    email,
    uid,
  }
}

export const onAuthStateChanged = (onChange) => {
  return firebase.auth().onAuthStateChanged((user) => {
    const normalizedUser = user ? mapUserFromFirebaseAuthToUser(user) : null

    onChange(normalizedUser)
  })
}

export const loginWithGoogle = () => {
  const googleProvider = new firebase.auth.GoogleAuthProvider()
  return firebase.auth().signInWithPopup(googleProvider)
}

export const addPlayer = ({
  avatar,
  side,
  category,
  categoryFrom,
  playername,
  phone,
}) => {
  return db.collection("players").add({
    avatar,
    side,
    category,
    categoryFrom,
    playername,
    lastUpdate: firebase.firestore.Timestamp.fromDate(new Date()),
    phone,
  })
}

export const updatePlayer = async ({
  avatar,
  side,
  category,
  categoryFrom,
  playername,
  phone,
  id,
}) => {
  const playerRef = db.collection("players").doc(id)
  return await playerRef.update({
    avatar,
    side,
    category,
    categoryFrom,
    playername,
    lastUpdate: firebase.firestore.Timestamp.fromDate(new Date()),
    phone,
  })
}

export const getPlayer = async (id) => {
  const playerRef = db.collection("players").doc(id)
  const doc = await playerRef.get()
  if (!doc.exists) {
    return "No such document!"
  } else {
    return doc.data()
  }
}

const mapPlayerFromFirebaseToPlayerObject = (doc) => {
  const data = doc.data()
  const id = doc.id
  const { lastUpdate } = data

  return {
    ...data,
    id,
    lastUpdate: +lastUpdate.toDate(),
  }
}

export const listenLatestPlayers = (callback) => {
  return db
    .collection("players")
    .orderBy("lastUpdate", "desc")
    .limit(20)
    .onSnapshot(({ docs }) => {
      const newPlayers = docs.map(mapPlayerFromFirebaseToPlayerObject)
      callback(newPlayers)
    })
}

export const playerExist = (phone) => {
  const playersRef = db.collection("players")
  return playersRef
    .where("phone", "==", phone)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return false
      }
      return true
    })
}

export const deletePlayer = (id) => {
  return db.collection("players").doc(id).delete()
}

export const uploadImage = (file) => {
  const ref = firebase.storage().ref(`images/${file.name}`)
  const task = ref.put(file)
  return task
}
