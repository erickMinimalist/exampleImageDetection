import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';


declare var ImageDetectionPlugin: any;

@Injectable({
  providedIn: 'root'
})
export class ImageDetectionService {

  constructor(public navCtrl: NavController, public platform: Platform) { }

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
        // console.log(resp.index, "image detected - ", this.indexes[resp.index]);
        alert("Index detected: " + resp.index);
      }, function (error) { console.log("Image no detected",error); });

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

      // ImageDetectionPlugin.prototype.setDetectionTimeout(5, function (success) { console.log(success); }, function (error) { console.log(error); });

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
