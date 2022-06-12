import {
  ChakraProvider,
  extendTheme,
  Container,
  Box,
  Center,
} from "@chakra-ui/react"

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
}

const theme = extendTheme({ colors })

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Container maxW={"7xl"} p="12">
        <Center>
          <Box
            marginTop={{ base: "1", sm: "5" }}
            display="flex"
            flexDirection={{ base: "column", sm: "row" }}
            justifyContent="space-between"
            boxShadow={"2xl"}
            rounded={"md"}
            overflow={"hidden"}
            minH={"100vh"}
            minWidth="409px"
          >
            <Component {...pageProps} />
          </Box>
        </Center>
      </Container>
    </ChakraProvider>
  )
}
