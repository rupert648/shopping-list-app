import {useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import { IconButton, Colors } from 'react-native-paper';
import { View } from '../Themed';

interface SelectMenuProps {
    selectMode: boolean,
    setSelectMode: (val: boolean) => void,
    deleteCheckedItems: () => void,
}

export default function SelectMenu({selectMode, setSelectMode, deleteCheckedItems}: SelectMenuProps) {

    return (
        <View style={{...styles.container, ...(selectMode ? styles.binVisible : styles.binHidden)}}>
            <IconButton 
                icon="checkbox-outline"
                color={Colors.grey500}
                size={30}
                onPress={() => setSelectMode(!selectMode)}
            />
            <IconButton 
                icon="trash-can-outline"
                color={Colors.red400}
                size={30}
                onPress={deleteCheckedItems}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row"
    },
    binHidden: {
        marginTop: 57
    },
    binVisible: {
        marginTop: 0,
        paddingLeft: "70%",
    }
});