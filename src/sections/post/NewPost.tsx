import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Progress,
  Stack,
  Textarea,
  Tooltip,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { MotionContainer } from "src/components/animate";
import MyAvatar from "src/sections/compronents/contract/MyAvatar";
import CircularProgress from "src/components/CircularProgress";
import Iconify from "src/components/icons/Iconify";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { processActions } from "./NewPostFunctions";

const postCaw = async (senderAddress: string, cawText: string) => {
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const result = await processActions(
    [
      {
        actionType: "caw",
        message: cawText,
        timestamp: timestamp,
        sender: senderAddress,
        senderTokenId: 1,
      },
    ],
    {
      sender: senderAddress,
    }
  );
  console.log("🐓", result);
};

export const MAX_CHARECTERS = 420;
const defaultText =
  "The next #censor would be whoever is looking at the text, seeing what words they would “trick out” to fit the political";

export default function NewPost() {
  const { address, isConnected } = useAccount();
  const { t } = useTranslation();
  const [light, dark] = useToken("colors", ["caw.600", "caw.500"]);
  const iconColor = useColorModeValue(light, dark);
  const okColor = useColorModeValue("caw.500", "caw.600");
  const warningColor = useColorModeValue("orange.500", "orange.400");
  const errorColor = useColorModeValue("red.500", "red.400");

  const [cawText, setCawText] = useState(defaultText);
  const [characters, setCharacters] = useState(defaultText.length);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(
      characters >= MAX_CHARECTERS ? 100 : (characters / MAX_CHARECTERS) * 100
    );
  }, [characters]);

  const progressColor =
    progress < 90
      ? okColor
      : progress < 96
      ? warningColor
      : progress < 100
      ? errorColor
      : errorColor;

  return (
    <MotionContainer>
      <Box sx={{ m: 2, py: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} gap={4}>
          <MyAvatar sx={{ display: { base: "none", sm: "block" } }} />
          <Textarea
            defaultValue={defaultText}
            resize="none"
            placeholder={t("labels.new_post_plh")}
            inputMode="text"
            maxLength={MAX_CHARECTERS}
            height={110}
            onChange={(e) => {
              setCharacters(e.target.value.length);
              setCawText(e.target.value);
            }}
          />
        </Stack>
        <Progress
          ml={0}
          mt="2"
          size="xs"
          colorScheme="caw"
          borderRadius="full"
          display={{ base: "flex", sm: "none" }}
          value={progress}
        />
        <HStack
          alignItems="center"
          ml={{ base: 0, sm: 14 }}
          mt="2"
          alignContent="space-between"
        >
          <Tooltip hasArrow label={t("labels.add_photo")}>
            <IconButton variant="ghost" aria-label={t("labels.add_photo")}>
              {
                <Iconify
                  icon={"bxs:image"}
                  width={20}
                  height={20}
                  color={iconColor}
                />
              }
            </IconButton>
          </Tooltip>
          <Tooltip hasArrow label={t("labels.add_gif")}>
            <IconButton variant="ghost" aria-label={t("labels.add_gif")}>
              {
                <Iconify
                  icon={"fluent:gif-24-filled"}
                  width={20}
                  height={20}
                  color={iconColor}
                />
              }
            </IconButton>
          </Tooltip>
          <Tooltip hasArrow label={t("labels.add_video")}>
            <IconButton variant="ghost" aria-label={t("labels.add_video")}>
              {
                <Iconify
                  icon={"bxs:video"}
                  rotate={180}
                  width={20}
                  height={20}
                  color={iconColor}
                />
              }
            </IconButton>
          </Tooltip>
          <Tooltip hasArrow label={t("labels.add_link")}>
            <IconButton variant="ghost" aria-label={t("labels.add_link")}>
              {
                <Iconify
                  icon={"majesticons:link-circle"}
                  rotate={180}
                  width={20}
                  height={20}
                  color={iconColor}
                />
              }
            </IconButton>
          </Tooltip>
          <Tooltip hasArrow label={t("labels.add_long_caw")}>
            <IconButton variant="ghost" aria-label={t("labels.add_long_caw")}>
              {
                <Iconify
                  icon={"akar-icons:circle-plus-fill"}
                  rotate={180}
                  width={20}
                  height={20}
                  color={iconColor}
                />
              }
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <Stack
            direction={{ base: "column", sm: "row" }}
            alignItems={{ base: "flex-start", sm: "center" }}
          >
            <CircularProgress
              capIsRound
              color={progressColor}
              value={progress}
              text={`${Math.round(progress || 0)}%`}
              display={{ base: "none", sm: "flex" }}
            />
            <Tooltip hasArrow label={t("buttons.btn_caw_tooltip")}>
              <Button
                variant="contained"
                bg="caw.600"
                color={"gray.900"}
                size="sm"
                boxShadow="2xl"
                onClick={() => {
                  postCaw(address || "", cawText);
                }}
              >
                CAW
              </Button>
            </Tooltip>
          </Stack>
        </HStack>
        <Divider m={2} />
      </Box>
    </MotionContainer>
  );
}
