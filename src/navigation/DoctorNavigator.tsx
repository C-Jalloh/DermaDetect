import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Doctor Screens
import DoctorDashboardScreen from '../screens/doctor/DoctorDashboardScreen';
import DoctorPendingScreen from '../screens/doctor/DoctorPendingScreen';
import DoctorProfileScreen from '../screens/doctor/DoctorProfileScreen';

export type DoctorTabParamList = {
  DoctorDashboard: undefined;
  DoctorPending: undefined;
  DoctorProfile: undefined;
};

const Tab = createBottomTabNavigator<DoctorTabParamList>();

const DoctorNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused: _, color, size }) => {
          let iconName: string;

          if (route.name === 'DoctorDashboard') {
            iconName = 'tachometer-alt';
          } else if (route.name === 'DoctorPending') {
            iconName = 'clipboard-list';
          } else if (route.name === 'DoctorProfile') {
            iconName = 'user-md';
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
        name="DoctorDashboard"
        component={DoctorDashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="DoctorPending"
        component={DoctorPendingScreen}
        options={{ title: 'Pending' }}
      />
      <Tab.Screen
        name="DoctorProfile"
        component={DoctorProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default DoctorNavigator;