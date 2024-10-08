import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    iconeButton: {
        backgroundColor: '#FF8C00',
        width: '12%',
        margin: 20,
        padding: 10,
        borderRadius: 2000,
        alignItems: 'center',
    },
    altButton: {
        backgroundColor: '#FF8C00',
        width: '80%',
        margin: 25,
        padding: 10,
        borderRadius: 2,
        alignItems: 'center',
    },
    icone: {
        width: 25, 
        height: 25, 
        resizeMode: 'center', 
      },
    item: {
        padding: 10,
        marginVertical: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
      },
    loginTitle: {
        fontSize: 15,
        fontFamily: 'Roboto',
        textAlign: 'left',
        width: 285,
    },
    image: {
        width: 500, 
        height: 200, 
        margin: -40,
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
        width: '30%',
        margin: 10,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
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