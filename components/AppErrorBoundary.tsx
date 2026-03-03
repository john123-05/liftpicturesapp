import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  children: React.ReactNode;
};

type State = {
  error: Error | null;
};

export default class AppErrorBoundary extends React.Component<Props, State> {
  state: State = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[AppErrorBoundary] Render error:', error);
    if (info?.componentStack) {
      console.error(info.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>App Error</Text>
          <Text style={styles.subtitle}>
            A rendering error occurred. Please restart the app.
          </Text>
          <ScrollView style={styles.messageBox} contentContainerStyle={styles.messageContent}>
            <Text style={styles.messageText}>{this.state.error.message || 'Unknown error'}</Text>
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
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
    fontSize: 12,
    lineHeight: 18,
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
