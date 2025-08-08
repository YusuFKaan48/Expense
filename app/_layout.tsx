import { Slot } from 'expo-router';
import './global.css';
import Toast, { BaseToast, ErrorToast, ToastProps } from 'react-native-toast-message';

const toastConfig = {
    success: (props: ToastProps) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: 'green', backgroundColor: '#121826' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'white'
            }}
            text2Style={{
                color: 'white'
            }}
        />
    ),
    error: (props: ToastProps) => (
        <ErrorToast
            {...props}
            style={{ borderLeftColor: 'red', backgroundColor: '#121826' }}
            text1Style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'white'
            }}
            text2Style={{
                color: 'white'
            }}
        />
    ),
};

export default function RootLayout() {
    return (
        <>
            <Slot />
            <Toast config={toastConfig} topOffset={66} />

        </>
    );
}
