// test/firebase.test.js
import { firebaseApp, initAuth } from "../src/firebase/firebase.config"; // ajuste o caminho conforme necessário
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("firebase/app");
jest.mock("firebase/auth", () => ({
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn().mockReturnValue(jest.fn()),
}));
jest.mock("@react-native-async-storage/async-storage");

describe("Firebase Configuration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize Firebase app", () => {
    firebaseApp();

    expect(initializeApp).toHaveBeenCalledWith({
      apiKey: "AIzaSyCYsI8WOJKl1hfyFOxiWSzpyjB2mZ3bgv8",
      authDomain: "bazarestrela-d30a2.firebaseapp.com",
      projectId: "bazarestrela-d30a2",
      storageBucket: "bazarestrela-d30a2.appspot.com", 
      messagingSenderId: "828086429120",
      appId: "1:828086429120:web:b18dafee8693d9c64b9425",
    });
  });

  it("should initialize Auth with AsyncStorage persistence", () => {
    initAuth();

    expect(initializeAuth).toHaveBeenCalledWith(firebaseApp(), {
      persistence: expect.any(Function),
    });
    expect(getReactNativePersistence).toHaveBeenCalledWith(AsyncStorage);
  });
});
