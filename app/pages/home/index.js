import { useEffect, useState } from "react"
import Player from "components/Player"
import useUser from "hooks/useUser"
import { listenLatestPlayers } from "firebase/client"
import Link from "next/link"
import Create from "components/Icons/Create"
import Home from "components/Icons/Home"
import Head from "next/head"
import {
  VStack,
  Heading,
  Container,
  Box,
  Flex,
  Spacer,
  Wrap,
} from "@chakra-ui/react"

export default function HomePage() {
  const [playerList, setPlayerList] = useState([])
  const user = useUser()

  useEffect(() => {
    let unsubscribe
    if (user) {
      unsubscribe = listenLatestPlayers(setPlayerList)
    }
    return () => unsubscribe && unsubscribe()
  }, [user])

  return (
    <>
      <Head>
        <title>Inicio / Players</title>
      </Head>
      <VStack>
        <Heading as="h1">Lista de Jugadores</Heading>
        <Container>
          {playerList.length > 0 ? (
            playerList.map(
              ({
                lastUpdate,
                id,
                playername,
                avatar,
                category,
                categoryFrom,
                side,
                phone,
              }) => (
                <div key={id}>
                  <Player
                    avatar={!avatar ? "/defaultAvatar.jpg" : avatar}
                    lastUpdate={lastUpdate}
                    id={id}
                    key={id}
                    category={category}
                    categoryFrom={categoryFrom}
                    playername={playername}
                    side={side}
                    phone={phone}
                  />
                </div>
              )
            )
          ) : (
            <Wrap spacing="30px" justify="center">
              <Box>
                <strong>No hay jugadores cargados</strong>
              </Box>
            </Wrap>
          )}
        </Container>
        {user && (
          <Container>
            <Flex>
              <Box p="6" marginLeft="20px">
                <Link href="/home">
                  <a>
                    <Home width={32} height={32} stroke="#09f" />
                  </a>
                </Link>
              </Box>
              <Spacer />
              <Box p="6" marginRight="20px">
                <Link href="/compose/player/new">
                  <a>
                    <Create width={32} height={32} stroke="#09f" />
                  </a>
                </Link>
              </Box>
            </Flex>
          </Container>
        )}
      </VStack>
    </>
  )
}
