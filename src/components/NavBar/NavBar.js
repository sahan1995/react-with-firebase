import React, {Component, useState} from "react";
import './NavBar.css'
import  {Container,NavDropdown, Dropdown, Modal, Navbar, Form, FormControl} from "react-bootstrap";
import {Nav} from "react-bootstrap";
import {Button} from "react-bootstrap";
import {Row} from "react-bootstrap";
import {Col} from "react-bootstrap";
import firebase from "../../utils/firebaseuti";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import Cookies from 'universal-cookie';

class NavBar extends Component{
    cookie  = new Cookies();
    currentUser = {};
    constructor() {
        super();
        this.state = {
            modelStatus : false,
            isSignedIn: false
        }
    }
    uiConfig = {
        signInFlow: "popup",
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccess: () => {
                this.cookie.set("currentUser", firebase.auth().currentUser)
                this.currentUser = this.cookie.get('currentUser');
                console.log(this.currentUser)
                firebase.firestore().collection("users")
                    .where("uid", "==", this.currentUser.uid)
                    .get()
                    .then( async ( result ) => {
                     const user = result.docs.map((doc) => { return doc.data()})[0]
                        if ( !user ) {
                         const test =  await firebase.firestore().collection('users')
                                .add(
                                    {
                                        uid:  this.currentUser.uid,
                                        name: this.currentUser.displayName
                                    }
                                );

                        }
                        window.location.reload();
                    })
                this.setState({modelStatus: false });
            },
        }
    }

    componentDidMount() {
        if ( this.cookie.get('currentUser')) {
            this.currentUser = this.cookie.get('currentUser');
            this.setState({isSignedIn: true})
            return ;
        }
        firebase.auth().onAuthStateChanged( user => {
            this.setState({isSignedIn: !!user })
            this.setState({modelStatus: false });
        })

    }

    handleModel() {
        this.setState({modelStatus: !this.state.modelStatus } )
    }

    render() {

        return (
            <Navbar bg="light" expand="lg" className="navBar">
                <Navbar.Brand href="#home">Demo Application - React</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <span>
                            {
                                this.state.isSignedIn ? (
                                    <div>
                                        <Row>
                                            <Col xs={3}>
                                                <img className="profile-image" src={this.currentUser.photoURL}/>
                                            </Col>
                                            <Col>
                                                <Dropdown>
                                                    <Dropdown.Toggle id="dropdown-basic">
                                                        {this.currentUser.displayName}
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => firebase.auth().signOut().then(( user ) => {
                                                            this.setState({isSignedIn: !!user })
                                                            this.cookie.remove('currentUser')
                                                            this.currentUser = {};
                                                            window.location.reload();
                                                        })}>Sign Out</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Col>
                                        </Row>


                                    </div>
                                ): (
                                    <span>
                                         <Button variant="outline-primary" className="test">Login</Button>
                                         <Button onClick={() => { this.handleModel() } } variant="primary">SignUp</Button>
                                    </span>

                                )
                            }
                        </span>


                        <Modal show={this.state.modelStatus} onHide={() => this.handleModel()}  size="md"
                               aria-labelledby="contained-modal-title-vcenter"
                               centered >
                            {/*<Modal.Header closeButton>*/}
                            {/*    /!*<Modal.Title  id="contained-modal-title-vcenter" >Join With Us</Modal.Title>*!/*/}
                            {/*</Modal.Header >*/}
                            <Modal.Body>

                                    <Row>
                                        <Col>
                                                <h4 className="font-montserrat"> <b> Sign up </b> </h4>
                                            <label className="font-montserrat">By continuing, you agree to our <a href="#">User Agreement</a> <br/>
                                                and <a href="#"> Privacy Policy </a> </label>
                                            <br/>
                                            <br/>
                                            <Col xs={8}>

                                                <StyledFirebaseAuth
                                                uiConfig={this.uiConfig}
                                                firebaseAuth={firebase.auth()}
                                                />
                                            </Col>

                                        </Col>
                                    </Row>

                            </Modal.Body>
                        </Modal>


                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }



}

export default NavBar