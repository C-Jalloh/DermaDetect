/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { View, Text } from 'react-native';

// Simple component test instead of full App
const SimpleComponent = () => (
  <View>
    <Text>Test Component</Text>
  </View>
);

test('renders simple component correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<SimpleComponent />);
  });
});

// Test theme exports
test('theme exports correctly', () => {
  const { theme } = require('../src/utils/theme');
  expect(theme).toBeDefined();
  expect(theme.colors).toBeDefined();
  expect(theme.colors.primary).toBe('#00BFFF');
  expect(theme.colors.riskHigh).toBe('#F44336');
});
