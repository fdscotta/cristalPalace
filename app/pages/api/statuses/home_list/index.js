const timeline = [
  {
    id: "0",
    avatar:
      "https://pbs.twimg.com/profile_images/1274822387532328960/feySZs0k_reasonably_small.jpg",
    username: "Scotta Francisco",
    side: "Reves",
    category: "5ta",
    categoryFrom: "6ta",
  },
]

export default (req, res) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.send(JSON.stringify(timeline))
}
