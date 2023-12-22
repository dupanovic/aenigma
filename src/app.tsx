import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  ChakraBaseProvider,
  Divider,
  extendBaseTheme,
  Heading,
  HStack,
  Select,
  Text,
  theme as chakraTheme,
  VStack,
  Link,
} from "@chakra-ui/react";
import { MyButton } from "./components/MyButton";
import { Layout } from "./components/Layout";
import { ParacelsusQuotes } from "../assets/quotes";

const { Button } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
    Heading,
    Text,
    Link,
    Select,
    VStack,
    Divider,
  },
});
const root = createRoot(document.body);
root.render(<App />);

function App() {
  const randomQuote =
    ParacelsusQuotes[Math.floor(Math.random() * ParacelsusQuotes.length)];
  return (
    <ChakraBaseProvider theme={theme}>
      <Layout>
        <VStack>
          <Heading fontSize={48} color={chakraTheme.colors.gray["800"]}>
            Welcome to Bombastus
          </Heading>
          <Text
            noOfLines={3}
            width={600}
            textAlign={"center"}
            fontSize={16}
            color={chakraTheme.colors.gray["500"]}
          >{`${randomQuote} - Theophrastus Bombastus von
            Hohenheim Paracelsus`}</Text>
        </VStack>
        <VStack gap={"48px"} alignSelf={"center"} marginY={"auto"}>
          <VStack gap={"12px"}>
            <Heading>
              {" "}
              Select a file to get started, or check available formats...
            </Heading>
            <HStack>
              <MyButton
                label={"Convert file"}
                onClick={() => console.log(10)}
              />
              <MyButton
                label={"Format search"}
                onClick={() => console.log(10)}
              />
            </HStack>
          </VStack>

          <VStack gap={"12px"}>
            <Heading>
              {" "}
              ...or merge multiple pdf files into a single one.
            </Heading>
            <HStack>
              <MyButton
                label={"Select files"}
                onClick={() => console.log(10)}
              />
            </HStack>
          </VStack>
        </VStack>
        <Text
          fontSize={"13px"}
          color={"grey"}
          position={"absolute"}
          bottom={"8px"}
          right={"8px"}
        >
          v.1.0.0 💣
        </Text>
        <Link
          fontSize={"13px"}
          href={"https://dupanovic.com"}
          color={"grey"}
          textDecoration={"underline"}
          position={"absolute"}
          bottom={"8px"}
          left={"8px"}
        >
          dupanovic
        </Link>
      </Layout>
    </ChakraBaseProvider>
  );
}
