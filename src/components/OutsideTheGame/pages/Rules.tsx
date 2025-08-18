import { List, ListItem, ListItemText, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import joker from "@pexeso/assets/joker.jpg";

/**
 * Rules Page Component
 *
 * Renders the rules and principles of the memory game (Pexeso).
 * Content is internationalized with `react-i18next` and divided into two sections:
 * - Principle of the game (with text and illustrative joker image).
 * - Game levels (easy, medium, hard) displayed as a styled list.
 *
 * @component
 * @example
 * <Rules />
 *
 * @remarks
 * - Responsive layout: flex containers adapt across breakpoints.
 * - Styled with MUI `sx` props and custom responsive styles.
 * - Level section is dynamically generated from `levelsSectionData`.
 *
 * @dependencies
 * - @mui/material (Box, Typography, List, ListItem, ListItemText)
 * - react-i18next
 */

// ---------- Sx styles

// Main wrapper for the page – sets flex column
const rulesContentStyles = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  p: 0,
  m: 0,
  boxSizing: "border-box",
  fontSize: "20px",
} as const;

// Main content under the heading – aligns text to the left
const rulesMainContentStyles = {
  textAlign: "left",
  padding: "2%",
} as const;

// Section for game principle
const rulesPrincipleSectionStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  lineHeight: "150%",

  // responsive tweaks for smaller screens
  "@media (max-width:1339px)": {
    justifyContent: "space-evenly",
  },
  "@media (max-width:1105)": {
    justifyContent: "start",
  },
} as const;

// Section for game levels
const rulesLevelSectionStyles = {
  lineHeight: "150%",
} as const;

// Unordered list styling
const ulListStyles = {
  listStyleType: "none",
  paddingLeft: "2%",
  "@media (max-width:1105px)": {
    paddingLeft: "0%",
  },
} as const;

// List items styling
const liListStyles = {
  // marginBottom: "2%",
  width: "90%",
  position: "relative",
  paddingLeft: "1.5em",
  "&::before": {
    content: '"✽\\00a0\\00a0\\00a0\\00a0"',
    position: "absolute",
    left: 0,
  },
} as const;

// Joker image styling in principle section
const imgStyles = {
  width: "200px",
  height: "130px",
  marginRight: "2%",
  position: "relative",
  borderRadius: 2,
  overflow: "hidden",
} as const;

// Paragraph text styling in principle section – responsive widths & margins
const pStyles = {
  marginRight: "5%",
  textIndent: "10%",
  maxWidth: "40%",
  "@media (max-width:1105px)": {
    maxWidth: "60%",
  },
  "@media (max-width:994px)": {
    marginRight: "2%",
    maxWidth: "60%",
  },
  "@media (max-width:902px)": {
    marginRight: "0%",
  },
  "@media (max-width:860px)": {
    marginRight: "5%",
    maxWidth: "50%",
  },
  "@media (max-width:750px)": {
    maxWidth: "40%",
    marginRight: "3%",
  },
} as const;

// ---------- Component

const Rules = () => {
  const { t } = useTranslation();

  // Data for section - level
  // Each level has a name and description; content is translated via i18n
  const levelsSectionData = [
    {
      name: t("rules_page.content.level.name.easy"),
      description: t("rules_page.content.level.description.easy"),
    },
    {
      name: t("rules_page.content.level.name.medium"),
      description: t("rules_page.content.level.description.medium"),
    },
    {
      name: t("rules_page.content.level.name.hard"),
      description: t("rules_page.content.level.description.hard"),
    },
  ];

  return (
    <Box sx={rulesContentStyles}>
      {/* Main heading for the rules page */}
      <Typography variant="h2" component="h2">
        {t("rules_page.h2")}
      </Typography>
      <Box sx={rulesMainContentStyles}>
        {/* ---------- Principle Section ---------- */}
        {/* Subheading for principle section */}
        <Typography variant="h4" component="h4">
          {t("rules_page.h4.principle")}
        </Typography>

        {/* Container for principle text and image */}
        <Box sx={rulesPrincipleSectionStyles}>
          {/* Principle description paragraph */}
          <Typography component="p" sx={pStyles}>
            {t("rules_page.content.principle")}
          </Typography>
          {/* Joker image to illustrate principle */}
          <Box component="img" src={joker} alt="Pexeso img" sx={imgStyles} />
        </Box>

        {/* ---------- Level Section ---------- */}
        {/* Subheading for levels section */}
        <Typography variant="h4" component="h4">
          {" "}
          {t("rules_page.h4.level")}
        </Typography>

        {/* Container for levels list */}
        <Box sx={rulesLevelSectionStyles}>
          {/* List of game levels */}
          <List sx={ulListStyles}>
            {levelsSectionData.map((level, index) => (
              <ListItem key={index} sx={liListStyles}>
                {/* Level name and description */}
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      <strong>{level.name}</strong> – {level.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Rules;
