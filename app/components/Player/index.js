import Avatar from "components/Avatar"
import { useRouter } from "next/router"
import {
  Stack,
  useColorModeValue,
  Flex,
  Box,
  Center,
  Spacer,
} from "@chakra-ui/react"
import { DeleteIcon } from "@chakra-ui/icons"
import { deletePlayer } from "firebase/client"

export default function Player({
  avatar,
  playername,
  side,
  category,
  categoryFrom,
  id,
  phone,
  lastUpdate,
}) {
  const router = useRouter()

  const handleArticleClick = (e) => {
    e.preventDefault()
    router.push("/compose/player/[id]", `/compose/player/${id}`)
  }

  const handleDeleteClick = (e) => {
    e.preventDefault()
    deletePlayer(id)
  }

  const daysFromCreation = (lastUpdate) => {
    const date = new Date(lastUpdate)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24))
    return diffDays
  }

  return (
    <>
      <Stack
        borderWidth="1px"
        borderRadius="lg"
        direction={{ base: "column", md: "row" }}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        padding={4}
      >
        <Flex onClick={handleArticleClick}>
          <Center p="4">
            <Avatar alt={playername} src={avatar} />
          </Center>
          <Spacer />
          <Box>
            <header>
              <strong>{playername}</strong>
              <span> · </span>
              <span>{side}</span>
            </header>
            <p>Categoria: {category}</p>
            <p>Telefono: {phone}</p>
            {categoryFrom > 0 &&
              categoryFrom > category &&
              daysFromCreation(lastUpdate) < 30 && <p>Asendido!!</p>}
          </Box>
          <Spacer />
          <Center p="4">
            <a onClick={handleDeleteClick}>
              <DeleteIcon key={"di-" + id} stroke="#09f" />
            </a>
          </Center>
        </Flex>
      </Stack>
      <style jsx>{`
        article {
          border-bottom: 1px solid #eee;
          display: flex;
          padding: 10px 15px;
        }

        article:hover {
          background: #f5f8fa;
          cursor: pointer;
        }

        img {
          border-radius: 10px;
          height: auto;
          margin-top: 10px;
          width: 100%;
        }

        div {
          padding-right: 10px;
        }

        p {
          line-height: 1.3125;
          margin: 0;
        }

        a {
          color: #555;
          font-size: 14px;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  )
}
