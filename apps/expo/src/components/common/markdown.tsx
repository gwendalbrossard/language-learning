import { Platform, StyleSheet } from "react-native"

export const markdownStyles = StyleSheet.create({
  // The main container
  body: {
    fontSize: 14,
  },

  // Headings
  heading1: {
    flexDirection: "row",
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 6,
    color: "#2160EB", // primary-600
  },
  heading2: {
    flexDirection: "row",
    fontSize: 18,
    fontWeight: 700,
    marginTop: 6,
    marginBottom: 6,
    color: "#2160EB", // primary-600
  },
  heading3: {
    flexDirection: "row",
    fontSize: 16,
    fontWeight: 700,
    marginTop: 4,
    marginBottom: 4,
    color: "#2160EB", // primary-600
  },
  heading4: {
    flexDirection: "row",
    fontSize: 14,
    fontWeight: 700,
    marginTop: 2,
    marginBottom: 2,
    color: "#2160EB", // primary-600
  },
  heading5: {
    flexDirection: "row",
    fontSize: 14,
    fontWeight: 600,
    marginTop: 2,
    marginBottom: 2,
    color: "#2160EB", // primary-600
  },
  heading6: {
    flexDirection: "row",
    fontSize: 14,
    fontWeight: 500,
    marginTop: 2,
    marginBottom: 2,
    color: "#2160EB", // primary-600
  },

  // Horizontal Rule
  hr: {
    backgroundColor: "#000000",
    height: 1,
  },

  // Emphasis
  strong: {
    fontWeight: "bold",
  },
  em: {
    fontStyle: "italic",
  },
  s: {
    textDecorationLine: "line-through",
  },

  // Blockquotes
  blockquote: {
    backgroundColor: "#F5F5F5",
    borderColor: "#CCC",
    borderLeftWidth: 4,
    marginLeft: 5,
    paddingHorizontal: 5,
  },

  // Lists
  bullet_list: {},
  ordered_list: {},
  list_item: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  // @pseudo class, does not have a unique render rule
  bullet_list_icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  // @pseudo class, does not have a unique render rule
  bullet_list_content: {
    flex: 1,
  },
  // @pseudo class, does not have a unique render rule
  ordered_list_icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  // @pseudo class, does not have a unique render rule
  ordered_list_content: {
    flex: 1,
  },

  // Code
  code_inline: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ["ios"]: {
        fontFamily: "Courier",
      },
      ["android"]: {
        fontFamily: "monospace",
      },
    }),
  },
  code_block: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ["ios"]: {
        fontFamily: "Courier",
      },
      ["android"]: {
        fontFamily: "monospace",
      },
    }),
  },
  fence: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ["ios"]: {
        fontFamily: "Courier",
      },
      ["android"]: {
        fontFamily: "monospace",
      },
    }),
  },

  // Tables
  table: {
    borderWidth: 1,
    borderColor: "#DFE3EB", // neutral-200
    borderRadius: 3,
  },
  thead: {},
  tbody: {},
  th: {
    flex: 1,
    padding: 5,
    fontWeight: 600,
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: "#DFE3EB", // neutral-200
    flexDirection: "row",
  },
  td: {
    flex: 1,
    padding: 5,
  },

  // Links
  link: {
    textDecorationLine: "underline",
  },
  blocklink: {
    flex: 1,
    borderColor: "#000000",
    borderBottomWidth: 1,
  },

  // Images
  image: {
    flex: 1,
  },

  // Text Output
  text: {},
  textgroup: {},
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  hardbreak: {
    width: "100%",
    height: 1,
  },
  softbreak: {},

  // Believe these are never used but retained for completeness
  pre: {},
  inline: {},
  span: {},
})
