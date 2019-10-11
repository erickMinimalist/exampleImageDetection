import { Component, OnInit } from '@angular/core';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { NavController, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {ImageDetectionService} from 'src/app/image-detection.service';

//Declaración del variable del Plugin
declare var ImageDetectionPlugin: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  cordova: any;
  currentImage: any;
  
  // ImageDetectionPlugin: any;
  constructor(public navCtrl: NavController, public platform: Platform,private camera: Camera, public ImageDetection: ImageDetectionService) { }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
      console.log("Camera issue:" + err);
    });
  }
  ngOnInit() {
    //Verifica si ya se encuentra lista la plataforma  
    this.platform.ready().then(() => {
      //Realiza el llamado al plugin e invoca segun el resultado la funcion correspondiente
      let patternsHolder: any = [];
      let loadAllImg: number = 0;
      var indexes: any = {};
      let limit: number = 3;
      ImageDetectionPlugin.prototype.startProcessing(true, this.successCallback, this.errorCallback);
      
      ImageDetectionPlugin.prototype.isDetecting(function (success) {
        console.log('Success', success);
        var resp = JSON.parse(success);
        console.log(resp.index, "image detected - ", indexes[resp.index]);
        alert("Index detected: " + resp.index + ", image detected - " + indexes[resp.index]);
        stopScanning();
      }, function (error) { console.log("Image no detected",error); alert("Image no detected") });

      function setAllPatterns(patterns) {
        console.log('Patterns', patterns);
        ImageDetectionPlugin.prototype.setPatterns(patterns, function (success) { console.log(success); }, function (error) { console.log(error); });
      }

      function ToDataURL(self) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = self.height;
        canvas.width = self.width;
        ctx.drawImage(self, 0, 0);
        dataURL = canvas.toDataURL("image/jpeg", 0.8);
        patternsHolder.push(dataURL);
        indexes[loadAllImg] = self.src.substr(self.src.lastIndexOf("/") + 1);
        loadAllImg += 1;
        console.log("!!!", loadAllImg, indexes);
        if (loadAllImg == limit) {
          console.log("patterns set", patternsHolder);
          setAllPatterns(patternsHolder);
        }
        canvas = null;
      }

      var img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        ToDataURL(this)
      };
      img.src = "/assets/target1.jpg";

      var img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        ToDataURL(this)
      };
      img.src = "/assets/target2.jpg";

      var img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        ToDataURL(this)
      };
      img.src = "/assets/target3.jpg";

      ImageDetectionPlugin.prototype.setDetectionTimeout(10, function (success) { console.log(success); }, function (error) { console.log(error); });
      function stopScanning () {
        ImageDetectionPlugin.prototype.stop(function(success) {
          console.info("Stop successfully", success);
        }, function(error){
          console.error("StopScanning", error);
        });
        }
    });
  }


  //Funcion para desplegar la respuesta cuando es satisfactorio
  successCallback(message) {
    alert(message);
  }

  //Funcion si hubo un error
  errorCallback() {
    alert("Hubo un error");
  }

}
