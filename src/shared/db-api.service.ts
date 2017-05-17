import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from './../providers/auth-service';

@Injectable()
export class DbApiService {
  tracks: FirebaseListObservable<any[]>;
  likes: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase, private auth: AuthService) {

  }

  // this.item = db.object('/item', { preserveSnapshot: true });
  // this.item.subscribe(snapshot => {
  //   console.log(snapshot.key)
  //   console.log(snapshot.val())
  // });

  getCurrentUser() {
    return this.auth.getCurrentUser();
  }

  getTracks(): FirebaseListObservable<any[]> {
    this.tracks = this.db.list('/tracks');
    return this.tracks;
  }

  signInWithFacebook(facebookData) {
    this.db.list('/users').update(facebookData.user.uid, {
      email: facebookData.user.email,
      likes: 0,
      name: facebookData.user.displayName,
      profile_image: facebookData.user.photoURL
    });
  }

  getLikes() {
    this.likes = this.db.list('/users/' + this.auth.getCurrentUser().uid + '/likes');
    return this.likes;
  }

  likeTrack(track_id) {
    this.db.database.ref('/users/' + this.auth.getCurrentUser().uid + '/likes/').child(track_id).set(track_id);
    this.db.database.ref('/tracks/' + track_id).once('value').then((snapshot) => {
      this.db.list('/tracks').update(track_id, {
        likes: snapshot.val().likes + 1
      })
    })
  }

  disLikeTrack(track_id) {
    this.db.database.ref('/users/' + this.auth.getCurrentUser().uid + '/likes/' + track_id).remove();
    this.db.database.ref('/tracks/' + track_id).once('value').then((snapshot) => {
      this.db.list('/tracks').update(track_id, {
        likes: snapshot.val().likes - 1
      })
    })
  }
}