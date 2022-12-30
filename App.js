import 'react-native-get-random-values';
import uuid from 'react-native-uuid';

import { MMKVLoader } from 'react-native-mmkv-storage';

import React, { useState, useEffect } from 'react';
import {View, StyleSheet, FlatList, Alert, StatusBar, Platform} from 'react-native';

import Header from './components/Header';
import ListItem from './components/ListItem';
import AddItem from './components/AddItem';
import ClearItems from './components/ClearItems';

const App = () => {
  const KEY = 'data';
  const MMKV = new MMKVLoader().initialize();

  const storedData = JSON.parse(MMKV.getString(KEY));
  console.log(storedData);

  const [items, setItems] = useState(storedData === '' ? [] : storedData);

  /*
  useEffect(() => {
    let data = JSON.stringify(items);
    MMKV.setString(data);

    data = JSON.parse(MMKV.getString(KEY));
    console.log('useEffect: ' + data);
  }, [items]);
  */

  /*
  const interval = setInterval(() => {
    console.log(items, items.length);
  }, 5000);
  */



  const deleteItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id != id));

  }

  const addItem = (text) => {
    if (text !== '') {      
      setItems(prevItems => [{id: uuid.v4(), text: text.trim()}, ...prevItems]);
      setItems(prevItems => prevItems.sort((a, b) => a.text.localeCompare(b.text)));
      
      let data = JSON.stringify(items);
      //MMKV.setString(KEY, data);
      MMKV.setStringAsync(KEY, data);
      //clearInterval(interval);
      /*
      data = JSON.parse(MMKV.getString(KEY));
      console.log('SETTIMEOUT ' + MMKV.getString(KEY));
      */
    }
    else {
        Alert.alert(
          'Empty shopping list...', 
          'Please enter one or more items.',
          [
            {text: 'Got it'}
          ],
          Platform.OS === 'android' && {
            cancelable: true
          }
        );
    }
  }

  const clearItems = () => {
    const alertTitle = 'Think twice...';
    const alertSubtitle = 'Are you sure you want to delete all shopping items?';
    const cancelBtnTxt = 'Cancel';
    const deleteBtnTxt = 'delete all';

    Alert.alert (
      alertTitle, 
      alertSubtitle,
      [
        {
          text: cancelBtnTxt,
          style: "cancel",
        },
        {
          text: deleteBtnTxt,
          onPress: () => {
            MMKV.setStringAsync(KEY, JSON.stringify([]));
            const data = JSON.parse(MMKV.getString(KEY));
            setItems(data);
          },
          style: 'destructive'
        }
      ],
      Platform.OS === 'android' && {
        cancelable: true,
      }
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <AddItem addItem={addItem} items={items}/>
      <FlatList 
        data={items}
        renderItem={({item}) => <ListItem item={item} deleteItem={deleteItem}/>}
      />
      <StatusBar />
      {!!items.length && <ClearItems clearItems={clearItems}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  desctructive: {
    color: 'red'
  }
});

export default App;