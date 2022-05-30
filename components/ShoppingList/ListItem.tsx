import { useState, useRef, useEffect } from 'react';
import { View, TextInput, Keyboard, StyleSheet } from 'react-native';
import { IconButton, Colors, TouchableRipple, Checkbox } from 'react-native-paper'; 

interface ListItemWrapperProps {
    item: string,
    index: number,
    updateValue: (text: string, index: number) => void,
    insertAfter: (index: number) => void,
    removeItem: (index: number) => void,
    selectedItems: Array<number>,
    setSelectedItems: (val: Array<number>) => void,
    selectMode: boolean,
    setSelectMode: (val: boolean) => void,
}

export default function ListItem({
    item,
    index,
    updateValue,
    insertAfter,
    removeItem,
    selectedItems,
    setSelectedItems,
    selectMode,
    setSelectMode
}: ListItemWrapperProps) {
    const [checked, setChecked] = useState<boolean>(false);
    const textInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (!selectMode) setChecked(false);
    },[selectMode])
    
    const removeFromArray = () => {
        setSelectedItems(selectedItems.filter(item => item !== index));
    }

    const addToArray = () => {
        setSelectedItems([...selectedItems, index])
    }

    const handleCheck = (checked: boolean) => {
        // update state value
        setChecked(checked);

        // update array
        if (checked) addToArray()
        else removeFromArray();
    }

    const handlePress = () => {
        if (!selectMode)
            return textInputRef.current && textInputRef.current.focus();

        handleCheck(!checked)
    }

    return (
        <TouchableRipple 
            onPress={handlePress}
            onLongPress={() => setSelectMode(!selectMode)}
            rippleColor="rgba(0, 0, 0, .16)"
        >
            <View style={styles.parent}>
                { selectMode ? 
                    <Checkbox 
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            handleCheck(!checked);
                        }}
                    /> :
                    <IconButton 
                        icon="plus"
                        color={Colors.grey200}
                        size={20}
                        onPress={() => insertAfter(index)}
                    />
                }
                <TextInput 
                    value={item}
                    ref={textInputRef}
                    onChangeText={(text: string) => updateValue(text, index)}
                    // hide keyboard
                    onSubmitEditing={Keyboard.dismiss}
                />
                <IconButton 
                    style={styles.closeButton}
                    icon="close"
                    color={Colors.grey100}
                    size={20}
                    onPress={() => removeItem(index)}
                />
            </View>
        </TouchableRipple>
    )
}

const styles = StyleSheet.create({
    parent: {
        flexDirection: 'row',
        width: "100%"
    },
    closeButton: {
        marginLeft: "auto"
    },
  });
