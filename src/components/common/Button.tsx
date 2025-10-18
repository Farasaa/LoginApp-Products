import React from 'react';
import { ViewStyle, StyleProp, StyleSheet, TouchableOpacity, Text} from 'react-native';

interface ButtonProps {
    title?: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

const CustomButton = ({title = 'Button', onPress, style, disabled}: ButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, style]}
            disabled={disabled || false}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    }
})

export default CustomButton;