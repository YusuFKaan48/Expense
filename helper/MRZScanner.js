import { Camera } from 'expo-camera';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function MRZScanner(props) {
  const [hasPermission, setHasPermission] = useState(null);

  const encodedLicense = () => {
    return encodeURIComponent("DLS2eyJoYW5kc2hha2VDb2RlIjoiMTA0Mjg5NzE3LU1UQTBNamc1TnpFM0xYZGxZaTFVY21saGJGQnliMm8iLCJtYWluU2VydmVyVVJMIjoiaHR0cHM6Ly9tZGxzLmR5bmFtc29mdG9ubGluZS5jb20iLCJvcmdhbml6YXRpb25JRCI6IjEwNDI4OTcxNyIsInN0YW5kYnlTZXJ2ZXJVUkwiOiJodHRwczovL3NkbHMuZHluYW1zb2Z0b25saW5lLmNvbSIsImNoZWNrQ29kZSI6MTgzNjMzNzYyN30=");
  }
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (hasPermission) {
    return (
      <WebView
        style={styles.container}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onMessage={(event) => {
          console.log(event);
          if (event.nativeEvent.data === "close") {
            if (props.onClosed) {
              props.onClosed();
            }
          }else{
            if (event.nativeEvent.data) {
              if (props.onScanned) {
                props.onScanned(event.nativeEvent.data);
              }
            }
          }
        }}
        source={{ uri: 'https://tony-xlh.github.io/Vanilla-JS-MRZ-Scanner-Demos/React-Native-Webview/?startScan=true&license='+encodedLicense() }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});