import React, {Component, } from "react";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './createPosts.css'
import {Button, Card, Col} from "react-bootstrap";
import firebase from '../../utils/firebaseuti';
import Cookies from 'universal-cookie';
import {ClipLoader} from "react-spinners";


class CreatePosts extends Component{
    cookie  = new Cookies();
    constructor(props) {
        super( props );

        this.state = {
            post: '',
            title: '',
            loading: false,
            isLoggedIn: false
        }
        this.handleChangeOnPosts =   this.handleChangeOnPosts.bind(this);
        this.handleChangeOnTitle = this.handleChangeOnTitle.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChangeOnPosts( event ) {
        this.setState({post: event.target.value } );
    }

    handleChangeOnTitle ( event ) {
        this.setState({title: event.target.value})
    }

    handleSubmit( ) {
        this.setState({loading: true})

        const db =   firebase.firestore();

        db.collection('posts').add({
            body:  this.state.post,
            title:  this.state.title,
            created:  firebase.firestore.Timestamp.fromDate(new Date()).toDate(),
            createdBy: db.doc('users/'+ this.cookie.get('currentUser').uid),
            comments: []
        }).then(() => {
            this.setState({loading: false})
            window.location = '/'
        })
    }

    getData() {
            const db =   firebase.firestore();
            db.collection('posts').get().then( ( result ) => {

                const posts = [];
                result.forEach( (doc) => {

                    let post = doc.data();
                    post.id = doc.id;
                })

                console.log(posts)


                result.docs.map( (doc) => {
                    return{
                        title: doc.data().title,
                        body: doc.data().body,
                        createdAt:  doc.data().created,
                        createBy:doc.data().createdBy,
                    }
                })
            })



    }
    render() {
        return (
            <div  className="col-12" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "30px"
            }}>

                <Card style={{ width: '50rem', padding: "40px" }} >
                    <input style={{height: "50px"}} type="text"
                           className="form-control"
                           placeholder="Title"
                           onChange={this.handleChangeOnTitle}
                    />
                    <br/>
                            <textarea
                                className="form-control"
                                rows="10"
                                value={this.state.value}
                                placeholder="Text"
                                onChange={this.handleChangeOnPosts}
                            />
                    <br/>

                    <Col>
                        {
                            !this.cookie.get('currentUser') && (
                                <div>
                                    <h5>Please login to comment</h5>
                                </div>
                            )
                        }

                        {
                            this.cookie.get('currentUser') && (
                                <div>
                                    <Button variant="outline-primary" className='col-2'
                                            onClick={() => this.handleSubmit()} style={{marginRight: "30px"}}>
                                        <ClipLoader style={{   position: 'relative',
                                            'z-index': '99', margin: '10px' }} size={15} color={'#123abc'} loading={this.state.loading}>

                                        </ClipLoader>
                                        Post </Button>
                                    <Button variant="outline-primary" className='col-2' onClick={() => this.getData()}> Cancel </Button>
                                </div>

                            )
                        }

                    </Col>

                </Card>


            </div>
        )
    }
}

export default CreatePosts