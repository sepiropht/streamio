import { Box, Flex, IconButton } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { isMobile } from 'react-device-detect'

interface ModalPlayerProps {
  videoUrl: string
  isVisible: boolean
  close: (isVisible: boolean) => void
}
export const ModalPlayer: React.FC<ModalPlayerProps> = ({
  isVisible,
  videoUrl,
  close,
}) => {
  const videoDomElement = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (
      videoDomElement &&
      !videoDomElement.current?.currentSrc.length &&
      videoUrl.length
    ) {
      const source = document.createElement('source')
      source.setAttribute('src', videoUrl)
      source.setAttribute('type', 'video/mp4')
      source.setAttribute('loop', '')
      source.setAttribute('autoplay', '')
      source.setAttribute('muted', '')
      source.setAttribute('playsinline', '')
      videoDomElement.current?.appendChild(source)

      if (isMobile) {
        videoDomElement.current?.requestFullscreen()
      }
    }
    if (isVisible) {
      videoDomElement?.current?.play()
    } else {
      videoDomElement?.current?.pause()
    }
  }, [isVisible])
  return (
    <Flex
      position="fixed"
      left="0"
      padding="25px"
      right="0"
      style={{ display: isVisible ? 'flex' : 'none' }}
      top="0"
      bottom="0"
      bg="rgba(0,0,0,.9)"
      zIndex={10000}
      flexDirection="column"
      overflow="scroll"
    >
      <Box>
        <IconButton
          aria-label="close player"
          float="right"
          color="#fff"
          fontSize="24px"
          variant="outline"
          icon={<AiOutlineClose />}
          margin-top="4px"
          margin-right="12px"
          onClick={() => close(false)}
        ></IconButton>
      </Box>
      <audio ref={videoDomElement} controls autoPlay loop></audio>
    </Flex>
  )
}
