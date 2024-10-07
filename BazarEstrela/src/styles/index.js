import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    loginTitle: {
        fontSize: 15,
        fontFamily: 'Roboto',
        textAlign: 'left',
        width: 285,
    },
    image: {
        width: 500, 
        height: 200, 
        resizeMode: 'center', 
      },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FF8C00',
        margin: 10,
    },
    formInput: {
        borderColor: '#FF8C00',
        borderWidth: 1,
        borderRadius: 1,
        fontSize: 22,
        width: '80%',
        padding: 10,
        margin: 10,
    },
    formButton: {
        backgroundColor: '#FF8C00',
        widith: '80%',
        margin: 10,
        padding: 10,
        borderRadius: 10,
        alignnItems: 'center',
    },
    textButton:{
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    subContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    subButton: {
        padding:10,
    },
    subTextButton: {
        color: '#FF8C00',
    }
});