import { SafeAreaView } from "react-native";
import TodoApp from "./src/components/TodoApp";

import store from "./src/redux/store";
import { Provider } from "react-redux";

export default function App() {
  const RootApp = () => {
    return (
      <SafeAreaView>
        <TodoApp />
      </SafeAreaView>
    );
  };

  return (
    <Provider store={store}>
      <RootApp />
    </Provider>
  );
}