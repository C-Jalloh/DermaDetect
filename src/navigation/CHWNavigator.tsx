import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// CHW Screens
import CHWHomeScreen from '../screens/chw/CHWHomeScreen';
import CHWRegisterPatientScreen from '../screens/chw/CHWRegisterPatientScreen';
import CHWProfileScreen from '../screens/chw/CHWProfileScreen';

export type CHWTabParamList = {
  CHWHome: undefined;
  CHWRegisterPatient: undefined;
  CHWProfile: undefined;
};

const Tab = createBottomTabNavigator<CHWTabParamList>();

const CHWNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused: _, color, size }) => {
          let iconName: string;

          if (route.name === 'CHWHome') {
            iconName = 'home';
          } else if (route.name === 'CHWRegisterPatient') {
            iconName = 'user-plus';
          } else if (route.name === 'CHWProfile') {
            iconName = 'user-circle';
          } else {
            iconName = 'question';
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="CHWHome"
        component={CHWHomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="CHWRegisterPatient"
        component={CHWRegisterPatientScreen}
        options={{ title: 'Register' }}
      />
      <Tab.Screen
        name="CHWProfile"
        component={CHWProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default CHWNavigator;