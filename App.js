import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import PreferencesScreen from './src/screens/PreferencesScreen';
import CatalogScreen from './src/screens/CatalogScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} options={{ title: 'Tus gustos' }} />
        <Stack.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Catálogo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
