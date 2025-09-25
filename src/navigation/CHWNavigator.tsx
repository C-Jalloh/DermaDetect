import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeIcon, UserIcon, RegisterIcon } from '../assets/icons';

// Icon wrapper components to avoid defining during render
const HomeTabIcon = ({ color, size }: { color: string; size: number }) => (
  <HomeIcon width={size} height={size} fill={color} />
);

const RegisterTabIcon = ({ color, size }: { color: string; size: number }) => (
  <RegisterIcon width={size} height={size} fill={color} />
);

const UserTabIcon = ({ color, size }: { color: string; size: number }) => (
  <UserIcon width={size} height={size} fill={color} />
);

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
          if (route.name === 'CHWHome') {
            return HomeTabIcon({ color, size });
          } else if (route.name === 'CHWRegisterPatient') {
            return RegisterTabIcon({ color, size });
          } else if (route.name === 'CHWProfile') {
            return UserTabIcon({ color, size });
          }
          return UserTabIcon({ color, size }); // fallback
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