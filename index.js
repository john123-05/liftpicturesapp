const AsyncStorage = require('@react-native-async-storage/async-storage').default;
const React = require('react');
const { View, Text, ScrollView, StyleSheet } = require('react-native');
const { registerRootComponent } = require('expo');

const LAST_FATAL_ERROR_KEY = 'liftpictures_last_fatal_error';
let bootFallbackRegistered = false;

function serializeError(error, isFatal) {
  return {
    message: typeof error?.message === 'string' ? error.message : String(error),
    stack: typeof error?.stack === 'string' ? error.stack : '',
    isFatal: Boolean(isFatal),
    occurredAt: new Date().toISOString(),
  };
}

function persistFatalError(payload) {
  AsyncStorage.setItem(LAST_FATAL_ERROR_KEY, JSON.stringify(payload)).catch(() => {});
}

function notifyFatalListener(payload) {
  global.__LP_FATAL_ERROR_PAYLOAD = payload;
  const listener = global.__LP_SET_FATAL_ERROR;
  if (typeof listener === 'function') {
    try {
      listener(payload);
      return true;
    } catch {
      // no-op
    }
  }
  return false;
}

function installGlobalErrorHandler() {
  const errorUtils = global.ErrorUtils;
  if (
    !errorUtils
    || typeof errorUtils.getGlobalHandler !== 'function'
    || typeof errorUtils.setGlobalHandler !== 'function'
  ) {
    return;
  }

  const previousHandler = errorUtils.getGlobalHandler();

  errorUtils.setGlobalHandler((error, isFatal) => {
    const payload = serializeError(error, isFatal);
    persistFatalError(payload);
    const notified = notifyFatalListener(payload);
    if (isFatal && !notified) {
      registerBootFallback(payload);
    }

    console.error('[GlobalErrorHandler]', payload.message);
    if (payload.stack) {
      console.error(payload.stack);
    }

    if (__DEV__) {
      if (typeof previousHandler === 'function') {
        previousHandler(error, isFatal);
      }
      return;
    }

    if (!isFatal && typeof previousHandler === 'function') {
      previousHandler(error, false);
    }
  });
}

function registerBootFallback(payload) {
  if (bootFallbackRegistered) {
    return;
  }
  bootFallbackRegistered = true;

  function BootFallback() {
    return (
      React.createElement(View, { style: styles.container },
        React.createElement(Text, { style: styles.title }, 'Startup Error'),
        React.createElement(Text, { style: styles.subtitle }, 'The app failed while loading.'),
        React.createElement(ScrollView, { style: styles.messageBox, contentContainerStyle: styles.messageContent },
          React.createElement(Text, { style: styles.messageText }, payload?.message || 'Unknown error'),
          payload?.stack
            ? React.createElement(Text, { style: styles.stackText }, `\n${payload.stack}`)
            : null,
        ),
      )
    );
  }

  registerRootComponent(BootFallback);
}

installGlobalErrorHandler();
try {
  require('expo-router/entry');
} catch (error) {
  const payload = serializeError(error, true);
  persistFatalError(payload);
  registerBootFallback(payload);
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
});
