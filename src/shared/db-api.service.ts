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
  users_list: FirebaseListObservable<any[]>;
  nfollowers: FirebaseListObservable<any[]>;
  nfollowing: FirebaseListObservable<any[]>;
  comments: FirebaseListObservable<any[]>;

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

  getComments(track_id) {
    this.comments = this.db.list('/comments/' + track_id);
    return this.comments;
  }

  addComment(track_id, comment) {
    this.comments.push({
      user_img: this.auth.getCurrentUser().photoURL,
      user_name: this.auth.getCurrentUser().displayName,
      body: comment,
      time: new Date().getTime()
    });
    this.db.database.ref('/tracks/' + track_id).once('value').then((snapshot) => {
      this.db.list('/tracks').update(track_id, {
        comments: snapshot.val().comments + 1
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