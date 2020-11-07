import { Box, Flex, Image, Textarea, Button } from "@chakra-ui/core";
import NextLink from "next/link";
interface CardProps {
  src: string;
  views: number;
  link: string;
  name: string;
  title: string;
}
export const Card: React.FC<CardProps> = ({
  src,
  views = 0,
  title,
  link = "https://streamio/douazbdjabzda",
}) => {
  src =
    "https://cdn-cf-east.streamable.com/image/qzpehe.jpg?Expires=1604878380&Signature=kBqTh6VhDTvqdOBxWUOh0Can8JoGRkT1prg-9fo4zp0FOScNSzI2kB-tYXvwlwCNBSEAawQ99Es~3X3IdwBJZXs49NynNF198O66j1zUJBznOt12Cf-VTKl0fdp9ZMSq3T3Pqn6RaFbe1JwqU2AqMhAC2d577iqGj1qw18syO4VofN2zJj~qch6Ljjw9mq~Wvvfw1JZTNr6212jNbwgykdpgA5FoVH-c8~~FQl3EBEYz2h1WW0CwDaymYSlnR12aH9X8Q96cG17A3oQUWIOkcoQmep6fL6MBQZd0UozwnNtAzsoRYyZ8OgN~L~kbzb3YuoUUGaGx4m1CK~DAj-1sXA__&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ";
  return (
    <Box border="1px solid #e8e8e8" border-radius="2px">
      <Box width="100%">
        <Box cursor="pointer"></Box>
        <Image objectFit="cover" height="120px" width="100%" src={src}></Image>
      </Box>
    </Box>
  );
};
