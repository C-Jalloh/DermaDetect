import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { theme } from '../utils/theme';
import BaseBottomSheet from './BaseBottomSheet';

export interface DetailItem {
  title: string;
  description: string;
  icon?: string;
  examples?: string[];
  severity?: 'low' | 'medium' | 'high';
}

export interface DetailsBottomSheetProps {
  title: string;
  items: DetailItem[];
}

export interface DetailsBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

const DetailsBottomSheet = forwardRef<DetailsBottomSheetRef, DetailsBottomSheetProps>(
  ({ title, items }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetRef.current?.present();
      },
      dismiss: () => {
        bottomSheetRef.current?.dismiss();
      },
    }));

    const getSeverityColor = (severity?: string) => {
      switch (severity) {
        case 'high': return theme.colors.riskHigh;
        case 'medium': return theme.colors.riskMedium;
        case 'low': return theme.colors.riskLow;
        default: return theme.colors.primary;
      }
    };

    return (
      <BaseBottomSheet
        ref={bottomSheetRef}
        title={title}
        snapPoints={['70%']}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.itemHeader}>
                {item.icon && (
                  <FontAwesome5
                    name={item.icon}
                    size={20}
                    color={getSeverityColor(item.severity)}
                    style={styles.itemIcon}
                  />
                )}
                <Text style={[styles.itemTitle, { color: getSeverityColor(item.severity) }]}>
                  {item.title}
                </Text>
              </View>

              <Text style={styles.itemDescription}>
                {item.description}
              </Text>

              {item.examples && item.examples.length > 0 && (
                <View style={styles.examplesContainer}>
                  <Text style={styles.examplesTitle}>Examples:</Text>
                  {item.examples.map((example, exampleIndex) => (
                    <Text key={exampleIndex} style={styles.exampleText}>
                      • {example}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </BaseBottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemContainer: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemIcon: {
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  itemDescription: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: 12,
  },
  examplesContainer: {
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default DetailsBottomSheet;