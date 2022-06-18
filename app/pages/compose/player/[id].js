import { useState, useEffect } from "react"
import {
  Button,
  Stack,
  VStack,
  Input,
  Select,
  Container,
  Heading,
  Wrap,
  Alert,
  AlertIcon,
  Box,
} from "@chakra-ui/react"
import Home from "components/Icons/Home"
import Link from "next/link"
import {
  addPlayer,
  getPlayer,
  playerExist,
  updatePlayer,
  uploadImage,
} from "firebase/client"
import { useRouter } from "next/router"
import Head from "next/head"

const COMPOSE_STATES = {
  USER_NOT_KNOWN: 0,
  LOADING: 1,
  SUCCESS: 2,
  ERROR: -1,
}

export default function ComposePlayer() {
  const [playername, setPlayername] = useState("")
  const [category, setCategory] = useState(0)
  const [categoryFrom, setCategoryFrom] = useState(0)
  const [side, setSide] = useState("")
  const [phone, setPhone] = useState("")
  const [status, setStatus] = useState(COMPOSE_STATES.USER_NOT_KNOWN)
  const [avatar, setAvatar] = useState(null)
  const [task, setTask] = useState(null)
  const [pExist, setPExist] = useState(false)
  const [newPlayer, setNewPlayer] = useState(false)
  const router = useRouter()

  const { id } = router.query

  useEffect(() => {
    if (id !== "new" && id !== undefined) {
      getPlayer(id).then((player) => {
        setPlayername(player.playername)
        setCategory(player.category)
        setCategoryFrom(player.categoryFrom)
        setSide(player.side)
        setPhone(player.phone)
        setAvatar(player.avatar)
        setNewPlayer(false)
      })
    } else {
      setNewPlayer(true)
    }
  }, [id])

  useEffect(() => {
    if (task) {
      const onProgress = () => {}
      const onError = () => {}
      const onComplete = () => {
        task.snapshot.ref.getDownloadURL().then(setAvatar)
      }

      task.on("state_changed", onProgress, onError, onComplete)
    }
  }, [task])

  const handleNameChange = (event) => {
    const { value } = event.target
    setPlayername(value)
  }

  const handleCategoryChange = (event) => {
    const { value } = event.target
    setCategory(value)
  }

  const handleSideChange = (event) => {
    const { value } = event.target
    setSide(value)
  }

  const handlePhoneChange = (event) => {
    const { value } = event.target
    setPhone(value)
  }
  const handleUploadImage = (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    const task = uploadImage(file)
    setTask(task)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    playerExist(phone).then((exists) => {
      if (exists) {
        setStatus(COMPOSE_STATES.ERROR)
        setPExist(true)
      } else {
        setStatus(COMPOSE_STATES.LOADING)
        setPExist(false)
        addPlayer({
          avatar,
          playername,
          side,
          category,
          categoryFrom: category,
          phone,
        })
          .then(() => {
            router.push("/home")
          })
          .catch((err) => {
            console.error(err)
            setStatus(COMPOSE_STATES.ERROR)
          })
      }
    })
  }

  const updataPlayer = (cat = category, catFrom = categoryFrom) => {
    updatePlayer({
      avatar,
      playername,
      side,
      category: cat,
      categoryFrom: catFrom,
      phone,
      id,
    })
      .then(() => {
        router.push("/home")
      })
      .catch((err) => {
        console.error(err)
        setStatus(COMPOSE_STATES.ERROR)
      })
  }

  const handleUpdatePlayer = (event) => {
    event.preventDefault()
    updataPlayer()
  }

  const handleLevelUp = async (event) => {
    event.preventDefault()
    if (category > 1) {
      const newCategory = parseInt(category) - 1
      updataPlayer(newCategory, category)
    }
  }

  const handleLevelDown = async (event) => {
    event.preventDefault()
    if (category < 8) {
      const newCategory = parseInt(category) + 1
      updataPlayer(newCategory, category)
    }
  }

  const isButtonDisabled =
    !playername.length ||
    !side.length ||
    !category > 0 ||
    !phone > 0 ||
    status === COMPOSE_STATES.LOADING

  return (
    <>
      <Head>
        <title>Crear un Jugador</title>
      </Head>
      <VStack>
        <Heading as="h1">Crear un Jugador</Heading>
        <Container>
          {pExist && (
            <Alert status="error">
              <AlertIcon />
              El numero de telefono esta en uso
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Input
                onChange={handleNameChange}
                placeholder="Nombre"
                value={playername}
              ></Input>

              <Select value={category} onChange={handleCategoryChange}>
                <option value="">Seleccione un Categoria</option>
                <option value="8">8va</option>
                <option value="7">7ma</option>
                <option value="5">5ta</option>
                <option value="6">6ta</option>
                <option value="4">4ta</option>
                <option value="3">3ra</option>
                <option value="2">2da</option>
                <option value="1">1ra</option>
              </Select>

              <Select value={side} onChange={handleSideChange}>
                <option value="">Seleccione un Categoria</option>
                <option value="reves">Reves</option>
                <option value="drive">Drive</option>
              </Select>

              <Input
                onChange={handlePhoneChange}
                placeholder="Telefono"
                value={phone}
              ></Input>

              {avatar ? (
                <section className="remove-img">
                  <Button onClick={() => setAvatar(null)}>x</Button>
                  <img src={avatar} />
                </section>
              ) : (
                <Input type="file" onChange={handleUploadImage} />
              )}

              <Button
                colorScheme="blue"
                size="md"
                disabled={isButtonDisabled}
                onClick={
                  id !== "new" && id !== undefined
                    ? handleUpdatePlayer
                    : handleSubmit
                }
              >
                +
              </Button>
              {!newPlayer && (
                <>
                  {category > 1 && (
                    <Button
                      colorScheme="blue"
                      size="md"
                      onClick={handleLevelUp}
                    >
                      Acender
                    </Button>
                  )}
                  {category < 8 && (
                    <Button
                      colorScheme="blue"
                      size="md"
                      onClick={handleLevelDown}
                    >
                      Bajar Categoria
                    </Button>
                  )}
                </>
              )}
            </Stack>
          </form>
        </Container>
        <Wrap spacing="30px" justify="center">
          <Box p="6">
            <Link href="/home">
              <a>
                <Home width={32} height={32} stroke="#09f" />
              </a>
            </Link>
          </Box>
        </Wrap>
      </VStack>
    </>
  )
}
