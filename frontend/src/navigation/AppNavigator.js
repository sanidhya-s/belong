import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import AmenitiesScreen from '../screens/AmenitiesScreen';
import VisitorsScreen from '../screens/VisitorsScreen';
import SecurityScreen from '../screens/SecurityScreen';
import SupportScreen from '../screens/SupportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import NoticesScreen from '../screens/NoticesScreen';
import GatePassScreen from '../screens/GatePassScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ModeratorMembersScreen from '../screens/ModeratorMembersScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Amenities" component={AmenitiesScreen} />
      <Stack.Screen name="Visitors" component={VisitorsScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
      <Stack.Screen name="Notices" component={NoticesScreen} />
      <Stack.Screen name="GatePass" component={GatePassScreen} />
      <Stack.Screen name="Community" component={CommunityScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator({ userRole }) {
  const tabs = [
    { name: 'Home', component: HomeStack, icon: 'home', iconOut: 'home-outline', label: 'Home' },
    { name: 'Payments', component: PaymentsScreen, icon: 'card', iconOut: 'card-outline', label: 'Pay' },
    { name: 'Community', component: CommunityScreen, icon: 'people', iconOut: 'people-outline', label: 'Community' },
    { name: 'Notices', component: NoticesScreen, icon: 'newspaper', iconOut: 'newspaper-outline', label: 'Notices' },
    { name: 'Profile', component: ProfileScreen, icon: 'person', iconOut: 'person-outline', label: 'Profile' },
  ];

  if (userRole === 'MODERATOR' || userRole === 'ADMIN') {
    tabs.splice(1, 0, {
      name: 'Moderator',
      component: ModeratorMembersScreen,
      icon: 'people-circle',
      iconOut: 'people-circle-outline',
      label: 'Moderator',
    });
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = tabs.find(t => t.name === route.name);
        return {
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? tab.icon : tab.iconOut} size={size} color={color} />
          ),
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarStyle: {
            backgroundColor: COLORS.white,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            paddingBottom: 8,
            paddingTop: 8,
            height: 64,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        };
      }}
    >
      {tabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ tabBarLabel: tab.label }}
        />
      ))}
    </Tab.Navigator>
  );
}
