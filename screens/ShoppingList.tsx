import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { IconButton, Colors } from 'react-native-paper'; 
import { View } from '../components/Themed';
import ListItemWrapper from '../components/ShoppingList/ListItemWrapper';
import ListItem from '../components/ShoppingList/ListItem';
import SelectMenu from '../components/ShoppingList/SelectMenu';

export default function ShoppingList() {
  const [itemsList, setItemsList] = useState<Array<string>>(['hello', 'nice']);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Array<number>>([]);

  const updateItem = (text: string, index: number) => {
    setItemsList(itemsList.map((item, index2) => 
      index === index2
      ? item = text 
      : item 
    ))
    // TODO: focus on the next 
  }

  const insertAfterItem = (index: number) => {
    const newList = [...itemsList];
    newList.splice(index + 1, 0, '');
    // updates with the new list
    setItemsList(newList);
  }

  const removeItem = (index: number) => {
    // update the list of items
    const newList = [...itemsList];
    newList.splice(index, 1);
    setItemsList(newList)

    // remove from list of checked items
    setSelectedItems(selectedItems.filter(item => item !== index))
  }

  const deleteCheckedItems = () => {
    // remove from items list
    const newList = itemsList.filter((_v, index) => !selectedItems.includes(index))
    setItemsList(newList);
    // clear checked items
    setSelectedItems([]);
    setSelectMode(false);
  }

  return (
    <View style={styles.container}>
      { selectMode && <SelectMenu selectMode={selectMode} setSelectMode={setSelectMode} deleteCheckedItems={deleteCheckedItems}/>}

      <ListItemWrapper>
        {
          itemsList.length > 0 ?
          itemsList.map((item, index) => <ListItem
            item={item}
            key={index}
            index={index}
            updateValue={updateItem}
            insertAfter={insertAfterItem}
            removeItem={removeItem}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            selectMode={selectMode}
            setSelectMode={setSelectMode}
          />) :
          <IconButton 
                icon="plus"
                color={Colors.grey200}
                size={20}
                onPress={() => insertAfterItem(0)}
            />
        }
      </ListItemWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 5,
    paddingRight: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
});
