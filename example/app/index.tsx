import { Link } from 'expo-router';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Group name="Expo with Pincode">
          <Link href="/protected" style={styles.link}>
            Go to protected content ➡️
          </Link>
          <Link href="/set" style={styles.link}>
            Go to set/reset pincode ➡️
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
