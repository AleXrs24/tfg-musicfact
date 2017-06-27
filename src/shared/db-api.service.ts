import { Storage } from '@ionic/storage';
import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AuthService } from './../providers/auth-service';
import { Platform } from 'ionic-angular';
import firebase from 'firebase';

@Injectable()
export class DbApiService {
  tracks: FirebaseListObservable<any[]>;
  lists: FirebaseListObservable<any[]>;
  likes: FirebaseListObservable<any[]>;
  reposts: FirebaseListObservable<any[]>;
  users: FirebaseListObservable<any[]>;
  following: FirebaseListObservable<any[]>;
  tracks_reposts: FirebaseListObservable<any[]>;
  tracks_posts: FirebaseListObservable<any[]>;
  users_list: FirebaseListObservable<any[]>;
  nfollowers: FirebaseListObservable<any[]>;
  nfollowing: FirebaseListObservable<any[]>;
  comments: FirebaseListObservable<any[]>;
  tracksList: FirebaseListObservable<any[]>;
  track: FirebaseObjectObservable<any>;
  notifications: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase, private auth: AuthService, private platform: Platform, private storage: Storage) {

  }

  // this.item = db.object('/item', { preserveSnapshot: true });
  // this.item.subscribe(snapshot => {
  //   console.log(snapshot.key)
  //   console.log(snapshot.val())
  // });

  saveUserToken(token) {
    this.db.database.ref('/users/' + this.auth.getCurrentUser().uid).child('token').set(token);
  }

  addNotification(userId) {
    this.db.database.ref('/users/' + userId + '/notifications/').child(this.auth.getCurrentUser().uid).child('time').set(new Date().getTime());
  }

  removeNotification(userId) {
    this.db.database.ref('/users/' + userId + '/notifications/' + this.auth.getCurrentUser().uid).remove();
  }

  getNotifications(): FirebaseListObservable<any[]> {
    this.notifications = this.db.list('/users/' + this.auth.getCurrentUser().uid + '/notifications');
    return this.notifications;
  }

  getCurrentUser() {
    return this.auth.getCurrentUser();
  }

  getTrack(idTrack): FirebaseObjectObservable<any> {
    this.track = this.db.object('/tracks/' + idTrack);
    return this.track;
  }

  getTracks(): FirebaseListObservable<any[]> {
    this.tracks = this.db.list('/tracks');
    return this.tracks;
  }

  getTracksFromList(idlist, iduser) {
    this.tracksList = this.db.list('/lists/' + iduser + '/' + idlist + '/tracks');
    return this.tracksList;
  }

  getLists(data): FirebaseListObservable<any[]> {
    this.lists = this.db.list('/lists/' + data);
    return this.lists;
  }

  getTracksReposts(data): FirebaseListObservable<any[]> {
    this.tracks_reposts = this.db.list('/users/' + data + "/reposts");
    return this.tracks_reposts;
  }

  getTracksPosts(data): FirebaseListObservable<any[]> {
    this.tracks_posts = this.db.list('/users/' + data + "/tracks");
    return this.tracks_posts;
  }

  getUsersList(data, follow): FirebaseListObservable<any[]> {
    if (follow == 'Seguidores')
      this.users_list = this.db.list('/users/' + data + "/followers");
    else
      this.users_list = this.db.list('/users/' + data + "/following");

    return this.users_list;
  }

  getNumFollowers(user): FirebaseListObservable<any[]> {
    this.nfollowers = this.db.list('/users/' + user + "/followers");
    return this.nfollowers;
  }

  getNumFollowing(user): FirebaseListObservable<any[]> {
    this.nfollowing = this.db.list('/users/' + user + "/following");
    return this.nfollowing;
  }

  getUsers(): FirebaseListObservable<any[]> {
    this.users = this.db.list('/users');
    return this.users;
  }

  signInWithFacebook(facebookData): firebase.Promise<void> {
    if (this.platform.is('cordova')) {
      //this.storage.clear();
      this.storage.set('name', facebookData.displayName);
      this.storage.set('image', facebookData.photoURL);
      return this.db.list('/users').update(facebookData.uid, {
        email: facebookData.email,
        name: facebookData.displayName,
        profile_image: facebookData.photoURL
      });
    } else {
      //this.storage.clear();
      this.storage.set('name', facebookData.user.displayName);
      this.storage.set('image', facebookData.user.photoURL);
      return this.db.list('/users').update(facebookData.user.uid, {
        email: facebookData.user.email,
        name: facebookData.user.displayName,
        profile_image: facebookData.user.photoURL
      });
    }
  }

  signInWithCredentials(data, form, image): firebase.Promise<any> {
    return this.db.list('/users').update(data.uid, {
      email: data.email,
      name: form.name,
      country: form.country,
      profile_image: image
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

  repostPrivateTrack(track_id) {
    this.repostTrack(track_id);
    this.db.list('/tracks').update(track_id, {
      privacy: 'Pública'
    });
  }

  unRepostTrack(track_id) {
    this.db.database.ref('/users/' + this.auth.getCurrentUser().uid + '/reposts/' + track_id).remove();
    this.db.database.ref('/tracks/' + track_id).once('value').then((snapshot) => {
      this.db.list('/tracks').update(track_id, {
        reposts: snapshot.val().reposts - 1
      })
    })
  }

  getComments(track_id) {
    this.comments = this.db.list('/comments/' + track_id);
    return this.comments;
  }

  addComment(track_id, comment, image, name) {
    this.comments.push({
      user_img: image,
      user_name: name,
      body: comment,
      time: new Date().getTime(),
      user_id: this.getCurrentUser().uid
    });
    this.db.database.ref('/tracks/' + track_id).once('value').then((snapshot) => {
      this.db.list('/tracks').update(track_id, {
        comments: snapshot.val().comments + 1
      })
    })
  }

  removeComment(track_id, comment_id) {
    this.db.database.ref('/comments/' + track_id + '/' + comment_id).remove();
    this.db.database.ref('/tracks/' + track_id).once('value').then((snapshot) => {
      this.db.list('/tracks').update(track_id, {
        comments: snapshot.val().comments - 1
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

  newList(privacy, trackid, coverpage, title, creator) {
    let currentUser = this.getCurrentUser();
    this.getLists(currentUser.uid);
    let list_id;
    list_id = this.lists.push({
      coverpage: coverpage, creator: creator, ntracks: 1, title: title, privacy: privacy
    }).key;

    this.db.database.ref('/lists/' + currentUser.uid + '/' + list_id + '/tracks/').child(trackid).child('time').set(new Date().getTime());
  }

  addTrackToList(idlist, idtrack) {
    let currentUserId = this.auth.getCurrentUser().uid;
    this.db.database.ref('/lists/' + currentUserId + '/' + idlist + '/tracks/').child(idtrack).child('time').set(new Date().getTime());
    this.db.database.ref('/lists/' + currentUserId + '/' + idlist).once('value').then((snapshot) => {
      this.db.list('/lists/' + currentUserId).update(idlist, {
        ntracks: snapshot.val().ntracks + 1
      })
    })
  }

  uploadToDatabase(artist, artist_img, audio, coverpage, track) {
    let track_id;
    let currentUserId = this.auth.getCurrentUser().uid;
    track_id = this.tracks.push({
      artist: artist, artist_img: artist_img, audio: audio, cover_page: coverpage, privacy: track.privacy, artist_id: currentUserId,
      tag: track.tag, title: track.title, comments: 0, likes: 0, reposts: 0
    }).key;

    this.db.database.ref('/users/' + currentUserId + '/tracks/').child(track_id).set(track_id);

    if (track.privacy == 'Pública') {
      this.repostTrack(track_id);
    }

  }

}