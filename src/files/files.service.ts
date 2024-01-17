import { FirebaseOptions, initializeApp } from 'firebase/app';
// src/files/firebase-storage.service.ts
import { Injectable } from '@nestjs/common';
//import { initializeApp } from 'firebase-admin';
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';

@Injectable()
export class FirebaseStorageService {
  private readonly storage;

  constructor() {
    this.initializeFirebase(); // Configurar con tu configuración de Firebase
    this.storage = getStorage();
  }
  private initializeFirebase() {
    const firebaseConfig: FirebaseOptions = {
        apiKey: process.env.apiKey,
        authDomain: process.env.apiKey,
        projectId: process.env.projectId,
        storageBucket: process.env.storageBucket,
        messagingSenderId: process.env.messagingSenderId,
        appId: process.env.appId,
        measurementId: process.env.measurementId
    };
  }
  async uploadFile(file: any, fileName: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, `images/${fileName}`);
      const snapshot = await uploadBytesResumable(storageRef, file.buffer);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
        throw new Error(`Error uploading file to Firebase Storage: ${error.message}`);
      }
    }
    async deleteFile(imageName: string): Promise<void> {
      try {
        //SE GENERA LA UBICACION DEL DOCUMENTO A ELIMINAR
        const storageRef = ref(this.storage, `images/${imageName}`);
        await deleteObject(storageRef);
      } catch (error) {
        console.error(`Error eliminando archivo ${imageName} de Firebase Storage: ${error.message}`);
        throw new Error(`Error eliminando archivo ${imageName}`);
      }
    }
  }

