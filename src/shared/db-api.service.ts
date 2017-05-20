import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from './../providers/auth-service';

@Injectable()
export class DbApiService {
  tracks: FirebaseListObservable<any[]>;
  likes: FirebaseListObservable<any[]>;
  reposts: FirebaseListObservable<any[]>;
  users: FirebaseListObservable<any[]>;
  following: FirebaseListObservable<any[]>;
  tracks_reposts: FirebaseListObservable<any[]>;
  tracks_posts: FirebaseListObservable<any[]>;

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

  getTracksReposts(data): FirebaseListObservable<any[]> {
    this.tracks_reposts = this.db.list('/users/' + data + "/reposts");
    return this.tracks_reposts;
  }

  getTracksPosts(data): FirebaseListObservable<any[]> {
    this.tracks_posts = this.db.list('/users/' + data + "/tracks");
    return this.tracks_posts;
  }

  getUsers(): FirebaseListObservable<any[]> {
    this.users = this.db.list('/users');
    return this.users;
  }

  signInWithFacebook(facebookData) {
    this.db.list('/users').update(facebookData.user.uid, {
      email: facebookData.user.email,
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

  getReposts() {
    this.reposts = this.db.list('/users/' + this.auth.getCurrentUser().uid + '/reposts');
    return this.reposts;
  }

  repostTrack(track_id) {
    this.db.database.ref('/users/' + this.auth.getCurrentUser().uid + '/reposts/').child(track_id).set(track_id);
    this.db.database.ref('/tracks/' + track_id).once('value').then((snapshot) => {
      this.db.list('/tracks').update(track_id, {
        reposts: snapshot.val().reposts + 1
      })
    })
  }

  unRepostTrack(track_id) {
    this.db.database.ref('/users/' + this.auth.getCurrentUser().uid + '/reposts/' + track_id).remove();
    this.db.database.ref('/tracks/' + track_id).once('value').then((snapshot) => {
      this.db.list('/tracks').update(track_id, {
        reposts: snapshot.val().reposts - 1
      })
    })
  }

  getFollowing() {
    this.following = this.db.list('/users/' + this.auth.getCurrentUser().uid + '/following');
    return this.following;
  }

  followUser(user_id) {
    let currentUserId = this.auth.getCurrentUser().uid;
    this.db.database.ref('/users/' + this.auth.getCurrentUser().uid + '/following/').child(user_id).set(user_id);
    this.db.database.ref('/users/' + user_id + '/followers/').child(currentUserId).set(currentUserId);
  }

  unFollowUser(user_id) {
    let currentUserId = this.auth.getCurrentUser().uid;
    this.db.database.ref('/users/' + this.auth.getCurrentUser().uid + '/following/' + user_id).remove();
    this.db.database.ref('/users/' + user_id + '/followers/' + currentUserId).remove();
  }
}