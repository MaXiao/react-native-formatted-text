import React from "react";
import { Text, StyleSheet, Linking } from "react-native";
import FORMATTED_LINK_MATCH_TYPE from "./FormattedLinkMatchType";

/*
 * ranges: object or array in the form of {start:, end:, style:}
 * matches: object or array in the form of {text:/regex:, style:}
 * enabledLinkTypes: array of FORMATTED_LINK_MATCH_TYPE
 *
 * */

const openUrl = url => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.warn("Don't know how to open URI: " + url);
    }
  });
};

const FormattedText = ({
  children,
  ranges = [],
  matches = [],
  enabledLinkTypes = [],
  ...props
}) => {
  if (ranges && !Array.isArray(ranges)) {
    ranges = [ranges];
  }
  if (matches && !Array.isArray(matches)) {
    matches = [matches];
  }

  if (enabledLinkTypes && !Array.isArray(enabledLinkTypes)) {
    enabledLinkTypes = [enabledLinkTypes];
  }

  // convert enabledLinkTypes array to normal match object
  for (const match of enabledLinkTypes) {
    let m = { regex: match.type };

    if (match.style) {
      m.style = match.style;
    } else {
      m.style = FormattedStyles.link;
    }

    if (match.onPress) {
      m.onPress = match.onPress;
    } else {
      // setup default link handling for url and email if onPress is absent
      switch (match.type) {
        case FORMATTED_LINK_MATCH_TYPE.URL:
          m.onPress = openUrl;
          break;
        case FORMATTED_LINK_MATCH_TYPE.EMAIL:
          m.onPress = text => {
            openUrl(`mailto:${text}`);
          };
          break;
      }
    }
    matches.push(m);
  }

  // construct ranges from matches
  matches.forEach(match => {
    // generalize text param to regex
    if (match.text) {
      match.regex = new RegExp("\\b" + match.text + "\\b", "g");
    }
    if (match.regex) {
      while ((m = match.regex.exec(children)) != null) {
        ranges.push({
          start: m.index,
          end: m.index + m[0].length,
          style: match.style,
          onPress: match.onPress
        });
      }
    } else {
      console.warn(
        `${match} in match array doesn't have either a regex or text`
      );
    }
  });

  // remove ranges that don't have enough meta data
  const filteredFormats = ranges.filter(
    s => s.hasOwnProperty("start") && s.hasOwnProperty("end")
  );

  if (ranges.length === 0) {
    console.warn("no format found");
    return <Text {...props}>{children}</Text>;
  }

  // sort formats by range, check if there is overlap
  const sortedFormats = filteredFormats.sort((a, b) => a.start - b.start);
  for (let i = 0; i < sortedFormats.length; i++) {
    if (i > 0 && sortedFormats[i].start < sortedFormats[i - 1].end) {
      console.warn(
        `Overlap found between ${JSON.stringify(
          sortedFormats[i - 1]
        )}(${children.substring(
          sortedFormats[i - 1].start,
          sortedFormats[i - 1].end
        )}) and ${JSON.stringify(sortedFormats[i])}(${children.substring(
          sortedFormats[i].start,
          sortedFormats[i].end
        )})`
      );
      return <Text {...props}>{children}</Text>;
    }
  }

  // build formatted string
  const result = [];
  sortedFormats.forEach((format, index) => {
    // add start of string if needed
    if (index === 0 && format.start > 0) {
      result.push(children.substring(0, format.start));
    }

    // add gab between two ranges
    if (index > 0 && format.start > sortedFormats[index - 1].end) {
      result.push(
        children.substring(sortedFormats[index - 1].end, format.start)
      );
    }

    const sub = children.substring(format.start, format.end);
    result.push(
      <Text
        style={format.style || FormattedStyles.default}
        onPress={
          format.onPress
            ? () => {
                format.onPress(sub, format.start, format.end);
              }
            : null
        }
        key={index}
      >
        {sub}
      </Text>
    );

    // add end of string if needed
    if (
      index === sortedFormats.length - 1 &&
      format.end < children.length - 1
    ) {
      result.push(children.substring(format.end, children.length));
    }
  });

  return <Text {...props}>{result}</Text>;
};

const FormattedStyles = StyleSheet.create({
  default: {
    fontWeight: "600"
  },
  link: {
    color: "#005daa",
    textDecorationLine: "underline"
  }
});

export default FormattedText;
