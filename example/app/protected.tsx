import { Link } from 'expo-router';
import { withAuthenticationRequired } from 'expo-with-pincode';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

function ProtectedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Group name="Expo with Pincode">
          <Text>❗️protected content❗️</Text>
          <Link href="/subroute" style={styles.link}>
            Go to subroute
          </Link>
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  view: {
    flex: 1,
    height: 200,
  },
  link: {
    fontSize: 16,
    color: 'blue',
  },
};

export default withAuthenticationRequired(ProtectedScreen);
