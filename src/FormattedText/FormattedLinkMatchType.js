const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
const emailRegex = /\S+@\S+\.\S+/g;
const hashRegex = /#\S+/g;

const FORMATTED_LINK_MATCH_TYPE = {
  URL: urlRegex,
  EMAIL: emailRegex,
  HASH: hashRegex
};

export default FORMATTED_LINK_MATCH_TYPE;
