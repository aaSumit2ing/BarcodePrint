import { StatusBar } from 'expo-status-bar';
import { StyleSheet,Button, Text, View, SafeAreaView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

export default function App() {

  const downloadFromUrl = async () => {
    const filename = "SampleData.xls";
    const result = await FileSystem.downloadAsync(
      'http://dev.catalystsoft.in/SampleData.xls',
      FileSystem.documentDirectory + filename
    );
    console.log(result);

    save(result.uri, filename, result.headers["Content-Type"]);
  };


  const save = async (uri, filename, mimetype) => {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
          })
          .catch(e => console.log(e));
      } else {
        shareAsync(uri);
      }
    } else {
      shareAsync(uri);
    }
  };

  return (
          <View style={styles.container}>
            <Button title="Download From URL" onPress={downloadFromUrl} />
            <Text style={styles.colorRed}>Hi! Sumit</Text>
            <StatusBar style="auto" />
          </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorRed:{
    color:'#0023ff',
  }
});
