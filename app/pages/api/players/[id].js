import { firestore } from "firebase/admin"

export default (request, response) => {
  const { query } = request
  const { id } = query

  firestore
    .collection("players")
    .doc(id)
    .get()
    .then((doc) => {
      const data = doc.data()
      const id = doc.id
      const { lastUpdate } = data

      response.json({
        ...data,
        id,
        lastUpdate: +lastUpdate.toDate(),
      })
    })
    .catch(() => {
      response.status(404).end()
    })
}
