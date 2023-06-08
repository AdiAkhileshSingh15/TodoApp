import React from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    TextInput,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { setTodos } from '../redux/todoSlice';

const COLORS = { primary: 'black', white: 'white' };

const TodoApp = () => {

    const dispatch = useDispatch()
    const todos = useSelector(state => state.todos)
    const [textInput, setTextInput] = React.useState('');

    React.useEffect(() => {
        getTodosFromUserDevice();
    }, []);

    React.useEffect(() => {
        saveTodoToUserDevice(todos);
    }, [todos]);

    const addTodo = () => {
        if (textInput == '') {
            Alert.alert('Error', 'Please input todo');
        } else {
            const newTodo = {
                id: Math.random(),
                task: textInput,
                completed: false,
            };
            dispatch(setTodos([...todos, newTodo]));
            setTextInput('');
        }
    };

    const saveTodoToUserDevice = async todos => {
        try {
            const stringifyTodos = JSON.stringify(todos);
            await AsyncStorage.setItem('todos', stringifyTodos);
        } catch (error) {
            console.log(error);
        }
    };

    const getTodosFromUserDevice = async () => {
        try {
            const todos = await AsyncStorage.getItem('todos');
            if (todos != null) {
                dispatch(setTodos(JSON.parse(todos)));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const markTodoComplete = todoId => {
        const newTodosItem = todos.map(item => {
            if (item.id == todoId) {
                return { ...item, completed: true };
            }
            return item;
        });

        dispatch(setTodos(newTodosItem));
    };

    const markTodoIncomplete = todoId => {
        const newTodosItem = todos.map(item => {
            if (item.id == todoId) {
                return { ...item, completed: false };
            }
            return item;
        });

        dispatch(setTodos(newTodosItem));
    };

    const deleteTodo = todoId => {
        const newTodosItem = todos.filter(item => item.id != todoId);
        dispatch(setTodos(newTodosItem));
    };

    const clearAllTodos = () => {
        Alert.alert('Confirm', 'Clear todos?', [
            {
                text: 'Yes',
                onPress: () => dispatch(setTodos([])),
            },
            {
                text: 'No',
            },
        ]);
    };

    const ListItem = ({ todo }) => {
        return (
            <View style={styles.listItem}>

                {!todo?.completed ? (
                    <TouchableOpacity onPress={() => markTodoComplete(todo.id)} style={[styles.actionIcon, { backgroundColor: 'white', borderWidth: 1, borderColor: 'grey' }]} />
                ) : (
                    <TouchableOpacity onPress={() => markTodoIncomplete(todo.id)}>
                        <View style={[styles.actionIcon, { backgroundColor: '#7F56D9' }]}>
                            <Ionicons name="checkmark" size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                )}

                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontWeight: '500',
                            fontSize: 17,
                            color: '#30374F',
                            textDecorationLine: todo?.completed ? 'line-through' : 'none',
                            paddingHorizontal: 10
                        }}>
                        {todo?.task}
                    </Text>
                </View>

                <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                    <View style={styles.actionIcon}>
                        <Ionicons name="trash" size={20} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <View>
            <View style={styles.header}>
                <Text
                    style={{
                        fontWeight: '700',
                        fontSize: 25,
                        color: COLORS.primary,
                    }}>
                    TODO APP
                </Text>
            </View>

            <View style={[styles.title, { alignItems: 'center', flexDirection: 'column' }]}>
                <Text
                    style={{
                        fontWeight: '500',
                        fontSize: 21,
                        color: '#111322',
                    }}>
                    Task Details
                </Text>
            </View>

            <View style={[styles.title, { flexDirection: 'column' }]}>
                <Text
                    style={{
                        fontWeight: '500',
                        fontSize: 19,
                        color: '#5D6B98',
                    }}>
                    Task Title
                </Text>
                <Text
                    style={{
                        fontWeight: '600',
                        fontSize: 23,
                        color: '#1D2939',
                        paddingVertical: 5
                    }}>
                    NFT Web App Prototype
                </Text>
            </View>

            <View style={[styles.title, { flexDirection: 'column' }]}>
                <Text
                    style={{
                        fontWeight: '500',
                        fontSize: 19,
                        color: '#5D6B98',
                    }}>
                    Descriptions
                </Text>
                <Text
                    style={{
                        fontWeight: '500',
                        fontSize: 15,
                        color: '#111322',
                        paddingVertical: 5
                    }}>
                    Last year was a fantastic year for NFTs, with the market
                    reaching a $40 billion valuation for the first time. In
                    addition, more than $10 billion worth of NFTs are now sold
                    every week – with NFT..
                </Text>
            </View>

            <View style={styles.title}>
                <Text
                    style={{
                        fontWeight: '500',
                        fontSize: 19,
                        color: '#5D6B98',
                    }}>
                    Task List
                </Text>
                <Ionicons name="trash" size={25} color="red" onPress={clearAllTodos} />
            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                data={todos}
                renderItem={({ item }) => <ListItem todo={item} />}
            />

            <KeyboardAvoidingView style={styles.footer} behavior="padding" keyboardVerticalOffset={10}>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={textInput}
                        placeholder="Add Task"
                        onChangeText={text => setTextInput(text)}
                    />
                </View>
                <TouchableOpacity onPress={addTodo}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="add" color="white" size={30} />
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
    },
    inputContainer: {
        height: 50,
        paddingHorizontal: 20,
        paddingVertical: 10,
        elevation: 40,
        backgroundColor: COLORS.white,
        flex: 1,
        marginVertical: 20,
        marginRight: 20,
        borderRadius: 30,
    },
    iconContainer: {
        height: 50,
        width: 50,
        backgroundColor: '#7F56D9',
        elevation: 40,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listItem: {
        padding: 20,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        elevation: 12,
        borderRadius: 7,
        marginVertical: 10,
    },
    actionIcon: {
        height: 25,
        width: 25,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        marginLeft: 5,
        borderRadius: 25 / 2,
    },
    header: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        paddingVertical: 6,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default TodoApp;