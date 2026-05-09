import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '../useColorScheme';

interface SpiceStepIndicatorProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

export function SpiceStepIndicator({ steps, currentStep }: SpiceStepIndicatorProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <View key={step} style={styles.stepWrapper}>
            <View style={styles.stepContainer}>
              <View 
                style={[
                  styles.dot,
                  { 
                    backgroundColor: isCompleted || isActive ? colors.saffron : 'transparent',
                    borderColor: isCompleted || isActive ? colors.saffron : colors.text,
                    borderWidth: isCompleted || isActive ? 0 : 2
                  }
                ]}
              >
                {isCompleted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text 
                variant="caption" 
                style={[
                  styles.stepLabel, 
                  { 
                    color: isActive ? colors.saffron : (isCompleted ? colors.text : colors.tabIconDefault),
                    fontWeight: isActive ? 'bold' : 'normal'
                  }
                ]}
              >
                {step}
              </Text>
            </View>
            {!isLast && (
              <View style={[
                styles.line, 
                { backgroundColor: isCompleted ? colors.saffron : colors.tabIconDefault, opacity: isCompleted ? 1 : 0.2 }
              ]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepContainer: {
    alignItems: 'center',
    width: 60,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  checkmark: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepLabel: {
    textAlign: 'center',
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
    marginBottom: 20,
  },
});