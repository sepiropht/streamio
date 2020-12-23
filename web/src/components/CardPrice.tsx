import {
  Box,
  List,
  ListItem,
  Link,
  Flex,
  Button,
  FormControl,
  Input,
} from "@chakra-ui/react";

export const CardPrice: React.FC = () => (
  <Box
    position="relative"
    display="inline-block"
    width="100%"
    max-width="300px"
    margin="20px"
    padding="30px"
    border-radius="2px"
    background-color="#fff"
    border="1px solid #e8e8e8"
    text-align="left"
    vertical-align="top"
    box-shadow="8px 8px 20px #e7e7e7"
    className="plan plan-free"
  >
    <div className="plan-title">Free</div>
    <div className="plan-cost">
      <div>$0</div>
      <div className="plan-cost-details">
        <div className="plan-month">per month</div>
        <div className="duration-options duration-options-static">
          forever free
        </div>
      </div>
    </div>
    <div className="plan-description">
      Free, ad-supported video hosting great for just getting started
    </div>
    <div className="features">
      <div className="feature">
        <span>90 day video retention</span>
        <div className="plan-info"></div>
      </div>
      <div className="feature">
        <span>Ad-supported playback</span>
        <div className="plan-info"></div>
      </div>
      <div className="feature">
        <span>Stream your videos in HD</span>
        <div className="plan-info"></div>
      </div>
      <div className="feature">
        <span>500 MB / 10 min limit per video</span>
        <div className="plan-info"></div>
      </div>
    </div>
    <button className="blue-button action-button">Start for free</button>
  </Box>
);
