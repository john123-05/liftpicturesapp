import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type FatalErrorPayload = {
  message: string;
  stack?: string;
  occurredAt?: string;
};

type Props = {
  error: FatalErrorPayload;
  onClear: () => void;
};

export default function FatalRuntimeScreen({ error, onClear }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Runtime Error</Text>
      <Text style={styles.subtitle}>
        The app hit a fatal error. Please send this message so we can fix it.
      </Text>

      <ScrollView style={styles.messageBox} contentContainerStyle={styles.messageContent}>
        <Text style={styles.messageText}>{error.message || 'Unknown error'}</Text>
        {error.stack ? <Text style={styles.stackText}>{`\n${error.stack}`}</Text> : null}
        {error.occurredAt ? <Text style={styles.metaText}>{`\n${error.occurredAt}`}</Text> : null}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={onClear}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    color: '#ff6b35',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    color: '#d0d0d0',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  messageBox: {
    width: '100%',
    flex: 1,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 10,
    backgroundColor: '#121212',
    marginBottom: 16,
  },
  messageContent: {
    padding: 12,
  },
  messageText: {
    color: '#f0f0f0',
    fontSize: 13,
    lineHeight: 19,
  },
  stackText: {
    color: '#9a9a9a',
    fontSize: 11,
    lineHeight: 17,
  },
  metaText: {
    color: '#777',
    fontSize: 11,
    lineHeight: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#ff6b35',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
});
