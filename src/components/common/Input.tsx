import React from 'react';
import { TextInput, StyleSheet, ViewStyle, StyleProp, KeyboardTypeOptions, TextInputSelectionChangeEventData, NativeSyntheticEvent} from 'react-native';


interface InputProps {
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    style?: StyleProp<ViewStyle>;
    value?: string;
    onChangeText?: (text: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    onSubmitEditing?: () => void;
    onEndEditing?: () => void;
    onSelectionChange?: (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => void;
    required?: boolean;
    secureTextEntry?: boolean;
}

const emailInput = ({placeholder = 'Email', keyboardType = 'email-address', style, value, onChangeText, onBlur, onFocus, onSubmitEditing, onEndEditing, onSelectionChange, secureTextEntry}: InputProps) => {
    return (
        <TextInput
            placeholder={placeholder}
            keyboardType={keyboardType}
            style={[styles.input, style]}
            value={value}
            onChangeText={onChangeText}
            onBlur={onBlur}
            onFocus={onFocus}
            onSubmitEditing={onSubmitEditing}
            onEndEditing={onEndEditing}
            onSelectionChange={onSelectionChange}
            secureTextEntry={secureTextEntry}
        />
    )
}
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
      },
})
export default emailInput;