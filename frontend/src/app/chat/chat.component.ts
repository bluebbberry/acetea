import {ChangeDetectorRef, Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {CommonModule, NgFor} from '@angular/common';
import { MicroblogService } from "../services/microblog.service";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {HomeFeedComponent} from "./home-feed/home-feed.component";
import {LocalFeedComponent} from "./local-feed/local-feed.component";
import {GlobalFeedComponent} from "./global-feed/global-feed.component";
import {DolphinService} from "../services/dolphin.service";
import {SeLevelService} from "../services/se-level.service";
import {StatusesService} from "../services/statuses.service";
import {SemanticFeedComponent} from "./semantic-feed/semantic-feed.component";

enum Feed {
  HOME, LOCAL, GLOBAL, SEAMANTIC
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, NgFor, HomeFeedComponent, LocalFeedComponent, GlobalFeedComponent, SemanticFeedComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messages: string[] = [];
  newMessage: string = '';
  protected changed: boolean = false;
  public selectedFeed: Feed = Feed.HOME;
  protected readonly Feed = Feed;
  selection: string = "query";
  insertLabels: any;
  insertDescriptions: any;

  constructor(private http: HttpClient,
              protected microblogService: MicroblogService,
              private router: Router,
              private changeDetectionRef: ChangeDetectorRef,
              protected userService: UserService,
              protected dolphinService: DolphinService,
              protected seLevelService: SeLevelService,
              protected statusesService: StatusesService) {

    // user has already chosen sidekick, the value cannot be null
    this.microblogService.fetchHomeStatuses();
    this.microblogService.fetchLocalStatuses();
    this.microblogService.fetchGlobalStatuses();
    this.microblogService.fetchSemanticStatuses();
    this.userService.fetchUserInfo();
  }

  onInputChanged(event:any){
    console.log("clicked");
    this.newMessage=event.target.value;
  }

  clickedOnSendToMyAccount() {
    let messageToSend: string = this.newMessage;

    // if (this.selectedFeed == Feed.SEAMANTIC) {
    //   /*if (this.selection == 'query') {
    //     if (this.seLevelService.seLevel > this.seLevelService.MAXIMUM_SE_LEVEL && this.selectedFeed == Feed.SEAMANTIC) {
    //       alert("You Sea-Level is too high for another query. Try inserting knowledge into the feed to lower your sea-level!");
    //       return;
    //     }
    //     this.seLevelService.seLevel++;
    //   } else if (this.seLevelService.seLevel > 0) {
    //     this.seLevelService.seLevel--;
    //   }
    //   if (this.selection == 'insert') {
    //     messageToSend = "WIKIDATA INSERT " + this.insertLabels + ";" + this.insertDescriptions;
    //   }*/
    //   messageToSend = this.newMessage + ' #semanticweb';
    // }
    console.log("Clicked on send");
    if (messageToSend) {
      this.statusesService.statuses.push(messageToSend);
      this.microblogService.sendMessage(messageToSend, () => {
        if (this.selectedFeed == Feed.HOME) {
          this.microblogService.fetchHomeStatuses();
        } else if (this.selectedFeed == Feed.SEAMANTIC) {
          this.microblogService.fetchSemanticStatuses();
        }
      });
      this.newMessage = '';
    } else {
      alert("Failed to send a message");
    }
  }

  navigateTo(feed: Feed) {
    switch (feed) {
      case Feed.HOME:
        this.selectedFeed = Feed.HOME;
        break;
      case Feed.LOCAL:
        this.selectedFeed = Feed.LOCAL;
        break;
      case Feed.GLOBAL:
        this.selectedFeed = Feed.GLOBAL;
        break;
      case Feed.SEAMANTIC:
        this.selectedFeed = Feed.SEAMANTIC;
        break;
    }
  }

  clickedOnIcon() {
    this.router.navigate(['/']);
  }

  clickedOnEditSidekickSelection() {
    this.router.navigate(['/choose-sidekick']);
  }

  onSelectKnowledgeBit(target: any) {
    this.newMessage += target.value;
  }

  clickedOnLowerSeLevel() {
    this.router.navigate(['lower-se-level']);
  }
}
