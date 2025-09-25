import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeIcon, UserIcon, PendingIcon } from '../assets/icons';

// Icon wrapper components to avoid defining during render
const HomeTabIcon = ({ color, size }: { color: string; size: number }) => (
  <HomeIcon width={size} height={size} fill={color} />
);

// const BellTabIcon = ({ color, size }: { color: string; size: number }) => (
//   <BellIcon size={size} color={color} />
// );

const PendingTabIcon = ({ color, size }: { color: string; size: number }) => (
  <PendingIcon width={size} height={size} fill={color} />
);

const UserTabIcon = ({ color, size }: { color: string; size: number }) => (
  <UserIcon width={size} height={size} fill={color} />
);

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
          if (route.name === 'DoctorDashboard') {
            return HomeTabIcon({ color, size });
          } else if (route.name === 'DoctorPending') {
            return PendingTabIcon({ color, size });
          } else if (route.name === 'DoctorProfile') {
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