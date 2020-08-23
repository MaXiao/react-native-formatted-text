/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {
  FormattedText,
  FORMATTED_LINK_MATCH_TYPE,
} from 'react-native-formatted-text';

const App: () => React$Node = () => {
  return (
    <SafeAreaView>
      <View style={styles.body}>
        <FormattedText
          style={styles.text}
          formats={[
            {start: 55, end: 62, style: styles.prop},
            {start: 77, end: 82, style: styles.param},
            {start: 88, end: 92, style: styles.param},
          ]}>
          The most generic way to use FormattedText is providing formats prop to
          define start and end of the text.
        </FormattedText>
        <FormattedText
          style={styles.text}
          matches={[
            {text: 'matches', style: styles.prop},
            {text: 'text', style: styles.param},
            {regex: /regex/g, style: styles.param},
          ]}>
          One can also utilize matches prop and declare a text or regex to find
          words need to be formatted.
        </FormattedText>
        <FormattedText
          style={styles.text}
          matches={{text: 'enabledLinkTypes', style: styles.prop}}
          enabledLinkTypes={[
            {type: FORMATTED_LINK_MATCH_TYPE.URL},
            {type: FORMATTED_LINK_MATCH_TYPE.EMAIL},
          ]}>
          There is a convenient enabledLinkTypes to automatically detect links
          like https://www.google.com or email addresses like hi@email.com
        </FormattedText>
        <FormattedText
          style={styles.text}
          matches={[
            {text: 'style', style: styles.param},
            {
              text: 'onPress',
              style: styles.param,
              onPress: () => {
                alert('pressed!');
              },
            },
          ]}>
          All of them accept style and onPress for customization.
        </FormattedText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'white',
    justifyContent: 'center',
    height: '100%',
    padding: 20,
  },
  text: {fontSize: 16, marginBottom: 30},
  prop: {backgroundColor: 'lightgrey', fontWeight: '600'},
  param: {color: 'blue'},
});

export default App;
