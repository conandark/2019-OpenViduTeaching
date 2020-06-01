import { OpenViduSessionService } from 'src/app/shared/services/openvidu-session/openvidu-session.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { Session } from 'openvidu-browser';
import { RoomService } from 'src/app/shared/services/room/room.service';

@Component({
  selector: 'app-assistants',
  templateUrl: './assistants.component.html',
  styleUrls: ['./assistants.component.css']
})
export class AssistantsComponent implements OnInit {

  session: Session;
  userName: string;

  loading: boolean;

  constructor(
    private userService: UserService,
    private openviduSessionService: OpenViduSessionService,
    private roomSrv: RoomService
  ) { }

  moderatorsConnected: string[] = [];
  participantsConnected: string[] = [];
  presentersConnected: string[] = [];
  assistantsConnectedCount: Number;

  moderatorsDisconnected: string[] = [];
  participantsDisconnected: string[] = [];
  presentersDisconnected: string[] = [];
  assistantsDisconnectedCount: Number;

  ngOnInit() {
    this.session = this.openviduSessionService.getWebcamSession();
    this.userName = this.userService.user.name;
    this.getAssistants();
  }

  getAssistants() {
    this.loading = true;
    this.roomSrv.getAssistants(this.session.sessionId).subscribe(
      assistants => {
        this.moderatorsConnected = [];
        this.participantsConnected = [];
        this.presentersConnected = [];

        this.moderatorsDisconnected = [];
        this.participantsDisconnected = [];
        this.presentersDisconnected = [];

        for(let moderator of assistants.moderators) {
          if(moderator.connected) {
            this.moderatorsConnected.push(moderator.name);
          } else {
            this.moderatorsDisconnected.push(moderator.name);
          }
        }

        for(let participant of assistants.participants) {
          if(participant.connected) {
            this.participantsConnected.push(participant.name);
          } else {
            this.participantsDisconnected.push(participant.name);
          }
        }

        for(let presenter of assistants.presenters) {
          if(presenter.connected) {
            this.presentersConnected.push(presenter.name);
          } else {
            this.presentersDisconnected.push(presenter.name);
          }
        }

        this.assistantsConnectedCount = this.moderatorsConnected.length + this.participantsConnected.length + this.presentersConnected.length;
        this.assistantsDisconnectedCount = this.moderatorsDisconnected.length + this.participantsDisconnected.length + this.presentersDisconnected.length;

        this.loading = false;
      },
      error => console.log(error)
    );
  }
}
