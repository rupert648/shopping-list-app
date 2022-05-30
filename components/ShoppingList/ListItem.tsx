import { useState } from 'react';
import { View, TextInput, Keyboard, StyleSheet } from 'react-native';
import { IconButton, Colors, TouchableRipple, Checkbox } from 'react-native-paper'; 

interface ListItemWrapperProps {
    item: string,
    index: number,
    updateValue: (text: string, index: number) => void,
    insertAfter: (index: number) => void,
    removeItem: (index: number) => void,
    selectMode: boolean,
    setSelectMode: (val: boolean) => void,
}

export default function ListItem({
    item,
    index,
    updateValue,
    insertAfter,
    removeItem,
    selectMode,
    setSelectMode
}: ListItemWrapperProps) {
    const [checked, setChecked] = useState<boolean>(false);

    return (
        <TouchableRipple 
            onPress={() => console.log('Pressed')}
            onLongPress={() => setSelectMode(!selectMode)}
            rippleColor="rgba(0, 0, 0, .16)"
        >
            <View style={styles.parent}>
                { selectMode ? 
                    <Checkbox 
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked(!checked);
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
    }
  });
