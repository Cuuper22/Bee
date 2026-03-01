/**
 * Error Boundary Component
 * Catches React errors and displays a friendly fallback UI instead of a white screen
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: '#111827',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: '#1F2937',
              borderRadius: 16,
              padding: 24,
              maxWidth: 500,
              width: '100%',
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: '#EF4444',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              😕 Oops!
            </Text>

            <Text
              style={{
                fontSize: 18,
                color: '#F3F4F6',
                textAlign: 'center',
                marginBottom: 24,
              }}
            >
              Something went wrong. The app encountered an unexpected error.
            </Text>

            {__DEV__ && this.state.error && (
              <ScrollView
                style={{
                  backgroundColor: '#0F172A',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 24,
                  maxHeight: 200,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: '#F87171',
                    fontFamily: 'monospace',
                  }}
                >
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: '#9CA3AF',
                      fontFamily: 'monospace',
                      marginTop: 8,
                    }}
                  >
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}

            <Pressable
              onPress={this.handleReset}
              style={({ pressed }) => ({
                backgroundColor: '#F6C915',
                paddingHorizontal: 24,
                paddingVertical: 16,
                borderRadius: 12,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text
                style={{
                  color: '#111827',
                  fontSize: 16,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Try Again
              </Text>
            </Pressable>

            <Text
              style={{
                fontSize: 14,
                color: '#9CA3AF',
                textAlign: 'center',
                marginTop: 16,
              }}
            >
              If the problem persists, try reloading the app
            </Text>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
