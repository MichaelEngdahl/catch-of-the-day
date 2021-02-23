import React from "react";
import PropTypes from "prop-types";
import firebase from "firebase";
import AddFishForm from "./AddFishForm";
import EditFishForm from "./EditFishForm";
import Login from "./login";
import base, { firebaseApp } from "../base";


class Inventory extends React.Component {
  static propTypes = {
    fishes: PropTypes.shape({
      image: PropTypes.string,
      name: PropTypes.string,
      desc: PropTypes.string,
      status: PropTypes.string,
      price: PropTypes.number,
    }),
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func,
    loadSampleFish: PropTypes.func,
  };
  state = {
    uid: null,
    owner: null
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.authHandler({user})
      }
    })
  }

  authHandler = async authData => {
    alert("tjong")
    console.log("ddfdf: ",authData)
    // 1 .Look up the current store in the firebase database
    const store = await base.fetch(this.props.storeId, { context: this });
    console.log(store);
    // 2. Claim it if there is no owner
    if (!store.owner) {
      // save it as our own
      await base.post(`${this.props.storeId}/owner`, {
        data: authData.user.uid
      });
    }
    // 3. Set the state of the inventory component to reflect the current user
    this.setState({
      uid: authData.user.uid,
      owner: store.owner || authData.user.uid
    }); /**/
  };

  authenticate = provider => {
    alert(provider)
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    firebaseApp
      .auth()
      .signInWithPopup(authProvider)
      .then(this.authHandler);
  };

  logout = async () => {
    console.log("logout")
    await firebase.auth().signOut();
    this.setState({uid: null})
  }
  render() {
    const logout = <button onClick={this.logout}>Log Out!</button>
    // 1. Check if they are logged in
    if(!this.state.uid) {
      console.log("one")
      return <Login authenticate={this.authenticate} />;
    }
    // 2. check if they are the current owner
    if(this.state.uid !== this.state.owner) {
      console.log("two")
      return (
        <div>
          <p>Sorry you are not the owner!</p>
          {logout}
        </div>
      )
    }
    // 3. They most be the owner just render the inventory
    return (
      <div className="inventory">
        <h2>inventory</h2>
        {logout}
        {Object.keys(this.props.fishes).map((key) => (
          <EditFishForm
            key={key}
            index={key}
            fish={this.props.fishes[key]}
            updateFish={this.props.updateFish}
            deleteFish={this.props.deleteFish}
          />
        ))}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSampleFish}>Load Sample Fishes</button>
      </div>
    ); 
  }
}

export default Inventory;
