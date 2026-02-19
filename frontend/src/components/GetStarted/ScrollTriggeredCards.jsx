import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  offscreen: {
    y: 120,
    opacity: 0,
    scale: 0.92,
  },
  onscreen: (i) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    rotate: -2,
    transition: {
      type: "spring",
      bounce: 0.35,
      duration: 0.7,
      delay: i * 0.08,
    },
  }),
};

const getChatifyColor = (i) => {
  const colors = [
    "linear-gradient(306deg, #fdf6e3, #faedcd)", // eggshell cream
    "linear-gradient(306deg, #fefae0, #faedcd)", // warm cream
    "linear-gradient(306deg, #f8f5f0, #efe8dd)", // light stone
    "linear-gradient(306deg, #fff7e6, #fbeecf)", // vanilla
    "linear-gradient(306deg, #fff8f0, #f9ead8)", // peach cream
    "linear-gradient(306deg, #f5f7ef, #e8edd9)", // light sage cream
    "linear-gradient(306deg, #f7f3e8, #ece4d2)", // oat
    "linear-gradient(306deg, #fcf8ee, #f1ead8)", // soft linen
  ];
  return colors[i % colors.length];
};

const container = {
  margin: "48px auto 0",
  maxWidth: 1200,
  paddingBottom: 20,
  width: "100%",
  display: "flex",
  flexWrap: "wrap",
  gap: 24,
  justifyContent: "center",
};

const cardContainer = {
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  width: "100%",
  height: 340,
  borderRadius: 18,
};

const splash = {
  position: "absolute",
  inset: 0,
  borderRadius: 18,
};

const card = {
  width: 200,
  height: 280,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "center",
  borderRadius: 16,
  background: "#ffffff",
  boxShadow:
    "0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)",
  transformOrigin: "10% 60%",
  overflow: "hidden",
};

const imageContainer = {
  width: "100%",
  height: 220,
  overflow: "hidden",
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const labelStyle = {
  padding: "12px",
  textAlign: "center",
  width: "100%",
  background: "white",
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
};

const chatItems = [
  {
    image: "https://picsum.photos/seed/chatapp/400/300",
    label: "Real-time Chat"
  },
  {
    image: "https://picsum.photos/seed/group/400/300",
    label: "Group Chats"
  },
  {
    image: "https://picsum.photos/seed/lock/400/300",
    label: "End-to-End Encryption"
  },
  {
    image: "https://picsum.photos/seed/videocall/400/300",
    label: "Video & Voice Calls"
  },
  {
    image: "https://picsum.photos/seed/status/400/300",
    label: "Status Updates"
  },
  {
    image: "https://picsum.photos/seed/share/400/300",
    label: "Media Sharing"
  },
  {
    image: "https://picsum.photos/seed/voice/400/300",
    label: "Voice Messages"
  },
  {
    image: "https://picsum.photos/seed/friends/400/300",
    label: "Stay Connected"
  }
];

function Card({ image, label, color, i }) {
  return (
    <div className="basis-full sm:basis-[calc(50%-12px)] lg:basis-[calc(25%-18px)] grow-0 shrink-0">
      <motion.div
        style={cardContainer}
        custom={i}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ amount: 0.45, once: false }}
        aria-label={`Animated card ${i + 1}`}
      >
        <div style={{ ...splash, background: color }} />
        <motion.div style={card} variants={cardVariants}>
          <div style={imageContainer}>
            <img
              src={image}
              alt={label}
              style={imageStyle}
              loading="lazy"
            />
          </div>
          <div style={labelStyle}>
            <span className="text-sm font-semibold text-gray-700">{label}</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ScrollTriggeredCards() {
  return (
    <div style={container}>
      {chatItems.map((item, i) => (
        <Card 
          key={item.label} 
          i={i} 
          image={item.image} 
          label={item.label} 
          color={getChatifyColor(i)} 
        />
      ))}
    </div>
  );
}
