import firebase from 'firebase/app'
import 'firebase/storage'
import {upload} from './upload.js'


const firebaseConfig = {
  apiKey: "AIzaSyA2oWS79rGhM1VpsbLGXHRuCK-f6CUsmbw",
  authDomain: "upload-18db8.firebaseapp.com",
  projectId: "upload-18db8",
  storageBucket: "upload-18db8.appspot.com",
  messagingSenderId: "451590586225",
  appId: "1:451590586225:web:efebc68e4f1cf3d21680d0",
};

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`)
      const task = ref.put(file)

      task.on('state_changed', snapshot => {
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
        const block = blocks[index].querySelector('.preview-info-progress')
        block.textContent = percentage
        block.style.width = percentage
      }, error => {
        console.log(error)
      }, () => {
        task.snapshot.ref.getDownloadURL().then(url => {
          console.log('Download URL', url)
        })
      })
    })
  }
})