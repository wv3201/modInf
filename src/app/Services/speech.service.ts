import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  speechRecognition: any;
  msg:string='';
  constructor(private zone: NgZone) {
  }

  record(): Observable<string> {

      return Observable.create(observer => {
          const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
          this.speechRecognition = new webkitSpeechRecognition();
          //this.speechRecognition = SpeechRecognition;
          this.speechRecognition.continuous = false;
          //this.speechRecognition.interimResults = true;
          this.speechRecognition.lang = 'es-mx';
          this.speechRecognition.maxAlternatives = 1;
          this.speechRecognition.onresult = speech => {
            this.msg=(speech.results[speech.resultIndex][0].transcript);
              let term: string = ""; 

              if (speech.results) {
                  var result = speech.results[speech.resultIndex];
                  var transcript = result[0].transcript;
                  if (result.isFinal) {
                      if (result[0].confidence < 0.2) {
                          console.log("Unrecognized result - Please try again");
                      }
                      else {
                          term += _.trim(transcript);
                          console.log("Did you said? -> " + term + " , If not then say something else...");
                      }
                  }
              }
              this.zone.run(() => {
                  observer.next(this.msg);
              });
          };
          this.speechRecognition.onerror = error => {
              observer.error(error);
          };

          this.speechRecognition.onend = () => {
              observer.complete();
          };

          this.speechRecognition.start();
          console.log("Say something - We are listening !!!");
      });
  }
  show(): Observable<string> {

    return Observable.create(observer => {
          const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
          this.speechRecognition = new webkitSpeechRecognition();
          //this.speechRecognition = SpeechRecognition;
          this.speechRecognition.continuous = false;
          this.speechRecognition.interimResults = true;
          this.speechRecognition.lang = 'es-mx';
          this.speechRecognition.maxAlternatives = 2;
          this.speechRecognition.onresult = speech => {
            console.log(_.trim(speech.results[speech.resultIndex][0].transcript))
          this.msg=_.trim(speech.results[speech.resultIndex][0].transcript);
              this.zone.run(() => {
                  observer.next(this.msg);
              });
          };
          this.speechRecognition.onerror = error => {
              observer.error(error);
          };

          this.speechRecognition.onend = () => {
              observer.complete();
          };

          this.speechRecognition.start();
          console.log("Say something - We are listening !!!");
      });
    }
    show2(): Observable<string> {

    return Observable.create(observer => {
          const { webkitSpeechRecognition }: IWindow = <IWindow><unknown>window;
          this.speechRecognition = new webkitSpeechRecognition();
          //this.speechRecognition = SpeechRecognition;
          this.speechRecognition.continuous = false;
          this.speechRecognition.interimResults = true;
          this.speechRecognition.lang = 'es-mx';
          this.speechRecognition.maxAlternatives = 8;
          this.speechRecognition.onsoundstart = speech => {
            console.log(_.trim(speech.results[speech.resultIndex][0].transcript))
          this.msg=_.trim(speech.results[speech.resultIndex][0].transcript);
              this.zone.run(() => {
                  observer.next(this.msg);
              });
          };
          this.speechRecognition.onerror = error => {
              observer.error(error);
          };

          this.speechRecognition.onend = () => {
              observer.complete();
          };

          this.speechRecognition.start();
          console.log("Say something - We are listening !!!");
      });
    }
  DestroySpeechObject() {
      if (this.speechRecognition)
          this.speechRecognition.stop();
  }
}
