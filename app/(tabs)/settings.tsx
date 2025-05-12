import { ThemedText as Text } from '@/components/ui/ThemedText';
import { ThemedView as View } from '@/components/ui/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import React, { useState } from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Switch,

    useWindowDimensions,
} from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle} type="title">{title}</Text>
    {children}
  </View>
);

// --- Tabs ---
const GeneralTab = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <ScrollView style={[styles.tabContent, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}>
      <Section title="Preferences">
        <View style={styles.row}>
          <Text style={styles.label} type="subtitle">Dark Mode</Text>
          <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label} type="subtitle">Notifications</Text>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
      </Section>
    </ScrollView>
  );
};

const SecurityTab = () => {
  const { theme } = useTheme();
  return (
    <ScrollView style={[styles.tabContent, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}>
      <Section title="Security Settings">
        <View style={styles.row}>
          <Text style={styles.label}>Biometric Login</Text>
          <Switch value={true} disabled />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Auto-Lock After 1 Minute</Text>
          <Switch value={true} disabled />
        </View>
      </Section>
    </ScrollView>
  );
};

const AboutTab = () => {
  const { theme } = useTheme();
  return (
    <ScrollView style={[styles.tabContent, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}>
      <Section title="App Info">
        <Text style={styles.text}>Version: 1.0.0</Text>
        <Text style={styles.text}>Build: 100</Text>
      </Section>
      <Section title="Legal">
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://example.com/privacy')}>
          Privacy Policy
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://example.com/terms')}>
          Terms of Service
        </Text>
      </Section>
    </ScrollView>
  );
};

// --- Main ---
export default function SettingsScreen() {
  const { theme } = useTheme();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'general', title: 'General' },
    { key: 'security', title: 'Security' },
    { key: 'about', title: 'About' },
  ]);

  const renderScene = SceneMap({
    general: GeneralTab,
    security: SecurityTab,
    about: AboutTab,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={[styles.tabBar, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}
            activeColor="#1E90FF"
            inactiveColor="#888"
            pressColor="#ddd"
          />
        )}
      />
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
  },
  header: {
    padding: 16,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  tabBar: {
    // backgroundColor: 'white',
    elevation: 0,
    borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  tabLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
  indicator: {
    backgroundColor: '#1E90FF',
    height: 3,
    borderRadius: 2,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
   
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
   
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#444',
  },
  text: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
  },
  link: {
    fontSize: 15,
    color: '#1E90FF',
    marginBottom: 6,
  },
});
