import React, {Component} from "react";
import {Container, Accordion,Alert,  Card, Col, Row, FormControl ,Modal} from "react-bootstrap";

import Button from '@material-ui/core/Button';
import ModeCommentIcon from '@material-ui/icons/ModeComment';
import Skeleton from '@material-ui/lab/Skeleton'
import './Posts.css'


import firebase from "../../utils/firebaseuti";
import Cookies from 'universal-cookie';
import {Directions} from "@material-ui/icons";
class Posts extends Component{
    cookie  = new Cookies();
    db = firebase.firestore();
    txtComment;
    divComment
    skeletons = [1,2,3,4,5]
    constructor() {
        super();
        this.state = {
            redirect: false,
            posts: [],
            modalStatus : false,
            postDetailView:{
                createdBy: '',
                comments:[],
            },
            comment: '',
            homePageLoading: true,
            isDetailViewLoading: true
        }
        this.bindComment =   this.bindComment.bind(this);

        this.txtComment = React.createRef();
    }

    createPostOnClick() {
        window.location = '/submit';
    }

    handleModal() {
        this.setState({modalStatus: !this.state.modalStatus})
    }

    bindComment( event ) {
        this.setState({comment :  event.target.value })
    }

    openDetailView( Id ) {
        this.setState({ modalStatus: true, isDetailViewLoading: true, postDetailView:{
                createdBy: '',
                comments:[],
            },})

        this.db.collection("posts").doc(Id).onSnapshot(  ( async snapshot => {

            const selectedPosts =  snapshot.data()
            selectedPosts.id = snapshot.id
            selectedPosts.createdBy = await  this.db.collection('users')
                .where( 'uid', '==', selectedPosts.createdBy.id)
                .get().then(( res ) =>
                { return res.docs.map(( d ) => {return d.data()})[0]});

            for (const comment of selectedPosts.comments) {
                comment.createdBy =  await this.db.collection('users')
                    .where( 'uid', '==', comment.createdBy.id)
                    .get().then(( res ) =>
                    { return res.docs.map(( d ) => {return d.data()})[0]});
            }

            this.setState({postDetailView : selectedPosts, isDetailViewLoading: false} )
        }))
    }

    uploadComment( event ) {

        this.db.collection('posts').doc(this.state.postDetailView.id)
            .update({
                comments: firebase.firestore.FieldValue.arrayUnion({
                                createdBy: this.db.doc('users/'+ this.cookie.get('currentUser').uid),
                                comment: this.state.comment
                })
            })
        this.state.postDetailView.comments.push(
            {
                createdBy: {
                    name: this.cookie.get('currentUser').displayName,
                    id: this.cookie.get('currentUser').uid,
                },
                comment: this.state.comment
            }
        )


        this.setState({postDetailView : this.state.postDetailView })
        this.setState({comment: ''})
        this.txtComment.current.value = '';
        this.divComment.scrollIntoView({ behavior: "smooth" })
        // window.scrollTo(0, this.divComment.current.offsetTop)
    }

    componentDidMount() {

        this.db.collection("posts").orderBy("created", "desc")
            .onSnapshot(( snapshot =>  {
                const post = [];
                snapshot.docs.forEach( async (doc) => {
                    const ref = doc.data();
                    ref.id = doc.id;
                    ref.createdBy = await  this.db.collection('users')
                        .where( 'uid', '==', doc.data().createdBy.id)
                        .get().then(( res ) =>
                        { return res.docs.map(( d ) => {return d.data()})[0]});
                    post.push( ref );
                    this.setState({
                        posts: post,
                        homePageLoading: false
                    })
                })
            }))
    }

    render() {
        return (
            <div style={{
                position: 'absolute', left: '50%', top: '40%',
                transform: 'translate(-50%, -50%)',
                height: '500px',
            }}>

                { this.state.homePageLoading && (
                    <Row>
                        <Col lg={12}>
                            <Skeleton variant="text"  height="50px"/>

                        </Col>
                    </Row>
                ) }
                {
                   !this.state.homePageLoading && (
                       <div className="card">
                           <Row>
                               <Col>
                                   <FormControl type="text" placeholder="Create Posts" className="mr-sm-2" onClick={() => this.createPostOnClick() }/>
                               </Col>

                           </Row>
                       </div>
                   )
                }
                <br/>

                { this.state.homePageLoading && this.skeletons.map(( d ) => {
                    return(
                        <Row>
                            <Col lg={12}>
                                <Skeleton variant="text"  height="300px" style={{ width: '50rem' }}/>

                            </Col>
                        </Row>
                    )
                }
                ) }

                {
                    !this.state.homePageLoading && (
                        <div>
                            <label className="font-montserrat"><b>Poplar Posts </b> </label>
                        </div>
                    )
                }

                <Row>
                    <Col>
                        {
                            this.state.posts.map(((value, index) => {
                                return(
                                    <div >
                                        <Card style={{ width: '50rem' }}>
                                            <Container>
                                                <Row>
                                                    <Col xs={1}>

                                                    </Col>
                                                    <Col xs={9}>
                                                        <Card.Body>
                                                            <Card.Title>
                                                                <Card.Subtitle > <b> {value.title} </b>
                                                                   <label className="mb-2 text-muted"><span style={{fontSize: '14px', marginLeft: '20px', marginRight: '6x'}}>
                                                                       Posted by
                                                                   </span>   {value.createdBy.name}  </label> </Card.Subtitle>
                                                            </Card.Title>
                                                            {/*<Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>*/}
                                                            <Card.Text>
                                                                {value.body}
                                                            </Card.Text>
                                                            <footer>

                                                                {/*<Accordion.Toggle as={Button} eventKey="1">*/}
                                                                    <Button
                                                                        onClick={() => {this.openDetailView(value.id)}}
                                                                        style={{fontSize: '12px'}}
                                                                        startIcon={<ModeCommentIcon  style={{fontSize: '12px'}}/>}
                                                                    >
                                                                        {value.comments.length} Comments
                                                                    </Button>

                                                            </footer>
                                                        </Card.Body>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </Card>
                                        <br/>

                                    </div>
                                )
                            }))
                        }

                    </Col>
                </Row>


                {/*<h1>Posts</h1>*/}
                <Modal show={this.state.modalStatus}
                       onHide={() => this.handleModal()}
                       size="lg"
                       aria-labelledby="contained-modal-title-vcenter"
                       centered>
                    <Modal.Body>

                        <Row>
                            <Col>

                                { this.state.isDetailViewLoading && (
                                    <Row>
                                        <Col lg={12}>
                                            <Skeleton variant="text"  height="50px"/>

                                        </Col>
                                    </Row>
                                ) }

                                { !this.state.isDetailViewLoading && (
                                    <h4 className="font-montserrat"> <b> {this.state.postDetailView.title} </b>  </h4>
                                )}
                                { this.state.isDetailViewLoading && (
                                    <Row>
                                        <Col lg={6}>
                                            <Skeleton variant="text"  height="50px"/>

                                        </Col>
                                    </Row>
                                ) }

                                { !this.state.isDetailViewLoading && (
                                    <label className="font-montserrat">Posted by {this.state.postDetailView.createdBy.name}  on
                                        { this.state.postDetailView.created && this.state.postDetailView.created.toDate().toDateString()}</label>

                                )}

                                <Col xs={12}>
                                    { this.state.isDetailViewLoading && (
                                        <Row>
                                            <Col lg={12}>
                                                <Skeleton variant="text"  height="300px"/>

                                            </Col>
                                        </Row>
                                    ) }

                                    { !this.state.isDetailViewLoading && (
                                        <p><span> {this.state.postDetailView.body}</span></p>
                                    )}

                                 <br/>

                                    { this.state.isDetailViewLoading && this.skeletons.map(( d ) => {
                                        return (
                                            <Row>
                                                <Col lg={12}>
                                                    <Skeleton variant="text"  height="30px"/>

                                                </Col>
                                            </Row>
                                        )
                                    })}

                                    {
                                        !this.state.isDetailViewLoading && (
                                            <label><b>Comments</b></label>
                                        )
                                    }


                                    <Col xs={12} className="comment"  ref={(el) => { this.divComment = el; }}>
                                        { this.state.postDetailView.comments.length<=0 &&
                                        !this.state.isDetailViewLoading && (<div> Be the first commenter </div>)}
                                        {
                                            this.state.postDetailView.comments && this.state.postDetailView.comments.map(( comment ) => {
                                                return(
                                                <div>
                                                    <p>By {comment.createdBy.name}</p>
                                                    <Alert variant="dark">
                                                        {comment.comment}
                                                    </Alert>
                                                </div>
                                                )
                                            })
                                        }
                                    </Col>
                                    <br/>

                                    {
                                        !this.cookie.get('currentUser') && !this.state.isDetailViewLoading && (
                                            <div>
                                                <h5>Please login to comment</h5>
                                            </div>
                                        )
                                    }

                                    {
                                        !this.state.isDetailViewLoading  && this.cookie.get('currentUser') && (
                                            <Row>
                                                <Col>
                                                    <FormControl type="text" placeholder="What you think"
                                                                 className="txtComment"
                                                                 ref={this.txtComment}
                                                                 onChange={this.bindComment}/>
                                                </Col>

                                                <Button onClick={() => { this.uploadComment()}}> Upload </Button>

                                            </Row>
                                        )
                                    }


                                </Col>
                            </Col>
                        </Row>

                    </Modal.Body>

                </Modal>

            </div>

        )

    }
}
export default Posts
