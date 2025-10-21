import { Colors } from "@/constants/theme";
import React, { useState } from "react";

import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { create } from "zustand";
import { getMusic } from '../core/engine/media/load';

// ✅ Zustand store for todos
type Todo = { id: string; text: string; completed: boolean };
type TodoStore = {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
};

const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  addTodo: (text) =>
    set((state) => ({
      todos: [
        ...state.todos,
        { id: Date.now().toString(), text, completed: false },
      ],
    })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    })),
  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
}));

// ✅ Main App component
export default function Home({ navigation }: any) {
  const [text, setText] = useState("");
  const { todos, addTodo, toggleTodo, removeTodo } = useTodoStore();

  const handleAdd = () => {
    if (!text.trim()) return;
    addTodo(text.trim());
    setText("");
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity onPress={() => toggleTodo(item.id)} style={{ flex: 1 }}>
        <Text
          style={[
            styles.todoText,
            item.completed && { textDecorationLine: "line-through", opacity: 0.5 },
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeTodo(item.id)}>
        <Text style={styles.deleteButton}>🗑</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📝 To-Do List</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={() => {
          getMusic().then((_) => { console.log(_) });
          navigation.navigate("Splash")
        }}>
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet ✨</Text>}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    marginLeft: 10,
    borderRadius: 10,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    lineHeight: 24,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  todoText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    fontSize: 18,
    color: "#f44336",
    paddingLeft: 10,
  },
  emptyText: {
    color: "#777",
    textAlign: "center",
    marginTop: 50,
  },
});