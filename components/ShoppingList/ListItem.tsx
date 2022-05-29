import { useRef } from 'react';
import { View, TextInput, Keyboard, StyleSheet } from 'react-native';
import { IconButton, Colors } from 'react-native-paper'; 

interface ListItemWrapperProps {
    item: string,
    index: number,
    updateValue: (text: string, index: number) => void,
    insertAfter: (index: number) => void,
    removeItem: (index: number) => void,
}

export default function ListItem({ item, index, updateValue, insertAfter, removeItem }: ListItemWrapperProps) {

    return (
        <View style={styles.parent}>
            <IconButton 
                icon="plus"
                color={Colors.grey200}
                size={20}
                onPress={() => insertAfter(index)}
            />
            <TextInput 
                value={item}
                onChangeText={(text: string) => updateValue(text, index)}
                // hide keyboard
                onSubmitEditing={Keyboard.dismiss}
            />
            <IconButton 
                style={styles.closeButton}
                icon="close"
                color={Colors.red500}
                size={20}
                onPress={() => removeItem(index)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    parent: {
        flexDirection: 'row',
        width: "100%"
    },
    closeButton: {
        marginLeft: "auto"
    }
  });
